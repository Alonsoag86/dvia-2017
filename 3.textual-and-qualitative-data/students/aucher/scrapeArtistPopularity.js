var request = require('request');
var async = require('async');
var fs = require('fs');
var SpotifyWebApi = require('spotify-web-api-node');

var shows = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

var s = new SpotifyWebApi({
  clientId : process.env.SPOTIFYID,
  clientSecret : process.env.SPOTIFYSECRET
});

// Get an access token and 'save' it using a setter
s.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data.body['access_token']);
    s.setAccessToken(data.body['access_token']);

    fillFollowers();
    
  }, function(err) {
    console.log('Something went wrong!', err);
  });



function fillFollowers(){

	async.eachOfSeries(shows, function (item, i, callback) {

		var artist = item.artist.split(' ').join('+');
		console.log('artist ' + i + ': ' + artist);

		s.searchArtists(artist, {}, function(err, data) {
		  if (err) console.error(err);
		  else 
		  	// default pop value
		  	var pop = 0;

		  	if (data.body.artists.items[0]){
		  		var items = data.body.artists.items;

		  		for (var a = 0; a < items.length; a++){

		  			// returns multiple matches - try to find the best one
		  			if (items[a].name.toLowerCase() == item.artist.toLowerCase()) {
		  				console.log('match! ' + items[a].name);
		  				pop = items[a].popularity;
		  				break; // once found a good match break
		  			} else{
		  				pop = items[0].popularity;
		  			}
		  		}	
		  	} 

			shows[i].popularity = pop;
			console.log( artist + ' popularity: ', shows[i].popularity);

			setTimeout(callback,500);
		});
	}, 
	function(err){
		if (err) console.error(err.message);
		fs.writeFileSync('/Users/aucherserr/Desktop/DVIA/assignemnts/dvia-2017/3.textual-and-qualitative-data/students/aucher/assets/shows_with_followers.json',JSON.stringify(shows, null, 2));
		}
	);

}
