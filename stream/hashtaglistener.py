from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json

ckey = 'ypoD0SpeR9wTnBakqYqsGqnLi'
csecret = 'RUY6OFwZX4GKXHmoQsU023SuwRGAUBHyrURa9HIUOCehQEz7o4'
atoken = '2845320649-qYLFU09FUwJ4VMsfjiCqgRCJu120OYVuYCDbVpc'
asecret = 'amCBzAKFk7ILALGM9haSYnSbI4WmsxcxFZ4bTFMXraSH3'
keywords = ["#ericgarner"]

class TwitterStreamListener(StreamListener): 
    def __init__(self):
        print "Initialized StreamListener"

    def on_data(self, data) :
        structured_data = json.loads(data)
        if 'text' not in structured_data:
            return True
        print "Received tweet with hashtag %s" % structured_data['text']
        return True;

    def on_error(self, status):
        print status

class HashtagListener :
    def __init__(self, _keywords):
        print "Initializing HashtagListener"
        self.keywords = []
        self.keywords.extend(_keywords)
        self.auth = OAuthHandler(ckey, csecret)
        self.auth.set_access_token(atoken, asecret)
        self.twitterStream = Stream(self.auth, TwitterStreamListener())
        self.refresh_stream()

    def refresh_stream(self):
        self.twitterStream.filter(track=self.keywords)

    def add_keyword(self, word):
        self.keywords.append(word)

listener = HashtagListener(keywords)