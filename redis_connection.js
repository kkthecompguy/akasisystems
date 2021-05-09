const session = require('express-session');
let pass = process.env.PASS

const redis = require('redis');
const redisStore = require('connect-redis')(session);

const client = redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true, auth_pass: pass });

client.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

client.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

router.use(session({
  secret: "secret",
  store: new redisStore({ host: 'redis://redis-10548.c57.us-east-1-4.ec2.cloud.redislabs.com', port: 10548, client: client, ttl: 260 }),
  resave: false,
  saveUnitialized: false
}));

module.exports = client;