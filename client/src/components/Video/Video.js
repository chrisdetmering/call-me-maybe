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
      room: null, 
      localParticipants: 0, 
      remoteParticipants: 0 
    };   
  }

  getToken = () => {
    axios.get('/token').then(results => {
      const { identity, token, roomName } = results.data;
      this.setState({ identity, token, roomName });

    }).catch(error => {
      console.log(error)
    });
  }
  
  createRoom = () => { 
    axios.post('/room', {} )
    .then(room => {
      console.log(room)
      this.setState({ room })
    }).catch( error => { 
      console.log(error.message)
    })
  }

  joinRoom = () => { 
    connect(this.state.token, {}).then(room => {
      console.log(`joined a Room: ${room}`);
      this.setState({room: room})
      room.on('participantConnected', participant => {
        console.log(`Participant connected: ${participant}`);
      });
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });

  }

  handleRoomNameChange = (event) => { 
    let roomName = event.target.value;
    this.setState({ roomName })
  }

  localMedia = () => {
    let mediaContainer = document.getElementById('localMedia')
    console.log(mediaContainer)
    let pub = Array.from(this.state.room.localParticipant.tracks.values())
    pub.forEach(p => { 
      mediaContainer.appendChild(p.track.attach())
    })
  }

  remoteMedia = () => {
    let mediaContainer = document.getElementById('remoteMedia')
    console.log(mediaContainer)
   this.state.room.participants.forEach(part =>{ 
     part.tracks.forEach( p =>{ 
       if (p.isSubscribed) { 
         mediaContainer.appendChild(p.track.attach())
       }
     })
    
    })
  }

  render() { 

    return (
      <Aux>
        <div>
          <div id='localMedia' className={classes.localMedia}></div>
          <div id='remoteMedia'></div>
        </div>

        <nav className={classes.Control}>
          <Button 
            click={this.createRoom}>Create Room</Button>
          <Button
            click={this.getToken}>Get Token</Button>
          <Button 
            click={this.joinRoom}>Join Room</Button>
          <Button 
            click={this.localMedia}>LocalMedia</Button>
          <Button 
            click={this.remoteMedia}>remoteMedia</Button>
        </nav>
      </Aux>
    );
  }  
  
}

export default VideoComponent; 