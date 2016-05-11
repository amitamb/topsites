require('dotenv').config();

const fs = require('fs');
const csv = require('fast-csv');

var redis = require('redis');
if (process.env.REDISCLOUD_URL) {
  var client = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
  console.log("Working");
}
else {
  var client = redis.createClient({no_ready_check: true});
}

// clear out DB
client.flushdb()

var counter = 0;

fs.createReadStream("./data/top-10k.csv")
  .pipe(csv())
  .on("data", function(data){
    
    counter++;
    if (counter%1000==0) {
      console.log("Processed :", counter);
    }
    
    var rank = parseInt(data[0]);
    var site = data[1];
    var prefix;
    for ( var i = 0; i < site.length ; i++ ) {
      prefix = site.slice(0, i+1);
      // console.log(prefix);
      
      client.zincrby('sst1:' + prefix, 10000 / rank, site);
    }
    // console.log(data);
  })
  .on("end", function(){
    console.log("done");
  });

// var searchPrefix = "reddit";
// client.zrevrange('sst1:' + searchPrefix, 0, 100, function(err, members) {
//   console.log(members);
// });
  
// rc.zincrby('myset', 1, 'usera');
// rc.zincrby('myset', 5, 'userb');
// rc.zincrby('myset', 3, 'userc');
// rc.zrevrange('myset', 0, -1, 'withscores', function(err, members) {
//         // the resulting members would be something like
//         // ['userb', '5', 'userc', '3', 'usera', '1']
//         // use the following trick to convert to
//         // [ [ 'userb', '5' ], [ 'userc', '3' ], [ 'usera', '1' ] ]
//         // learned the trick from
//         // http://stackoverflow.com/questions/8566667/split-javascript-array-in-chunks-using-underscore-js
//     var lists=_.groupBy(members, function(a,b) {
//         return Math.floor(b/2);
//     });
//     console.log( _.toArray(lists) );
// });