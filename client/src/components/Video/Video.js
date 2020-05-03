import React from 'react';
import axios from 'axios';
import classes from './Video.module.css';
import Aux from '../../hoc/Aux/Aux';
import { connect } from 'twilio-video';

import Button from '../Button /Button';

class VideoComponent extends React.Component {
  constructor(props) { 
    super(props)
    this.state = {
      token: null,
      roomName: null,
      newRoomName: null,
      roomToJoin: null,
      room: null, 
      localMedia: { 
        localVideoPublication: null, 
        localAudioPublication: null, 
        displayLocalVideo: false, 
        addLocalAudio: false
      }, 
      remoteMedia: { 
        removePublication: null
      }
    };   
  }

  getToken = () => {
    axios.get('/token', {params: {room: this.state.roomToJoin } })
    .then(results => {
      const { token } = results.data;
      this.setState({ token });
    })
    .then(() => this.joinRoom())
    .catch(error => {
      alert(error)
    });
  }
  
  alertRoomWasSuccessfullyCreated = () => { 
    alert(`${this.state.roomName} successfully created!`)
  }

  createRoom = () => { 
    axios.post('/room', {roomName: this.state.newRoomName } )
    .then(response => {
      this.setState({ 
        room: response, 
        roomName: response.data.room.uniqueName 
      })
    })
    .then(() => this.alertRoomWasSuccessfullyCreated())
    .catch( error => { 
      alert(error)
      console.log(error.message)
    })
  }

  notifyUserThatRoomWasJoined = () => {
    alert(`successfully joined ${this.state.roomToJoin}`);
  }

  notifyLocalUserWhenParticipantEntersRoom = (room) => { 
    room.on('participantConnected', participant => {
      console.log(`${participant} connected`);
    });
  }


  joinRoom = () => { 
    connect(this.state.token, {name: this.state.roomToJoin }).then(room => {
      this.notifyUserThatRoomWasJoined()
      this.setState({room: room})
      this.notifyLocalUserWhenParticipantEntersRoom(room)
      this.addLocalMediaToState()
    }, error => {
      console.error(error.message);
    });

  }


  handleNewRoomNameChange = event => {
    let newRoomName = event.target.value;
    this.setState({ newRoomName })
  }

  handleRoomToJoin = event => { 
    let roomToJoin = event.target.value;
    this.setState({ roomToJoin })
  }

  displayLocalParticiantVideo = () => { 
    let localPublication = this.state.localMedia.localVideoPublication;
    let localVideoContainer = document.getElementById(`localVideo`)
    localVideoContainer.appendChild(localPublication.track.attach())
    let localMedia = this.state.localMedia
    
    this.setState({ localMedia: { 
      ...localMedia, 
      displayLocalVideo: true }})
  }

  addLocalParticipantAudio = () => { 
    let localPublication = this.state.localMedia.localAudioPublication;
    let localAudioContainer = document.getElementById(`localAudio`)
    localAudioContainer.appendChild(localPublication.track.attach())
    let localMedia = this.state.localMedia

    this.setState({
      localMedia: {
        ...localMedia,
        addLocalAudio: true
      }
    })
  }

  //Turning a Map into an array using the Array from method
  getPublications = () => (
    Array.from(this.state.room.localParticipant.tracks.values())
  )

  addLocalMediaToState = () => {
    let localMediaPublications = this.getPublications()
    localMediaPublications.forEach(localPublication => { 
      let localMedia = this.state.localMedia
      
      if (localPublication.kind === 'video') { 
        this.setState({
          localMedia: {
            ...localMedia,
            localVideoPublication: localPublication
          }})
      } 

      if (localPublication.kind === 'audio') {
        this.setState({
          localMedia: {
            ...localMedia,
            localAudioPublication: localPublication
          }
        })
      } 
    })
  }

  getRemoteParticipants = () => ( 
    this.state.room.participants
  )

  remoteMedia = () => {
      this.getRemoteParticipants().forEach(participant =>{ 
      participant.tracks.forEach( p =>{ 
        if (p.isSubscribed) { this.attachMedia(p)}
      })
    })
  }

  removeLocalVideo = () => { 
    let localVideoContainer = document.getElementById(`localVideo`)
    localVideoContainer.removeChild(localVideoContainer.childNodes[0])
    let localMedia = this.state.localMedia
    
    this.setState({ localMedia: { 
      ...localMedia,
      displayLocalVideo: false 
    }})
  }

  removeLocalAudio = () => {
    let localAudioContainer = document.getElementById(`localAudio`)
    localAudioContainer.removeChild(localAudioContainer.childNodes[0])
    let localMedia = this.state.localMedia

    this.setState({
      localMedia: {
        ...localMedia,
        addLocalAudio: false
      }
    })
  }


  render() { 
      let toggleLocalVideo = this.state.localMedia.displayLocalVideo 
        ? <Button click={this.removeLocalVideo}>Hide Video</Button>
        : <Button click={this.displayLocalParticiantVideo}>Display Video</Button>

      let toggleLocalAudio = this.state.localMedia.addLocalAudio 
        ? <Button click={this.removeLocalAudio}>Mute</Button>
        : <Button click={this.addLocalParticipantAudio}>Unmute</Button>

    return (
      <Aux>
        <div className={classes.localMedia} id='localVideo'></div>
        <div id='localAudio'></div>

        <nav className={classes.Control}>
          <div>
            <Button 
              click={this.createRoom}>Create Room</Button>
            <input 
              className={classes.Input}
              onChange={this.handleNewRoomNameChange} />
          </div>
          <div>
            <Button 
              click={this.getToken}>Join Room</Button>
            <input 
              className={classes.Input}
              onChange={this.handleRoomToJoin}/>
          </div>
            {toggleLocalVideo}
            {toggleLocalAudio}
        </nav>
      </Aux>
    );
  }  
  
}

export default VideoComponent; 