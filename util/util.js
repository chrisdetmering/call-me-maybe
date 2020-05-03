let faker = require('faker');
require('dotenv').config();
let AccessToken = require('twilio').jwt.AccessToken;

createAccessToken = (room) => {
  let VideoGrant = AccessToken.VideoGrant;
  let accessToken = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY,
    process.env.API_SECRET
  );

  let identity = faker.name.findName()
  accessToken.identity = identity;

  let grant = new VideoGrant({ room: room });

  accessToken.addGrant(grant);

  return accessToken.toJwt();
}


module.exports = createAccessToken;