var fs = require("fs")
var twitterKeys = require("./keys.js")
var command = process.argv[2]
var detail = process.argv[3]
var request = require("request");

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var client = new Twitter({
	consumer_key: twitterKeys.consumer_key,
	consumer_secret: twitterKeys.consumer_secret,
	access_token_key: twitterKeys.access_token_key,
	access_token_secret: twitterKeys.access_token_secret
});

var params = {
	screen_name: 'EneidaBootcamp',
	count: 20
};

var spotify = new Spotify({
	id: "b2704b26336941a0a24c76e8200baf24",
	secret: "eb9ac9462e264275acde274540858359"
});

//function calls twitter API and returns latest 20 tweets
function twitter() {
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			for (var i = 0; i < 20; i++) {
				console.log("Tweet: " + tweets[i].text)
			}
			console.log("\n")
		}
	});
}

function printTrack(track) {
	console.log("Artist: " + track.artists[0].name)
	console.log("Song Name: " + track.name)
	console.log("Album: " + track.album.name)
	console.log("Link: " + track.preview_url)
	console.log("\n")
}

function printMovie(body){
	console.log("Title: " + JSON.parse(body).Title)
	console.log("Release Year: " + JSON.parse(body).Year)
	console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
	console.log("Rotten Tomates Rating: " + JSON.parse(body).Ratings[1].Value)
	console.log("Production Country: " + JSON.parse(body).Country)
	console.log("Language: " + JSON.parse(body).Language)
	console.log("Actors: " + JSON.parse(body).Actors)
	console.log("\n")
}

//function calls spotify API and returns song details
function spotifyRun() {
	if (detail) {
		spotify.search({
			type: 'track',
			query: detail,
			limit: 1
		}, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err + "\n");
			}
			printTrack(data.tracks.items[0])
		});
	} else {
		spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
			.then(printTrack)
			.catch(function(err) {
				console.log(err)
			})
	}
}

//function calls omdb api and returns movie details

function omdb() {
	if (detail) {
		request("http://www.omdbapi.com/?t=" + detail + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

			// If there were no errors and the response code was 200, show movie details
			if (!error && response.statusCode === 200) {
				printMovie(body)
			}
		});
	} else {
		request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			// If there were no errors and the response code was 200, show movie details
			if (!error && response.statusCode === 200) {
				printMovie(body)
			}
		});
	}
}

//function takes in text of random.txt and runs the appropriate function

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(err, input) {
		if (err) {
			return (console.log(error))
		}

		//split the data into an array

		var input = input.split(",")

		detail = input[1]
		if (input[0] === "spotify-this-song") {
			console.log("\nHere's yer song deets:\n")
			spotifyRun()
		}
		if (input[0] === "my-tweets") {
			console.log("\nHere are your latest tweets!\n")
			twitter()
		}
		if (input[0] === "movie-this") {
			console.log("\nHere's yer movie deets:\n")
			omdb()
		}


	})

}

function log() {
	fs.appendFile("log.txt", (command + ","), function(err) {
		if (err) {
			console.log(err)
		}
	})
}

//switch statement takes in the user command and runs each function based on that command

switch (command) {
	case "my-tweets":
		console.log("\nHere are your latest tweets!\n")
		twitter()
		log()
		break;
	case "spotify-this-song":
		console.log("\nHere's yer song deets:\n")
		spotifyRun()
		log()
		break;
	case "movie-this":
		console.log("\nHere's yer movie deets:\n")
		omdb()
		log()
		break;
	case "do-what-it-says":
		console.log("\nI'm doin' it!\n")
		doWhatItSays()
		log()
		break;
	default:
		console.log("I saw the sign...but I don't know what you meant. :/")
}