function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const writtenTweets = new Array(); 

	const filterBox = document.getElementById('textFilter');
	const tableRef = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0];
	document.getElementById("searchText").innerHTML = filterBox.value;


	if (filterBox.value == "") //If the input box is empty
	{
		tableRef.innerHTML = "";
		document.getElementById("searchCount").innerHTML = "0";
	}
	else //If there is text in the input box, iterate through all tweets. If the tweet has written text and includes text from the input box, append it to the writtenTweets array.
	{
		for (var i = 0; i < tweet_array.length; i++)
		{
			if (tweet_array[i].written && tweet_array[i].text.toLowerCase().includes(filterBox.value.toLowerCase())) writtenTweets.push(tweet_array[i]);
		}

		tableRef.innerHTML = "";
		document.getElementById("searchCount").innerHTML = writtenTweets.length.toString();

		//Show all tweets in the writtenTweets array in the table.
		for (i = 0; i < writtenTweets.length; i++)
		{
			var text = "";
			text = String(writtenTweets[i].getHTMLTableRow(i));
			
			tableRef.insertAdjacentHTML("beforeend", text);
		}
	}
}

function addEventHandlerForSearch() {
	const filterBox = document.getElementById('textFilter');

	//If the text box is ever updated, run parseTweets()
	filterBox.addEventListener('input', function(event) 
	{
		loadSavedRunkeeperTweets().then(parseTweets);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});