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

	for (var i = 0; i < tweet_array.length; i++)
	{
		if (tweet_array[i].written) writtenTweets.push(tweet_array[i]);
	}

	const tableRef = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0];

	for (i = 0; i < writtenTweets.length; i++)
	{
		var text = "";
		text = String(writtenTweets[i].getHTMLTableRow(i));
		
		tableRef.insertAdjacentHTML("beforeend", text);
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	//const tableRef = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0];

	// for (i = 0; i < 4; i++)
	// {

	// 	const rowHTML = tweet_array[i].getHTMLTableRow;
	// 	tableRef.insertAdjacentHTML("beforeend", rowHTML)

	// 	// const newRow = tableRef.insertRow(-1);

	// 	// // 3. Insert cells (td) into the new row
	// 	// const cell1 = newRow.insertCell(0);
	// 	// const cell2 = newRow.insertCell(1);
	// 	// const cell3 = newRow.insertCell(2);

	// 	// // 4. Append text or content to the cells
	// 	// cell1.textContent = i;
	// 	// cell2.textContent = i + 1;
	// 	// cell3.textContent = i + 2;
	// }


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});