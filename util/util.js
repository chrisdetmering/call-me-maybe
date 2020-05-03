let faker = require('faker');
let AccessToken = require('twilio').jwt.AccessToken;

createAccessToken = () => {
  let VideoGrant = AccessToken.VideoGrant;
  let accessToken = new AccessToken(
    'ACf0403818be2b4a8868388f7419a3c3d4',
    'SKd1a4803b36c14c17f63a15fa4846a40f',
    'h8t2m8hhl0UHxEwi2nynsxEkAwmfRroR'
  );

  let identity = faker.name.findName()
  accessToken.identity = identity;

  let grant = new VideoGrant({ room: 'Class' });

  accessToken.addGrant(grant);

  return accessToken.toJwt();
}


module.exports = createAccessToken