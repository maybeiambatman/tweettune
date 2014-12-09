$(document).ready(function () {
	runTweets();
});
   	
function prependTweet(tweet_box_stream, tweet_box_id, counter, tweet_handle, tweet_img_url, tweet_text){
	$('.' + tweet_box_stream).prepend('<div class="tweet-box ' + tweet_box_id + '" id="'+ tweet_box_id +'-'+ counter + '"><img class="twitter-box-pic" src="'+ tweet_img_url+'"><div class="tweet-box-username">@'+ tweet_handle+'</div><div class="tweet-box-content">'+tweet_text+'</div></div>');
}

function prependEmptyBox(tweet_box_stream, tweet_box_id,counter){

	$('.' + tweet_box_stream).prepend('<div class="tweet-box" id="'+ tweet_box_id +'-'+ counter+ '"></div>');
}

function runTweets() {
	    var max_tweets = 6;

	    var count_positive = 0; 
	    var tweet_array_positive = [];

	    var count_neutral = 0;
	   	var tweet_array_neutral = [];

	    var count_negative = 0;
	   	var tweet_array_negative = [];
	   	
	    console.log("runTweets function is running");

        setInterval(function(){

		switch(Math.floor(Math.random()*3+1)) {
    
    		case 1:

    		prependTweet('tweet-box-stream-positive', 'tweet-box-positive', count_positive, 'UserNameHere1', '/img/profilepicture.png', 'awesome, i cant wait until im done with this 467 project woot woot!');
			prependEmptyBox('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral);
			prependEmptyBox('tweet-box-stream-negative', 'tweet-box-negative', count_negative);

		    break

		    case 2: 

    		prependTweet('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral, 'UserNameHere2', '/img/profilepicture.png', 'well meh, cant wait until im done with this 467 project.');
			prependEmptyBox('tweet-box-stream-positive', 'tweet-box-positive', count_positive);
			prependEmptyBox('tweet-box-stream-negative', 'tweet-box-negative', count_negative);

		    break; 

		    case 3: 

    		prependTweet('tweet-box-stream-negative', 'tweet-box-negative', count_negative, 'UserNameHere3', '/img/profilepicture.png', 'fuck, i cant wait until im done with this 467 project ughhhgh.');
			prependEmptyBox('tweet-box-stream-positive', 'tweet-box-positive', count_positive);
			prependEmptyBox('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral);


		    break;

			}//end switch

			tweet_array_positive.push("tweet-box-positive-"+count_positive);
			tweet_array_neutral.push("tweet-box-neutral-"+count_neutral);
			tweet_array_negative.push("tweet-box-negative-"+count_negative);

			$('.tweet-box-stream').effect("slide", { direction: "left", distance: "210px" }, 1900);

			count_positive++;
			count_neutral++;
			count_negative++; 

			 if(tweet_array_positive.length >= max_tweets) 
		    {
		    	var remove_me = tweet_array_positive.shift();

				$("#" + remove_me).remove();

		    	remove_me = tweet_array_neutral.shift();
				$("#" + remove_me).remove();

		    	remove_me = tweet_array_negative.shift();
				$("#" + remove_me).remove();


		    	if(count_positive > max_tweets) 
	    		{
	    			count_positive = 0;
	    			count_neutral = 0;
	    			count_negative = 0;
	    		}
		    	
		    }

		    

	}, 2000);
}