var oak;
pandora = require('./sfo.pandora.json');
rdio = require('./sfo.rdio.json');
soundtracking = require('./sfo.soundtracking.json');
spotify = require('./sfo.spotify.json');

var result = [];

result = result.concat(pandora.map(function(t) {
	t.service = 'Pandora';
	return t;
}));
result = result.concat(rdio.map(function(t) {
	t.service = 'Rdio';
	return t;
}));
result = result.concat(soundtracking.map(function(t) {
	t.service = 'Soundtracking';
	return t;
}));
result = result.concat(spotify.map(function(t) {
	t.service = 'Spotify';
	return t;
}));

var fs = require('fs');

fs.writeFileSync('sfo_merged.json', JSON.stringify(result));