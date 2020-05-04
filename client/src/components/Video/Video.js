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
      room: null, 
      localMedia: { 
        localVideoPublication: null, 
        localAudioPublication: null, 
        displayLocalVideo: false, 
        addLocalAudio: false
      }, 
      remoteMedia: { 
        remotePublication: null
      }, 
      roomJoinedSuccessfully: null, 
      remoteMediaAvalable: false
    };   
  }

  getToken = () => {
    axios.get('/token', {params: {room: this.state.newRoomName } })
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
    alert(`successfully joined ${this.state.newRoomName}`);
    this.setState({ roomJoinedSuccessfully: true })
  }

  notifyLocalUserWhenParticipantEntersRoom = (room) => { 
    room.on('participantConnected', participant => {
      console.log(`${participant} connected`);
      this.setState({ remoteMediaAvalable: true })
    });
  }


  joinRoom = () => { 
    connect(this.state.token, {name: this.state.newRoomName }).then(room => {
      this.notifyUserThatRoomWasJoined()
      this.setState({room: room})
      this.notifyLocalUserWhenParticipantEntersRoom(room)
      this.addLocalMediaToState()
    }, error => {
      console.error(error.message);
      alert('not able to join room.. Check your spelling!')
      this.setState({ newRoomName: null })
    })

  }


  handleNewRoomNameChange = event => {
    let newRoomName = event.target.value;
    this.setState({ newRoomName })
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

  addRemoteMedia = () => {
   this.state.room.participants.forEach(participant =>{ 
      participant.tracks.forEach( p =>{ 
        if (p.isSubscribed) { 
          this.attachRemoteParticipantMedia(p)
        }
      })
    })
  }

  attachRemoteParticipantMedia = (p) => { 
    let remoteMediaContainer = document.getElementById('remoteMedia')
    remoteMediaContainer.appendChild(p.track.attach())
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

  removeRemoteMedia = () => {
    let remoteMediaContainer = document.getElementById(`remoteMedia`)

    if (remoteMediaContainer.childNodes.length > 0 ) { 
      remoteMediaContainer
      .removeChild(remoteMediaContainer.childNodes[0])
    }
  }



  leaveRoom = () => { 
    let room = this.state.room
    room.disconnect()
    this.disconnectMediaTracksFromRoom(room)
    alert('you left the room')
    this.checkAndRemoveLocalMediaFromUI()
    this.removeRemoteMedia()
    this.setState({ 
      roomJoinedSuccessfully: false, 
      token: null,
      roomName: null,
      newRoomName: null,
      room: null
     })
  }

  checkAndRemoveLocalMediaFromUI = () => { 
    if (this.state.localMedia.displayLocalVideo) { this.removeLocalVideo() }
    if (this.state.localMedia.addLocalAudio) { this.removeLocalAudio() }
  }

  disconnectMediaTracksFromRoom = (room) => { 
    room.on('disconnected', room => {
      // Detach the local media elements
      console.log('disconnected')
      room.localParticipant.tracks.forEach(publication => {
        const attachedElements = publication.track.detach();
        attachedElements.forEach(element => element.remove());
      });
    });
  }

  render() { 
      let toggleLocalVideo = this.state.localMedia.displayLocalVideo 
        ? <Button click={this.removeLocalVideo}>Hide Video</Button>
        : <Button click={this.displayLocalParticiantVideo}>Display Video</Button>

      let toggleLocalAudio = this.state.localMedia.addLocalAudio 
        ? <Button click={this.removeLocalAudio}>Mute</Button>
        : <Button click={this.addLocalParticipantAudio}>Unmute</Button>


      let showControls = this.state.roomJoinedSuccessfully 
        ? <div style={{display: 'flex'}}>
          {toggleLocalVideo}
          {toggleLocalAudio}

          <Button
            click={this.addRemoteMedia}>Remote Media</Button>

          <Button
            click={this.leaveRoom}>Leave Call</Button>
        </div>
        : <div style={{display: 'flex'}}>
          
            <Button
              click={this.createRoom}
              input={true}
              change={this.handleNewRoomNameChange}
              value={this.state.newRoomName}>Create Room</Button>
         
            <Button
              click={this.getToken}
              input={true}
              change={this.handleNewRoomNameChange}
              value={this.state.newRoomName}>Join Room</Button>
          </div>
 

    return (
      <Aux>
        <h1 style={{textAlign: 'center'}}>Room Name: {this.state.newRoomName}</h1>
        <div className={classes.mediaContainer}>
          <div className={classes.localMedia} id='localVideo'></div>
            <div id='localAudio'></div>
          <div className={classes.remoteMedia} id='remoteMedia'></div>
    

        </div>
        <nav className={classes.Control}>
          {showControls}
        </nav>
      </Aux>
    );
  }  
  
}

export default VideoComponent; 