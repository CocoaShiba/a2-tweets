function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	
	const activities = new Map();

	for  (i = 0; i < tweet_array.length; i++)
	{
		if (!activities.has(tweet_array[i].activityType))
		{
			activities.set(tweet_array[i].activityType, 1);
		} 
		else
		{
			activities.set(tweet_array[i].activityType, activities.get(tweet_array[i].activityType) + 1);
		} 
	}

	document.getElementById('numberActivities').innerText = activities.size;

	const highestValues = new Array(); 
	const activitiesCopy = new Map(activities);

	for (i = 0; i < 3; i++) {
		var highestValue = 0;
		var highestValueKey = "";

		for (const [key, value] of activitiesCopy) {
			if (value > highestValue)
			{
				highestValue = value;
				highestValueKey = key;
			} 
		}

		highestValues.push(highestValueKey);
		activitiesCopy.delete(highestValueKey);
	}

	document.getElementById('firstMost').innerText = highestValues[0];
	document.getElementById('secondMost').innerText = highestValues[1];
	document.getElementById('thirdMost').innerText = highestValues[2];

	const totalDistances = new Map();

	for  (i = 0; i < tweet_array.length; i++)
	{
		if (!totalDistances.has(tweet_array[i].activityType))
		{
			totalDistances.set(tweet_array[i].activityType, tweet_array[i].distance);
		} 
		else
		{
			totalDistances.set(tweet_array[i].activityType, totalDistances.get(tweet_array[i].activityType) + tweet_array[i].distance);
		} 
	}

	const averageDistances = new Map();

	for (const [key, value] of totalDistances) {
		averageDistances.set(key, value / activities.get(key));
	}

	var highestValue = 0;
	var highestValueKey = "";
	var lowestValue = 10000000;
	var lowestValueKey = "";

	for (i = 0; i < 3; i++)
	{
		if (averageDistances.get(highestValues[i]) > highestValue)
		{
			highestValue = averageDistances.get(highestValues[i]);
			highestValueKey = highestValues[i];
		}
		if (averageDistances.get(highestValues[i]) < lowestValue && averageDistances.get(highestValues[i]) != 0)
		{
			lowestValue = averageDistances.get(highestValues[i]);
			lowestValueKey = highestValues[i];
		}
	}

	document.getElementById('longestActivityType').innerText = highestValueKey;
	document.getElementById('shortestActivityType').innerText = lowestValueKey;

	var weekdayCount = 0;
	var weekdayDistance = 0;
	var weekendCount = 0;
	var weekendDistance = 0;

	for (i = 0; i < tweet_array.length; i++)
	{
		if (tweet_array[i].time.getDay() == 6 || tweet_array[i].time.getDay() == 7 || tweet_array[i].time.getDay() == 0)
		{
			weekendCount++;
			weekendDistance += tweet_array[i].distance;
		}
		else
		{
			weekdayCount++;
			weekdayDistance += tweet_array[i].distance;
		}
	}

	var weekdayAverage = weekdayDistance / weekdayCount;
	var weekendAverage = weekendDistance / weekendCount;

	if (weekdayAverage > weekendAverage) document.getElementById('weekdayOrWeekendLonger').innerText = "the weekday";
	else document.getElementById('weekdayOrWeekendLonger').innerText = "the weekend";


	// const activitiesArray = new Array();
	// for (i = 0; i < tweet_array.length; i++)
	// {
	// 	activitiesArray.push(tweet_array[i].activityType);
	// } 

	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		data: {
			"values": tweet_array
		},
		//TODO: Add mark and encoding
		mark: "bar",
		encoding: {
			x: {
				field: "activityType",
				type: "nominal"
			},
			y: {
				aggregate: "count",
				type: "quantitative"
			}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const mostTweetedActivities = new Array(); 

	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType == highestValues[0] || tweet_array[i].activityType == highestValues[1] || tweet_array[i].activityType == highestValues[2]) {
			mostTweetedActivities.push(tweet_array[i]);
		}
	}

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"width": 300,
		"height": 200,
		"data": {
			"values": mostTweetedActivities
		},
		"mark": "point",
		"encoding": {
			x: {
				"field": "day",
				"type": "nominal",
				"scale": {
					"domain": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
				},
				"title": "time (day)",
				// aggregate: "count"
			},
			y: {
				field: "distance",
				//aggregate: "count",
				type: "quantitative",
				"title": "distance",
			},
			"color": {"field": "activityType", "type": "nominal", "title": "activityType",},
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});