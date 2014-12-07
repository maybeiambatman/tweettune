// App constants
var API = 'localhost',
    // Required constants
    express = require('express'),
    stylus = require('stylus'),
    jade = require('jade'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express();

var Twitter = require('node-tweet-stream')
    , t = new Twitter({
    consumer_key: 'ypoD0SpeR9wTnBakqYqsGqnLi',
    consumer_secret: 'RUY6OFwZX4GKXHmoQsU023SuwRGAUBHyrURa9HIUOCehQEz7o4',
    token: '2845320649-qYLFU09FUwJ4VMsfjiCqgRCJu120OYVuYCDbVpc',
    token_secret: 'amCBzAKFk7ILALGM9haSYnSbI4WmsxcxFZ4bTFMXraSH3'
})

var arr = []

t.on('tweet', function (tweet) {
  console.log('tweet received', tweet['text'])
  arr.push(tweet);
})

t.on('error', function (err) {
  console.log('Oh no')
})

t.track('bulls');

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
app.get('/', function (req, res) {
  res.send(arr);
})

app.get('/about', function(req, res) {
   res.render('about.jade', {
       title: 'Smiley'
   });
});
