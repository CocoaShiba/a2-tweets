class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.includes("#RKLive")) return "live_event";
        else if (this.text.includes("#FitnessAlerts")) return "achievement";
        else if (this.text.startsWith("Just completed a") || this.text.startsWith("Just posted a")) return "completed_event";

        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes("-")) return true;
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var newString = "";

        var writtenTextStartPos = this.text.indexOf("-") + 2;
        var writtenTextEndPos = this.text.indexOf("https");

        newString = this.text.substring(writtenTextStartPos, writtenTextEndPos);

        return newString;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        var startPos = 0;
        var activity = "";

        const regexMi = /\bmi\b/;
        const regexKm = /\bkm\b/;

        if (regexMi.test(this.text)) startPos = this.text.indexOf("mi");
        else if (regexKm.test(this.text)) startPos = this.text.search("km");
        else return "unknown";

        startPos += 3;

        while (this.text.charAt(startPos) != " ")
        {
            activity += this.text.charAt(startPos);
            startPos++;
            
            if (startPos > this.text.length) return "unknown";
        }
            
        return activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: parse the distance from the text of the tweet
        var startPos = 0;
        var distance = "";
        var mileMultiplier = 1;

        const regexMi = /\bmi\b/;
        const regexKm = /\bkm\b/;

        if (regexMi.test(this.text)) startPos = this.text.indexOf("mi");
        else if (regexKm.test(this.text))
        {
            startPos = this.text.search("km");
            mileMultiplier = 1.609;
        } 
        else return 0;

        startPos -= 2;

        while (this.text.charAt(startPos) != " ")
        {
            startPos--;
            if (startPos < 0) return 0;
        }
        startPos++;
        while (this.text.charAt(startPos) != " ")
        {
            distance += this.text.charAt(startPos);
            startPos++;
            if (startPos > this.text.length) return 0;
        }

        var finalValue = Number(distance) / mileMultiplier;

        if (Number.isNaN(finalValue)) return 0;
        return finalValue;
    }

    get day():string {
        var dayNumber = this.time.getDay();

        if (dayNumber == 0) return "Sun";
        if (dayNumber == 1) return "Mon";
        if (dayNumber == 2) return "Tues";
        if (dayNumber == 3) return "Wed";
        if (dayNumber == 4) return "Thu";
        if (dayNumber == 5) return "Fri";
        if (dayNumber == 6) return "Sat";
        
        return "";
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}