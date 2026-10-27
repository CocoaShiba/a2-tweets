function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const writtenTweets = new Array(); 

	const filterBox = document.getElementById('textFilter');
	const tableRef = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0];
	document.getElementById("searchText").innerHTML = filterBox.value;

	if (filterBox.value == "")
	{
		tableRef.innerHTML = "";
		document.getElementById("searchCount").innerHTML = "0";
	}
	else
	{
		for (var i = 0; i < tweet_array.length; i++)
		{
			if (tweet_array[i].written && tweet_array[i].text.toLowerCase().includes(filterBox.value.toLowerCase())) writtenTweets.push(tweet_array[i]);
		}

		tableRef.innerHTML = "";
		document.getElementById("searchCount").innerHTML = writtenTweets.length.toString();

		for (i = 0; i < writtenTweets.length; i++)
		{
			var text = "";
			text = String(writtenTweets[i].getHTMLTableRow(i));
			
			tableRef.insertAdjacentHTML("beforeend", text);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const filterBox = document.getElementById('textFilter');

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