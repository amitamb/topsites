require('dotenv').config();

var express = require('express');
var app = express();
var cors = require('cors');

var redis = require('redis');
if (process.env.REDISCLOUD_URL) {
  var client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
}
else {
  var client = redis.createClient({no_ready_check: true});
}

app.get('/search', cors(), function (req, res) {
  var searchPrefix = req.query.q || "redd";
  client.zrevrange('sst1:' + searchPrefix, 0, 10, function(err, members) {
    console.log(members);
    res.contentType('application/json');
    res.send(JSON.stringify(members));
  });
});

app.use(express.static('public'));

var port = process.env.PORT;

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});