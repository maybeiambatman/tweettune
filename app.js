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

var last_tracked = "";
var Twitter = require('node-tweet-stream')
    , t = new Twitter({
    consumer_key: 'ypoD0SpeR9wTnBakqYqsGqnLi',
    consumer_secret: 'RUY6OFwZX4GKXHmoQsU023SuwRGAUBHyrURa9HIUOCehQEz7o4',
    token: '2845320649-qYLFU09FUwJ4VMsfjiCqgRCJu120OYVuYCDbVpc',
    token_secret: 'amCBzAKFk7ILALGM9haSYnSbI4WmsxcxFZ4bTFMXraSH3'
})

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
app.get('/stream/:term', function (req, res) {
  res.header('Content-Type', 'text/event-stream');
  if (last_tracked !== ""){
    t.untrack(last_tracked);
  }

  var hashtag = '#'+req.params.term;
  last_tracked = hashtag;
  console.log(hashtag);
  t.track(hashtag);

  t.on('tweet', function (tweet) {
    var score = sentiment(tweet['text'])['score'];
    var space_place_holder = '__space__';
    console.log('data: '+space_place_holder+score+space_place_holder+tweet['user']['screen_name']+space_place_holder+tweet['user']['profile_image_url']+space_place_holder+tweet['text']+'\n\n')
    res.write('data: '+space_place_holder+score+space_place_holder+tweet['user']['screen_name']+space_place_holder+tweet['user']['profile_image_url']+space_place_holder+tweet['text']+'\n\n');
  })

  t.on('error', function (err) {
    console.log('Oh no')
  })

  req.socket.on('close', function() {
      t.untrack(req.params.term);
  });
})

app.get('/index', function(req, res) {
   res.render('index.jade', {
       title: 'TweetTune'
   });
});

app.get('/about', function(req, res) {
   res.render('about.jade', {
       title: 'TweetTune'
   });
});

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});
