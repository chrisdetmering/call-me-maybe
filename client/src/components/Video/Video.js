import React from 'react';
import axios from 'axios';
import classes from './Video.module.css';
import Aux from '../../hoc/Aux/Aux';
import { connect } from 'twilio-video';

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
      <Aux class={classes.Control}>
        <button 
          onClick={this.createRoom}
          className={classes.Button}>Create Room</button>
        <button
          onClick={this.getToken}
          className={classes.Button}>Get Token</button>
        <button 
          onClick={this.joinRoom}
          className={classes.Button}>Join Room</button>
        <button 
          onClick={this.localMedia}
          className={classes.Button}>LocalMedia</button>
        <button 
          onClick={this.remoteMedia}
          className={classes.Button}>remoteMedia</button>
        
          
          <div id='localMedia'></div>
          <div id='remoteMedia'></div>

      </Aux>
    );
  }  
  
}

export default VideoComponent; 