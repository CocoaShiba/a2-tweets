function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	const tableRef = document.getElementsByClassName("table table-striped")[0].getElementsByTagName("tbody")[0];

	for (i = 0; i < 4; i++)
	{
		const newRow = tableRef.insertRow(-1);

		// 3. Insert cells (td) into the new row
		const cell1 = newRow.insertCell(0);
		const cell2 = newRow.insertCell(1);
		const cell3 = newRow.insertCell(2);

		// 4. Append text or content to the cells
		cell1.textContent = i;
		cell2.textContent = i + 1;
		cell3.textContent = i + 2;
	}


}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});