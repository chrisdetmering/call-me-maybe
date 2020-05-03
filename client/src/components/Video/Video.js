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
      identity: null,
      token: null,
      roomName: '',
      newRoomName: '',
      roomToJoin: '',
      room: null, 
      localParticipants: 0, 
      remoteParticipants: 0, 
      videosOnScreen: 0
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
      alert(`You had the following error: ${error}`)
    });
  }
  
  createRoom = () => { 
    axios.post('/room', {roomName: this.state.newRoomName } )
    .then(response => {
      this.setState({ 
        room: response, 
        roomName: response.data.room.uniqueName 
      })
    }).catch( error => { 
      alert(error)
      console.log(error.message)
    })
  }

  joinRoom = () => { 
    connect(this.state.token, {name: this.state.roomToJoin }).then(room => {
      console.log(`joined a Room: ${room}`);
      this.setState({room: room})
      room.on('participantConnected', participant => {
        console.log(`Participant connected: ${participant}`);
      });
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
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

  attachMedia = (p) => { 
    let mediaContainer = document.getElementById('media')
    let cont = document.createElement('div')
   
    if (p.track.kind === 'audio') {
      mediaContainer.appendChild(p.track.attach())
    } else { 
      cont.appendChild(p.track.attach())
      mediaContainer.appendChild(cont)
    }
    
    this.addToVideoCount()
  }

  addToVideoCount = () => {
    let videosOnScreen = this.state.videosOnScreen + 1;
    this.setState({ videosOnScreen })
  }

  localMedia = () => {
    if (this.checkNumVideos()) {
      let pub = Array.from(this.state.room.localParticipant.tracks.values())
      pub.forEach(p => { 
        this.attachMedia(p)
      })
    }
  }

  checkNumVideos = () => (this.state.videosOnScreen < 2)

  remoteMedia = () => {
    if (this.checkNumVideos()) {
      this.state.room.participants.forEach(part =>{ 
        part.tracks.forEach( p =>{ 
          if (p.isSubscribed) { this.attachMedia(p)}
        })
      })
    }
  }

  render() { 

    return (
      <Aux>
        <div>
          <div className={classes.Media} id='media'></div>
        </div>

        <nav className={classes.Control}>
          <Button 
            click={this.createRoom}>Create Room</Button>
          <input 
            className={classes.Input}
            onChange={this.handleNewRoomNameChange} />
          <Button 
            click={this.getToken}>Join Room</Button>
          <input 
            className={classes.Input}
            onChange={this.handleRoomToJoin}/>
          <Button 
            click={this.localMedia}>Show Video</Button>
          <Button 
            click={this.remoteMedia}>remoteMedia</Button>
        </nav>
      </Aux>
    );
  }  
  
}

export default VideoComponent; 