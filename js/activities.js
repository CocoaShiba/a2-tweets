function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	const activities = new Map();

	//Create a Map with a string as key and int as value. The string (key) represents activityType, and int (value) represents the recorded amount of that activityType.
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

	//Iterate through the activities Map three times to find the first, second, and third most recorded activities.
	for (i = 0; i < 3; i++) 
	{
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

	//Create another Map, this one using a string as key and int as value. The string represents the activityType, and int represents the total distance traveled for that acitivity over all tweets.
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

	//Create a new Map just like the distances one, but now the int represents AVERAGE distance instead of total. The average is calculated by taking the total distance and dividing it by the tweet count.
	for (const [key, value] of totalDistances) 
	{
		averageDistances.set(key, value / activities.get(key));
	}

	var highestValue = 0;
	var highestValueKey = "";
	var lowestValue = 10000000;
	var lowestValueKey = "";

	//Iterate over the average distances to find the highest and lowest averages.
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

	//Iterate over all tweets and separate them into either weekend or weekday tweets. After they are separated, count the number of tweets and total the distance.
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

	for (var i = 0; i < tweet_array.length; i++) 
	{
		if (tweet_array[i].activityType == highestValues[0] || tweet_array[i].activityType == highestValues[1] || tweet_array[i].activityType == highestValues[2]) {
			mostTweetedActivities.push(tweet_array[i]);
		}
	}

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
					"domain": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
				},
				"title": "time (day)",
			},
			y: {
				field: "distance",
				type: "quantitative",
				"title": "distance",
			},
			"color": {"field": "activityType", "type": "nominal", "title": "activityType",},
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

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
					"domain": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
				},
				"title": "time (day)",
			},
			y: {
				field: "distance",
				aggregate: "mean",
				type: "quantitative",
				"title": "Mean of distance",
			},
			"color": {"field": "activityType", "type": "nominal", "title": "activityType",},
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_spec, {actions:false});
	document.getElementById("distanceVisAggregated").style.display = 'none';

	const button = document.getElementById("aggregate");

	//Button function to hide/show the two graphs.
	var means = false;
	button.addEventListener("click", function() 
	{
		means = !means;

		if (means)
		{
			button.textContent = "Show all activities";
			document.getElementById("distanceVis").style.display = 'none';
			document.getElementById("distanceVisAggregated").style.display = 'block';
		}
		else
		{
			button.textContent = "Show means";
			document.getElementById("distanceVis").style.display = 'block';
			document.getElementById("distanceVisAggregated").style.display = 'none';
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});