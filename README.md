## call-me-maybe
[See it live!](https://call-me-maybe-chat-app.herokuapp.com/)

## Technologies
call-me-maybe is an application built with:

* Redux 
* Express 
* Node.js  
* Twilio video communications API 

This was a project that I made for the Twilio apprenticeship program. I also wanted to learn how to use Express and Node.js and what it felt like using Javascript everywhere. 

## Code Examples

#### DOM manipulation with Vanilla JS  
```javascript
displayLocalParticiantVideo = () => { 
    let localPublication = this.state.localMedia.localVideoPublication;
    let localVideoContainer = document.getElementById(`localVideo`)
    localVideoContainer.appendChild(localPublication.track.attach())
    let localMedia = this.state.localMedia
    
    this.setState({ localMedia: { 
      ...localMedia, 
      displayLocalVideo: true }})
  }
  ```
  
#### Exposing API end points using Express and Node.js

```javascript 
app.post('/room', (req, res) =>{
  let roomName = req.body.roomName
  client.video.rooms
    .create({
      recordParticipantsOnConnect: false,
      statusCallback: 'http://example.org',
      type: 'group',
      uniqueName: roomName
    })
    .then(room => { 
      res.send({ room: room })
    })
})
```

#### Developed using React Development Best Practices

Conditional rendering above return in component render method
```javascript 
let toggleLocalVideo = this.state.localMedia.displayLocalVideo 
        ? <Button click={this.removeLocalVideo}>Hide Video</Button>
        : <Button click={this.displayLocalParticiantVideo}>Display Video</Button>

      let toggleLocalAudio = this.state.localMedia.addLocalAudio 
        ? <Button click={this.removeLocalAudio}>Mute</Button>
        : <Button click={this.addLocalParticipantAudio}>Unmute</Button>
```

Return statement kept minimal in main stateful component 
```javascript 
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
```
