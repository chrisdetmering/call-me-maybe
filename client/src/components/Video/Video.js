import React, { createRef } from 'react';
import axios from 'axios';
import classes from './Video.module.css';
import Aux from '../../hoc/Aux/Aux';
import {connect } from 'twilio-video';

class VideoComponent extends React.Component {
  constructor(props) { 
    super(props)
    this.state = {
      identity: null,
      token: null,
      roomName: '',   
      roomNameErr: false,
      localMediaAvailable: true, 
      hasJoinedRoom: false
    };
    this.localMedia = createRef();
    this.remoteMedia = createRef();
  }
  
  
  componentDidMount() {
    axios.get('/token').then(results => {
      const { identity, token } = results.data;
      this.setState({ identity, token });

    }).catch(error => { 
      console.log(error)
    });
  }


  joinRoom = () => { 
    let connectOptions = {
      name: this.state.roomName
    };

    connect(this.state.token, connectOptions).then(this.roomJoined, error => {
      alert(error.message);
    });
  }


  joinLocalPerticipant = (room) => { 
    let publications = Array.from(room.localParticipant.tracks.values())
    let mediaContainer = this.localMedia.current

    publications.forEach(publication => {
      mediaContainer.appendChild(publication.track.attach())
    })
  }


  roomJoined = (room) => {
    this.joinLocalPerticipant(room)
    console.log(room.participants)
    room.participants.forEach(participant => {
      console.log(participant.identity);
    });

  }

  leaveRoom = () => {
    
  }

  handleRoomNameChange = (event) => { 
    let roomName = event.target.value;
    this.setState({ roomName })
  }


  render() { 

    let showLocalTrack = this.state.localMediaAvailable ? (
      <div><div ref={this.localMedia}  /> </div>) : null; 

    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <button onClick={this.leaveRoom}>Leave</button>) : (
      <button onClick={this.joinRoom}>Join</button>);

    return (
      <Aux>
        {showLocalTrack}
        {joinOrLeaveRoomButton}
        <input 
          className={classes.Input}
          onChange={this.handleRoomNameChange}
          value={this.state.roomName}/>
        <div className="" ref={this.remoteMedia} id="remote-media" />
      </Aux>
    );
  }  
  
}

export default VideoComponent; 