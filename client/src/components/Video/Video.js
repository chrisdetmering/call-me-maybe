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
      remoteParticipants: 0, 
      videosOnScreen: 0
    };   
  }

  componentDidMount () {
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
          <Button 
            click={this.joinRoom}>Join Room</Button>
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