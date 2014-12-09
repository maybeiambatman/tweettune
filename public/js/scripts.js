$(document).ready(function () {
	$("input").on("keydown",function search(e) {
	    if(e.keyCode == 13) {
	    	var key = $(this).val();
	    	key = key.replace("#", "");
	    	$("#pos-count").text(0);
	    	$("#neu-count").text(0);
	    	$("#neg-count").text(0);
	    	$('.tweet-box-stream').empty();
	        // console.log(key);
	        runTweets(key);
	    }
	});
});

function prependTweet(tweet_box_stream, tweet_box_id, counter, tweet_handle, tweet_img_url, tweet_text){
	$('.' + tweet_box_stream).prepend('<div class="tweet-box ' + tweet_box_id + '" id="'+ tweet_box_id +'-'+ counter + '"><img class="twitter-box-pic" src="'+ tweet_img_url+'"><div class="tweet-box-username">@'+ tweet_handle+'</div><div class="tweet-box-content">'+tweet_text+'</div></div>');
}

function prependEmptyBox(tweet_box_stream, tweet_box_id,counter){

	$('.' + tweet_box_stream).prepend('<div class="tweet-box" id="'+ tweet_box_id +'-'+ counter+ '"></div>');
}

function runTweets(key) {
	    var max_tweets = 6;

	    var tot_pos = 0;
	    var tot_neu = 0;
	    var tot_neg = 0;

	    var count_positive = 0; 
	    var tweet_array_positive = [];

	    var count_neutral = 0;
	   	var tweet_array_neutral = [];

	    var count_negative = 0;
	   	var tweet_array_negative = [];
	   	
	    // console.log("runTweets function is running");

	    var positive_sound = new Howl({urls: ['/sounds/high.mp3']})
        var neutral_sound = new Howl({urls: ['/sounds/medium.mp3']})
        var negative_sound = new Howl({urls: ['/sounds/low.mp3']})

        // if (source !== null){
        // 	source.close();
        // }
	   	var source = new EventSource('/stream/'+key);
	   	  var split_dat = 0;
		  source.addEventListener('message', function(e) {
		    var dat = String(e.data);
		    split_dat = dat.split("__space__");

		var score = parseFloat(split_dat[1]);
		var case_num = 0;

		if (score >= 0.1){
			case_num = 1;
		}

		else if (score < 0.1 && score > -0.1){
			case_num = 2;
		}

		else if (score <= -0.1){
			case_num = 3;
		}
		console.log("caase num = "+case_num.toString());
		positive_sound.stop();
		neutral_sound.stop();
		negative_sound.stop();
		switch(case_num) {
    		case 1:
	    		prependTweet('tweet-box-stream-positive', 'tweet-box-positive', count_positive, split_dat[2], split_dat[3], split_dat[4]);
				prependEmptyBox('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral);
				prependEmptyBox('tweet-box-stream-negative', 'tweet-box-negative', count_negative);
			    positive_sound.play();
			    tot_pos++;
			    $("#pos-count").text(tot_pos);
			    break;
		    case 2: 
	    		prependTweet('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral, split_dat[2], split_dat[3], split_dat[4]);
				prependEmptyBox('tweet-box-stream-positive', 'tweet-box-positive', count_positive);
				prependEmptyBox('tweet-box-stream-negative', 'tweet-box-negative', count_negative);
			    neutral_sound.play();
			    tot_neu++;
			    $("#neu-count").text(tot_neu);
		    	break; 
		    case 3:
	    		prependTweet('tweet-box-stream-negative', 'tweet-box-negative', count_negative, split_dat[2], split_dat[3], split_dat[4]);
				prependEmptyBox('tweet-box-stream-positive', 'tweet-box-positive', count_positive);
				prependEmptyBox('tweet-box-stream-neutral', 'tweet-box-neutral', count_neutral);
			    negative_sound.play();
			    tot_neg++;
			    $("#neg-count").text(tot_neg);
			    break;
		    default:
		    	// console.log('default');
		    	break;
			}//end switch

			tweet_array_positive.push("tweet-box-positive-"+count_positive);
			tweet_array_neutral.push("tweet-box-neutral-"+count_neutral);
			tweet_array_negative.push("tweet-box-negative-"+count_negative);

			$('.tweet-box-stream').effect("slide", { direction: "left", distance: "210px" }, 200);

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
	  	}, false);
		source.addEventListener('error', function (e) {
		    console.log('error');
		    source.close();
		}, false);
}