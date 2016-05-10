require('dotenv').config();

var express = require('express');
var app = express();

app.use(express.static('public'));

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

var redis = require('redis');
if (process.env.REDISCLOUD_URL) {
  var client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
}
else {
  var client = redis.createClient({no_ready_check: true});
}

var port = process.env.PORT;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});