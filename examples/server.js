var pixa = require('../lib');

pixa.api.getAccountCount(function(err, result) {
	console.log(err, result);
});

pixa.api.getAccounts(['dan'], function(err, result) {
	console.log(err, result);
	var reputation = pixa.formatter.reputation(result[0].reputation);
	console.log(reputation);
});

pixa.api.getState('trending/pixagram', function(err, result) {
	console.log(err, result);
});

pixa.api.getFollowing('ned', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

pixa.api.getFollowers('dan', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

pixa.api.streamOperations(function(err, result) {
	console.log(err, result);
});

pixa.api.getDiscussionsByActive({
  limit: 10,
  start_author: 'thecastle',
  start_permlink: 'this-week-in-level-design-1-22-2017'
}, function(err, result) {
	console.log(err, result);
});
