const createAccessToken = require('./util/util')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Room Joining
app.get('/token', (req, res) => {
  let token = createAccessToken();
  
  res.send({ token: token });
});

//Room Creation
const accountSid = 'ACf0403818be2b4a8868388f7419a3c3d4';
const authToken = '0ae96aa18b53fce44a40ba78a5f813b6'
const client = require('twilio')(accountSid, authToken);

app.post('/room', (req, res) =>{
  client.video.rooms
    .create({
      recordParticipantsOnConnect: false,
      statusCallback: 'http://example.org',
      type: 'group',
      uniqueName: 'Class'
    })
    .then(room => { 
      res.send({ room: room })
    })

})


app.listen(port, () => console.log(`Listening on port ${port}`));