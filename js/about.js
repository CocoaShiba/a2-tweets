function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	var numberOfCompletedEvents = 0;
	var numberOfLiveEvents = 0;
	var numberOfAchievements = 0;
	var numberOfMisc = 0;
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	document.getElementById('firstDate').innerText = tweet_array[tweet_array.length-1].time.toLocaleDateString();
	document.getElementById('lastDate').innerText = tweet_array[0].time.toLocaleDateString();

	for (i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source == "live_event") numberOfLiveEvents++;
		else if (tweet_array[i].source == "achievement") numberOfAchievements++;
		else if (tweet_array[i].source == "completed_event") numberOfCompletedEvents++;
		else if (tweet_array[i].source == "miscellaneous") numberOfMisc++;
	}

	document.getElementsByClassName("completedEvents")[0].innerText = numberOfCompletedEvents;
	document.getElementsByClassName("completedEventsPct")[0].innerText = (numberOfCompletedEvents / tweet_array.length).toFixed(2) + "%";
	
	document.getElementsByClassName("liveEvents")[0].innerText = numberOfLiveEvents;
	document.getElementsByClassName("liveEventsPct")[0].innerText = (numberOfLiveEvents / tweet_array.length).toFixed(2) + "%";
	
	document.getElementsByClassName("achievements")[0].innerText = numberOfAchievements;
	document.getElementsByClassName("achievementsPct")[0].innerText = (numberOfAchievements / tweet_array.length).toFixed(2) + "%";
	
	document.getElementsByClassName("miscellaneous")[0].innerText = numberOfMisc;
	document.getElementsByClassName("miscellaneousPct")[0].innerText = (numberOfMisc / tweet_array.length).toFixed(2) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});