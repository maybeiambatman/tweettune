// App constants
var API = 'http://faizaanmahmud.com',
    API_PORT = '8000'
    // Required constants
    express = require('express'),
    stylus = require('stylus'),
    jade = require('jade'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sentiment = require('sentiment'),
    app = express();

var Twitter = require('node-tweet-stream')
    , t = new Twitter({
    consumer_key: 'ypoD0SpeR9wTnBakqYqsGqnLi',
    consumer_secret: 'RUY6OFwZX4GKXHmoQsU023SuwRGAUBHyrURa9HIUOCehQEz7o4',
    token: '2845320649-qYLFU09FUwJ4VMsfjiCqgRCJu120OYVuYCDbVpc',
    token_secret: 'amCBzAKFk7ILALGM9haSYnSbI4WmsxcxFZ4bTFMXraSH3'
})

// t.track('#omg');

// t.on('tweet', function (tweet) {
//   console.log(tweet);
//   console.log('tweet received', tweet['text']);
//   //console.log('tweet sentiment', sentiment(tweet['text'])['score']);
//   //res.write('data: irteza'+tweet['screen_name']+'irteza'+tweet['profile_image_url']+'irteza'+tweet['text']+'\n\n');
// })

// t.on('error', function (err) {
//   console.log('Oh no')
// })

// Deploy config
app.listen(process.env.PORT || 3000);

// App config
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));

// Enable stylus
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

// Set view paths
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
))
app.use(express.static(__dirname + '/public'))

app.set('view options', {
    layout: false
});

// respond with "Hello World!" on the homepage
app.get('/stream', function (req, res) {
  res.header('Content-Type', 'text/event-stream');

  t.track('#omg');

  t.on('tweet', function (tweet) {
    // console.log('tweet received', tweet['text']);
    // console.log('tweet sentiment', sentiment(tweet['text'])['score']);
    var tweet_body = tweet['text'];
    var senti_body = tweet_body.replace(" ", "_");
    senti_body = senti_body.replace("#", "");
    senti_body = senti_body.replace("?", "__question__");
    senti_body = senti_body.replace("$", "");
    senti_body = senti_body.replace(".", "");
    senti_body = senti_body.replace(";", "");
    senti_body = senti_body.replace("\n", "__new_line__");
    var score = 0.0;

    var options = {
      host: 'faizaanmahmud.com',
      port: 8000,
      path: '/tweet/?item='+senti_body
    };

    http.get(options, function(resp){
      resp.on('data', function(chunk){
        // console.log(chunk);
        // score = float(chunk);
      });
    }).on("error", function(e){
      console.log("Got error: " + e.message);
    });

    // var options = {
    //   host: API,
    //   path: '/tweet/?item='+senti_body,
    //   port: API_PORT,
    //   method: 'GET'
    // };
    // callback = function(response) {
    //     var str = '';
    //     //another chunk of data has been recieved, so append it to `str`
    //     response.on('data', function (chunk) {
    //         str += chunk;
    //     });
    //     //the whole response has been recieved, so we just print it out here
    //     response.on('end', function () {
    //         console.log(str);
    //         score = float(str);
    //     });
    // }
    // var request = http.request(options, callback);
    // request.on('error', function(err) {
    //     console.log(err);
    // });
    // request.end();
    res.write('data: irteza'+score+'irteza'+tweet['user']['screen_name']+'irteza'+tweet['user']['profile_image_url']+'irteza'+tweet['text']+'\n\n');
  })

  t.on('error', function (err) {
    console.log('Oh no')
  })

  // var interval_id = setInterval(function() {
  //     res.write("some data");
  // }, 50);

  req.socket.on('close', function() {
      t.untrack('#omg');
  });
})

app.get('/index', function(req, res) {
   res.render('index.jade', {
       title: 'Smiley'
   });
});

app.get('/about', function(req, res) {
   res.render('about.jade', {
       title: 'Smiley'
   });
});
