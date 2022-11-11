const createAccessToken = require('./util/util')
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Room Joining
app.get('/token', (req, res) => {
  let room = req.query.room
  let token = createAccessToken(room);
  
  res.send({ token: token });
});

//Room Creation
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
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


app.listen(port, () => console.log(`Listening on port ${port}`));