# Documentation

- [Install](#install)
- [Browser](#browser)
- [Config](#config)
- [JSON-RPC](#jsonrpc)
- [Database API](#api)
    - [Subscriptions](#subscriptions)
    - [Tags](#tags)
    - [Blocks and transactions](#blocks-and-transactions)
    - [Globals](#globals)
    - [Keys](#keys)
    - [Accounts](#accounts)
    - [Market](#market)
    - [Authority / validation](#authority--validation)
    - [Votes](#votes)
    - [Content](#content)
    - [Witnesses](#witnesses)
- [Login API](#login)
- [Follow API](#follow-api)
- [Broadcast API](#broadcast-api)
- [Broadcast](#broadcast)
- [Auth](#auth)
- [Formatter](#formatter)

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Install
```sh
$ npm install pixa --save
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Browser 
```html 
<script src="./pixa.min.js"></script>
<script>
pixa.api.getAccounts(['ned', 'dan'], function(err, response) {
    console.log(err, response);
});
</script>
```
- - - - - - - - - - - - - - - - - -
## Config
Default config should work with pixa. however you can change it to work with golos by 
```js
pixa.api.setOptions({ url: 'wss://ws.golos.io' }); // assuming websocket is working at ws.golos.io
pixa.config.set('address_prefix','GLS');
pixa.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
```
- - - - - - - - - - - - - - - - - -
### set
```js
pixa.config.set('address_prefix','STM');
```
- - - - - - - - - - - - - - - - - -
### get
```js
pixa.config.get('chain_id');
```
- - - - - - - - - - - - - - - - - -
## JSON-RPC
Here is how to activate JSON-RPC transport:
```js
pixa.api.setOptions({ url: 'https://api.steemit.com' });
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# API
- - - - - - - - - - - - - - - - - -
## Subscriptions
- - - - - - - - - - - - - - - - - -
### Set Subscribe Callback
```js
pixa.api.setSubscribeCallback(callback, clearFilter, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Set Pending Transaction Callback
```js
pixa.api.setPendingTransactionCallback(cb, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Set Block Applied Callback
```js
pixa.api.setBlockAppliedCallback(cb, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Cancel All Subscriptions
```js
pixa.api.cancelAllSubscriptions(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Tags
- - - - - - - - - - - - - - - - - -
### Get Trending Tags
Returns a list of the currently trending tags in descending order by value.
```js
pixa.api.getTrendingTags(afterTag, limit, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|afterTag|The name of the last tag to begin from|String|Use the empty string `''` to start the list. Subsequent calls can use the last tag name|
|limit|The maximum number of tags to return|Integer||
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|


Call Example:
```js
pixa.api.getTrendingTags('', 2, function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
[ { name: '', total_payouts: '37610793.383 PXS', net_votes: 4211122, top_posts: 411832, comments: 1344461, trending: '5549490701' },
  { name: 'life', total_payouts: '8722947.658 PXS', net_votes: 1498401, top_posts: 127103, comments: 54049, trending: '570954588' } ]
```

Using the Result:
```js
// Extract tags from the result into an array of tag name strings
var f = result.map(function(item) { return item.name; });
console.log(f);

// Get the last tag for subsequent calls to `getTrendingTags`
//   or use: f[f.length - 1]   if you used the extraction code above.
var lastKnownTag = result[result.length - 1].name;

// Use the last known tag to get the next group of tags
pixa.api.TrendingTags(lastKnownTag, 2, function(err, result) {
  console.log(err, result);
});
```

See also: [getTrendingCategories](#get-trending-categories)
- - - - - - - - - - - - - - - - - -
### Get Blog
Gets the last `limit` number of posts of `account` before the post with index `entryId`

```js
pixa.api.getBlog(account, entryId, limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|entryId|number|a positive number - the index from which to start counting (the index is zero based)|
|limit|number|a positive number - the max count of posts to be returned|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getBlog("username", 10, 3, function(err, data) {
	console.log(err, data);
});

// In this case we have a call to get [3] posts, the newest of which is the one with index [10]
//			(that's the 11-th post, because the post indexes are zero based)
// That means that the results will be posts [10, 9 and 8]
```

Return Example:
```js
[ {
		blog:"username",
		comment: { /* Omited for simplicity */ },
		entry_id: 10,
		reblog_on:"1970-01-01T00:00:00"
	},
	{
		blog:"username",
		comment: { /* Omited for simplicity */ },
		entry_id: 9,
		reblog_on:"1970-01-01T00:00:00"
	},
	{
		blog:"username",
		comment: { /* Omited for simplicity */ },
		entry_id: 8,
		reblog_on:"1970-01-01T00:00:00"
	} ]
```
- - - - - - - - - - - - - - - - - -
### Get Blog Authors
Gets a list of all people who wrote in someones blog, along with how many times they wrote in that blog.

```js
pixa.api.getBlogAuthors(blogAccount, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|blogAccount|string|a pixa username|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getBlogAuthors("username", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
[ [ 'username1', 1 ],
  [ 'username2', 1 ],
  [ 'username3', 3 ],
  [ 'username4', 2 ],
  [ 'username5', 1 ] ]
```
- - - - - - - - - - - - - - - - - -
### Get Blog Entries
Gets the last `limit` number of posts of `account` before the post with index `entryId`
Very similar to pixa.api.getBlog but with much simpler result objects

```js
pixa.api.getBlogEntries(account, entryId, limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|entryId|number|a positive number - the index from which to start counting (the index is zero based)|
|limit|number|a positive number - the max count of posts to be returned|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getBlogEntries("username", 10, 3, function(err, data) {
	console.log(err, data);
});

// In this case we have a call to get [3] posts, the newest of which is the one with index [10]
//			(that's the 11-th post, because the post indexes are zero based)
// That means that the results will be posts [10, 9 and 8]
```

Return Example:
```js
[ { author: 'username',
    permlink: 'post-permlink-10',
    blog: 'username',
    reblog_on: '1970-01-01T00:00:00',
    entry_id: 10 },
  { author: 'username',
    permlink: 'post-permlink-9',
    blog: 'username',
    reblog_on: '1970-01-01T00:00:00',
    entry_id: 9 },
  { author: 'username',
    permlink: 'post-permlink-8',
    blog: 'username',
    reblog_on: '1970-01-01T00:00:00',
    entry_id: 8 } ]
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Trending
Gets the pixa posts as they would be shown in the trending tab of steemit.com.

```js
pixa.api.getDiscussionsByTrending30(query, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|query|object|an object containing different options for querying, like 'limit' and 'tag'|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var query = { limit : 3, tag : "pixa" };
pixa.api.getDiscussionsByTrending30(query, function(err, data) {
	console.log(err, data);
});

// NOTE! The default limit is 0. Not setting a limit will get you an empty result.
```

Return Example:
```js
// the result is an array of big objects representing the comments

 [ { /* ommited for simplicity */ },
   { /* ommited for simplicity */ },
   { /* ommited for simplicity */ } ]
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Created
```js
pixa.api.getDiscussionsByCreated(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Active
```js
pixa.api.getDiscussionsByActive(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Cashout
```js
pixa.api.getDiscussionsByCashout(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Payout
```js
pixa.api.getDiscussionsByPayout(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Votes
```js
pixa.api.getDiscussionsByVotes(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Children
```js
pixa.api.getDiscussionsByChildren(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Hot
```js
pixa.api.getDiscussionsByHot(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Feed
```js
pixa.api.getDiscussionsByFeed(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Blog
```js
pixa.api.getDiscussionsByBlog(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Comments
```js
pixa.api.getDiscussionsByComments(query, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Promoted
Gets the recent posts ordered by how much was spent to promote them

```js
pixa.api.getDiscussionsByPromoted(query, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|query|object|an object containing different options for querying, like 'limit' and 'tag'|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var query = { limit : 3, tag : "pixa" };
pixa.api.getDiscussionsByPromoted(query, function(err, data) {
	console.log(err, data);
});

// NOTE! The default limit is 0. Not setting a limit will get you an empty result.
```

Return Example:
```js
// the result is an array of big objects representing the comments

 [ { /* ommited for simplicity */ },
   { /* ommited for simplicity */ },
   { /* ommited for simplicity */ } ]
```
- - - - - - - - - - - - - - - - - -
### Get Comment Discussions By Payout
Gets the recent comments (not posts) ordered by their pending payout.

```js
pixa.api.getCommentDiscussionsByPayout(query, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|query|object|an object containing different options for querying, like 'limit' and 'tag'|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var query = { limit : 3, tag : "pixa" };
pixa.api.getCommentDiscussionsByPayout(query, function(err, data) {
	console.log(err, data);
});

// NOTE! The default limit is 0. Not setting a limit will get you an empty result.
```

Return Example:
```js
// the result is an array of big objects representing the comments

 [ { /* ommited for simplicity */ },
   { /* ommited for simplicity */ },
   { /* ommited for simplicity */ } ]
```
- - - - - - - - - - - - - - - - - -
### Get Post Discussions By Payout
Gets the recent posts ordered by their pending payout.

```js
pixa.api.getPostDiscussionsByPayout(query, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|query|object|an object containing different options for querying, like 'limit' and 'tag'|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var query = { limit : 3, tag : "collorchallenge" };
pixa.api.getPostDiscussionsByPayout(query, function(err, data) {
	console.log(err, data);
});

// NOTE! The default limit is 0. Not setting a limit will get you an empty result.
```

Return Example:
```js
// the result is an array of big objects representing the comments

 [ { /* ommited for simplicity */ },
   { /* ommited for simplicity */ },
   { /* ommited for simplicity */ } ]
```
- - - - - - - - - - - - - - - - - -
## Blocks and transactions
- - - - - - - - - - - - - - - - - -
### Get Block Header
```js
pixa.api.getBlockHeader(blockNum, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Block
```js
pixa.api.getBlock(blockNum, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Ops In Block
Gets all operations in a given block

```js
pixa.api.getOpsInBlock(blockNum, onlyVirtual, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|blockNum|number|A positive number|
|onlyVirtual|bool|'false' to get all operations. 'true' to only get virtual operations|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getOpsInBlock(10000001, false, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
[ { trx_id: '4b688c13940fd5b4bb11356286ef12061f71976c',
    block: 10000001,
    trx_in_block: 0,
    op_in_trx: 0,
    virtual_op: 0,
    timestamp: '2017-03-08T17:34:24',
    op: [ 'vote', [Object] ] },
  { trx_id: 'a450debc8332c3b27935b3307891dfc509669edc',
    block: 10000001,
    trx_in_block: 2,
    op_in_trx: 0,
    virtual_op: 0,
    timestamp: '2017-03-08T17:34:24',
    op: [ 'vote', [Object] ] } ]

```
- - - - - - - - - - - - - - - - - -
### Get State
Gets a lot of information about the state of `path`

```js
pixa.api.getStateWith(path, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|path|string| like "/@username". This is the extension from the Pixa URL. It can be used on users, posts, comments, comments-by-user, replies-to-user and so on|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getState("/@username", function(err, data) {
	console.log(err, data);
});

// Here are some valid calls:

pixa.api.getState("/@username", function(err, data) { console.log(data); });

pixa.api.getState("/@username/permlink-of-post", function(err, data) { console.log(data); });

pixa.api.getState("/@username/comments", function(err, data) { console.log(data); });

pixa.api.getState("/@username/recent-replies", function(err, data) { console.log(data); });

pixa.api.getState("/trending", function(err, data) { console.log(data); });

pixa.api.getState("/trending/collorchallenge", function(err, data) { console.log(data); });

// and others....
```

Return Example:
```js
// The result is huge, and can have many variations depending on what you are getting the state of. It can't be documented briefly. Here is some basic information:
{	accounts: {username: {}},
	content: {
		"username/permlink1": {},
		"username/permlink2": {}, 
		"username/permlink3": {} …},
	current_route:"/@username",
	discussion_idx: {},
	error:"",
	feed_price: {base: "3.889 PXS", quote: "1.000 PIXA"},
	pow_queue: [],
	"props": {},
	tag_idx: { trending: [] },
	tags:{},
	witness_schedule: {},
	witnesses: {}	}
```
- - - - - - - - - - - - - - - - - -
### Get State With Options

```js
pixa.api.getStateWith(options, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|options|object|like { path : "/@username"} where the path is an extension from a Pixa URL. It can be used on users, posts, comments, comments-by-user, replies-to-user and so on|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getStateWith({ path : "/@username" }, function(err, data) {
	console.log(err, data);
});
```
See `pixa.api.getState` for more examples...
- - - - - - - - - - - - - - - - - -
### Get Trending Categories
```js
pixa.api.getTrendingCategories(after, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Best Categories
```js
pixa.api.getBestCategories(after, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Active Categories
```js
pixa.api.getActiveCategories(after, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Recent Categories
```js
pixa.api.getRecentCategories(after, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Globals
- - - - - - - - - - - - - - - - - -
### Get Config
```js
pixa.api.getConfig(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Dynamic Global Properties
```js
pixa.api.getDynamicGlobalProperties(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Chain Properties
```js
pixa.api.getChainProperties(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Feed Entries
Gets the posts in the feed of a user.
The feed displays posts of followed users, as well as what they repixed.

```js
pixa.api.getFeedEntries(account, entryId, limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|entryId|number|the post id from which to start counting. Write '0' to start from newest post|
|limit|number|a positive number|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getFeedEntries("username", 0, 2, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
[ { author: 'otherusername',
    permlink: 'permlink',
    reblog_by: [ 'repixabot' ], 	//full when post is in feed because it's repixed
    reblog_on: '2018-02-11T18:42:54',
    entry_id: 10260 },
  { author: 'otherusername',
    permlink: 'permlink',
    reblog_by: [  ], 				// false when post is in feed because user follows it's author
    reblog_on: '2018-02-11T18:39:24',
    entry_id: 10259 } ]
```
- - - - - - - - - - - - - - - - - -
### Get Feed History
```js
pixa.api.getFeedHistory(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Current Median History Price
```js
pixa.api.getCurrentMedianHistoryPrice(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Ticker
Gets the lates summorized data from the pixa market.

```js
pixa.api.getTicker(callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getTicker(function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ latest: '0.89732142857142860',
  lowest_ask: '0.89684014869888484',
  highest_bid: '0.89600000000000002',
  percent_change: '-14.56712923228768730',
  pixa_volume: '7397.697 PIXA',
  pxs_volume: '6662.316 PXS' }
```
- - - - - - - - - - - - - - - - - -
### Get Trade History
Gets the trade history for a given period between a `start` date and an `end` date

```js
pixa.api.getTradeHistory(start, end, limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|start|string|Datetime string in the format "2018-01-01T00:00:00"|
|end|string|Datetime string in the format "2018-01-01T00:00:00"|
|limit|number|a positive number|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var start = "2018-01-01T00:00:00";
var end = "2018-01-02T00:00:00";

pixa.api.getTradeHistory(start, end, 5, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ { date: '2018-01-01T00:00:09',
    current_pays: '10.192 PXS',
    open_pays: '25.650 PIXA' },
  { date: '2018-01-01T00:00:09',
    current_pays: '2.000 PXS',
    open_pays: '5.033 PIXA' },
  { date: '2018-01-01T00:00:12',
    current_pays: '13.560 PXS',
    open_pays: '34.128 PIXA' },
  { date: '2018-01-01T00:00:12',
    current_pays: '3.057 PXS',
    open_pays: '7.690 PIXA' },
  { date: '2018-01-01T00:00:12',
    current_pays: '6.908 PXS',
    open_pays: '17.375 PIXA' } ] 
```
- - - - - - - - - - - - - - - - - -
### Get Version
Gets the version of the Pixa blockchain you are connected to.

```js
pixa.api.getVersion(callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getVersion(function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ blockchain_version: '0.19.2',
  pixa_revision: '07be64314ce9d277eb7da921b459c993c2e2412c',
  fc_revision: '8dd1fd1ec0906509eb722fa7c8d280d59bcca23d' }
```
- - - - - - - - - - - - - - - - - -
### Get Volume
Gets the Pixa and Pixa Burger volumes

```js
pixa.api.getVolume(callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getVolume(function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ pixa_volume: '8101.888 PIXA',
	pxs_volume: '7287.268 PXS' }
```
- - - - - - - - - - - - - - - - - -
### Get Hardfork Version
Gets the current hardfork version of the PIXA blockchain.
```js
pixa.api.getHardforkVersion(function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
'0.19.0'
```
This returns a string and not JSON.

See also: [getNextScheduledHardfork](#get-next-scheduled-hardfork), [getConfig](#get-config)

- - - - - - - - - - - - - - - - - -
### Get Next Scheduled Hardfork
```js
pixa.api.getNextScheduledHardfork(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Reward Fund
```js
pixa.api.getRewardFund(name, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Claim Reward Balance
Claims pending rewards, be they Pixa, PXS or Vests.

```js
pixa.broadcast.claimRewardBalance(wif, account, reward_pixa, reward_pxs, reward_vests, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|wif|string|Use pixa.auth.toWif(user, pass, type)|
|account|string|a pixa username|
|reward_pixa|string|balance like "0.000 PIXA"|
|reward_pxs|string|balance like "0.000 PXS"|
|reward_vests|string|balance like "0.000006 VESTS"|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.broadcast.claimRewardBalance("5Hupd....pp7vGY", "username", "0.000 PIXA", "0.000 PXS", "0.000006 VESTS", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ id: '052f.......c6c2f',
  block_num: 19756287,
  trx_num: 40,
  expired: false,
  ref_block_num: 29928,
  ref_block_prefix: 808836877,
  expiration: '2018-02-10T20:12:15',
  operations: [ [ 'claim_reward_balance', [Object] ] ],
  extensions: [],
  signatures: [ '205......614e' ] }
```
- - - - - - - - - - - - - - - - - -
### Claim Reward Balance With Options
Claims pending rewards, be they Pixa, PXS or Vests.

```js
pixa.broadcast.claimRewardBalanceWith(wif, options, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|wif|string|Use < pixa.auth.toWif(user, pass, type) >|
|options|object|an object containing the calim parameters. Look at the example below.|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var options = {
    account:"username",
    reward_pxs:"0.000 PXS",
    reward_pixa:"0.000 PIXA",
    reward_vests:"0.000006 VESTS"
}
pixa.broadcast.claimRewardBalanceWith("5Hupd....pp7vGY", options, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 { id: '4b7b........034c7',
  block_num: 19756322,
  trx_num: 3,
  expired: false,
  ref_block_num: 29965,
  ref_block_prefix: 4245658614,
  expiration: '2018-02-10T20:14:00',
  operations: [ [ 'claim_reward_balance', [Object] ] ],
  extensions: [],
  signatures: [ '1f61a..........4f3d7' ] }
```
- - - - - - - - - - - - - - - - - -
### Get Vesting Delegations
Returns a list of delegations made from one `account`. Denominated in VESTS.
```js
pixa.api.getVestingDelegations(account, from, limit, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|account|Account who is making the delegations|String||
|from|The name of the last account to begin from|String|Use the empty string `''` to start the list. Subsequent calls can use the last delegatee's account name|
|limit|The maximum number of delegation records to return|Integer||
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|


Call Example:
```js
pixa.api.getVestingDelegations('ned', '', 2, function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
[ { id: 498422, delegator: 'ned', delegatee: 'spaminator', vesting_shares: '409517519.233783 VESTS', min_delegation_time: '2018-01-16T19:30:36' },
  { id: 181809, delegator: 'ned', delegatee: 'surpassinggoogle', vesting_shares: '1029059275.000000 VESTS', min_delegation_time: '2017-08-08T15:25:15' } ]
```

Using the Result:
```js
// Extract delegatee names from the result into an array of account name strings
var f = result.map(function(item) { return item.delegatee; });
console.log(f);

// Get the last tag for subsequent calls to `getVestingDelegations`
//   or use: f[f.length - 1]   if you used the extraction code above.
var lastKnownDelegatee = result[result.length - 1].delegatee;

// Use the last known delegatee to get the next group of delegatees
pixa.api.TrendingTags('ned', lastKnownDelegatee, 2, function(err, result) {
  console.log(err, result);
});
```

See also: [accountCreateWithDelegation](#account-create-with-delegation), [delegateVestingShares](#delegate-vesting-shares)

- - - - - - - - - - - - - - - - - -
## Keys
- - - - - - - - - - - - - - - - - -
### Get Key References
```js
pixa.api.getKeyReferences(key, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Accounts
- - - - - - - - - - - - - - - - - -
### Get Accounts
```js
pixa.api.getAccounts(names, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Account References
```js
pixa.api.getAccountReferences(accountId, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Lookup Account Names
```js
pixa.api.lookupAccountNames(accountNames, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Lookup Accounts
```js
pixa.api.lookupAccounts(lowerBoundName, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Account Count
```js
pixa.api.getAccountCount(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Conversion Requests
```js
pixa.api.getConversionRequests(accountName, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Account History
```js
pixa.api.getAccountHistory(account, from, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Owner History
```js
pixa.api.getOwnerHistory(account, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Recovery Request
```js
pixa.api.getRecoveryRequest(account, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Account Bandwidth
Get the bandwidth of the `account`.
The bandwidth is the limit of data that can be uploaded to the blockchain.
To have bigger bandwidth - power up your pixa.

```js
pixa.api.getAccountBandwidth(account, bandwidthType, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|bandwidthType|number|This is a value from an enumeration of predefined values. '1' is for the "Forum" bandwidth, and '2' is for "Market" bandwidth|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
const forumBandwidthType = 1;
const marketBandwidthType = 2;

pixa.api.getAccountBandwidth("username", forumBandwidthType, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ id: 23638,
  account: 'username',
  type: 'forum',
  average_bandwidth: 260815714,
  lifetime_bandwidth: '125742000000',
  last_bandwidth_update: '2018-02-07T22:30:42' }
```
- - - - - - - - - - - - - - - - - -
### Get Account Bandwidth With Options
Get the bandwidth of the user specified in the options.

```js
pixa.api.getAccountBandwidthWith(options, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|options|object|like { account: "username", bandwidthType: 1 } where bandwidthType is the value of an enumeration. 1 is "forum" and 2 is "market". They represent the bandwidths for posting and trading respectively|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var options = {
	account: "username",
	bandwidthType: 2
}
pixa.api.getAccountBandwidthWith(options, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
{ id: 23675,
  account: 'username',
  type: 'market',
  average_bandwidth: 2608157142,
  lifetime_bandwidth: '94940000000',
  last_bandwidth_update: '2018-02-07T22:30:42' }
```
- - - - - - - - - - - - - - - - - -
### Get Account Reputations
Gets the reputation points of `limit` accounts with names most similar to `lowerBoundName`.

```js
pixa.api.getAccountReputations(lowerBoundName, limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|lowerBoundName|string|a pixa username query|
|limit|number|a positive number|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getAccountReputations("username", 2, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ { account: 'username', reputation: '26727073581' },
   { account: 'username-taken', reputation: 0 } ]
```
- - - - - - - - - - - - - - - - - -
## Market
- - - - - - - - - - - - - - - - - -
### Get Order Book
```js
pixa.api.getOrderBook(limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Market Order Book
Takes the top-most `limit` entries in the market order book for both buy and sell orders.

```js
pixa.api.getMarketOrderBook(limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|limit|number|a positive number|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getMarketOrderBook(2, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 { bids: 
   [ { price: '0.91116173120728938', pixa: 2195, pxs: 2000 },
     { price: '0.91089965397923878', pixa: 1156, pxs: 1053 } ],
  asks: 
   [ { price: '0.91145625249700357', pixa: 9053, pxs: 8251 },
     { price: '0.91159226975214813', pixa: 16184, pxs: 14753 } ] }
```
- - - - - - - - - - - - - - - - - -
### Get Market Order Book With Options
Takes the top-most `limit` entries in the market order book for both buy and sell orders.

```js
pixa.api.getMarketOrderBookWith(options, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|options|object|like { limit:number }|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getMarketOrderBookWith({ limit: 3 }, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 { bids: 
   [ { price: '0.90160333845815954', pixa: 9106, pxs: 8210 },
     { price: '0.90152855993563952', pixa: 12430, pxs: 11206 },
     { price: '0.89992800575953924', pixa: 5556, pxs: 5000 } ],
  asks: 
   [ { price: '0.91004578507945044', pixa: 5055, pxs: 4600 },
     { price: '0.91103965702036438', pixa: 15853, pxs: 14442 },
     { price: '0.91112433075550281', pixa: 5874, pxs: 5351 } ] } 
```
- - - - - - - - - - - - - - - - - -
### Get Open Orders
```js
pixa.api.getOpenOrders(owner, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Liquidity Queue
```js
pixa.api.getLiquidityQueue(startAccount, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Market History Buckets

```js
pixa.api.getMarketHistoryBuckets(callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getMarketHistoryBuckets(function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ 15, 60, 300, 3600, 86400 ]
```
- - - - - - - - - - - - - - - - - -
## Authority / validation
- - - - - - - - - - - - - - - - - -
### Get Transaction Hex
```js
pixa.api.getTransactionHex(trx, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Transaction
```js
pixa.api.getTransaction(trxId, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Required Signatures
```js
pixa.api.getRequiredSignatures(trx, availableKeys, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Potential Signatures
```js
pixa.api.getPotentialSignatures(trx, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Verify Authority
```js
pixa.api.verifyAuthority(trx, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Verify Account Authority
```js
pixa.api.verifyAccountAuthority(nameOrId, signers, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Tags Used By Author
Gets tags used by a pixa user. Most users have no tags yet, but some do.

```js
pixa.api.getTagsUsedByAuthor(author, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|author|string|a pixa username|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getTagsUsedByAuthor("good-karma", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ [ 'challenge', 0 ] ]
```
- - - - - - - - - - - - - - - - - -
## Votes
- - - - - - - - - - - - - - - - - -
### Get Active Votes
```js
pixa.api.getActiveVotes(author, permlink, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Account Votes
```js
pixa.api.getAccountVotes(voter, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Content
- - - - - - - - - - - - - - - - - -
### Get Content
```js
pixa.api.getContent(author, permlink, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Content Replies
```js
pixa.api.getContentReplies(author, permlink, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Discussions By Author Before Date
```js
pixa.api.getDiscussionsByAuthorBeforeDate(author, startPermlink, beforeDate, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Reblogged By
Gives a list of the users that reblogged (repixed) a given post

```js
pixa.api.getRebloggedBy(author, permlink, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|author|string|a pixa username|
|permlink|string|a permalink of comment or post|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getRebloggedBy("author", "example-permlink", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ 'author',
  'user1',
  'user2',
  'user3',
  'user4' ]
```
- - - - - - - - - - - - - - - - - -
### Get Replies By Last Update
```js
pixa.api.getRepliesByLastUpdate(startAuthor, startPermlink, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Witnesses
- - - - - - - - - - - - - - - - - -
### Get Witnesses
```js
pixa.api.getWitnesses(witnessIds, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Witness By Account
Returns information about a witness with the given `accountName`.
```js
pixa.api.getWitnessByAccount(accountName, function(err, result) {
  console.log(err, result);
});
```
|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|accountName|The account name of the witness to query|String||
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|

Call Example:
```js
pixa.api.getVestingDelegations('sircork', '', 2, function(err, result) {
  console.log(err, result);
});
```

See also: 
- - - - - - - - - - - - - - - - - -
### Get Witnesses By Vote
```js
pixa.api.getWitnessesByVote(from, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Lookup Witness Accounts
```js
pixa.api.lookupWitnessAccounts(lowerBoundName, limit, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Witness Count
```js
pixa.api.getWitnessCount(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Active Witnesses
```js
pixa.api.getActiveWitnesses(function(err, result) {
  console.log(err, result);
});

```
- - - - - - - - - - - - - - - - - -
### Get Witness Schedule
Gets some general information about the witnesses.

```js
pixa.api.getWitnessSchedule(callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getWitnessSchedule(function(err, data) {
  console.log(err,data);
}
```

Return Example:
```js
{ id: 0,
  current_virtual_time: '292589412128104496649868821',
  next_shuffle_block_num: 19756485,
  current_shuffled_witnesses: '31797..................00000000',
  num_scheduled_witnesses: 21,
  top19_weight: 1,
  timeshare_weight: 5,
  miner_weight: 1,
  witness_pay_normalization_factor: 25,
  median_props: 
   { account_creation_fee: '0.100 PIXA',
     maximum_block_size: 65536,
     pxs_interest_rate: 0 },
  majority_version: '0.19.2',
  max_voted_witnesses: 20,
  max_miner_witnesses: 0,
  max_runner_witnesses: 1,
  hardfork_required_witnesses: 17 }
```
- - - - - - - - - - - - - - - - - -
### Get Miner Queue
```js
pixa.api.getMinerQueue(function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Login API
- - - - - - - - - - - - - - - - - -
### Login

/!\ It's **not safe** to use this method with your username and password. This method always return `true` and is only used internally with empty values to enable broadcast.

```js
pixa.api.login('', '', function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Api By Name
```js
pixa.api.getApiByName(apiName, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
## Follow API
The follower API queries information about follow relationships between accounts. The API is read-only and does not create changes on the blockchain.

- - - - - - - - - - - - - - - - - -
### Get Followers
Returns an alphabetical ordered array of the accounts that are following a particular account.

```js
pixa.api.getFollowers(following, startFollower, followType, limit, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|following|The followers of which account|String|No leading @ symbol|
|startFollower|Start the list from which follower?|String|No leading @symbol. Use the empty string `''` to start the list. Subsequent calls can use the name of the last follower|
|followType|??|??|Set to 0 or 'blog' - either works|
|limit|The maximum number of followers to return|Integer||
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|


Call Example:
```js
pixa.api.getFollowers('ned', '', 'blog', 2, function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
[ { follower: 'a-0-0', following: 'ned', what: [ 'blog' ] },
  { follower: 'a-0-0-0-1abokina', following: 'ned', what: [ 'blog' ] } ]
```

Using the Result:
```js
// Extract followers from the result into an array of account name strings
var f = result.map(function(item) { return item.follower; });
console.log(f);

// Get the last follower for subsequent calls to getFollowers
//   or use: f[f.length - 1]   if you used the extraction code above.
var lastKnownFollower = result[result.length - 1].follower;

// Use the last known follower to get the next group of followers
pixa.api.getFollowers('ned', lastKnownFollower, 'blog', 2, function(err, result) {
  console.log(err, result);
});
```

See also: [getFollowing](#get-following), [getFollowCount](#get-follow-count)


- - - - - - - - - - - - - - - - - -
### Get Following
Returns an alphabetical ordered Array of the accounts that are followed by a particular account.
```js
pixa.api.getFollowing(follower, startFollowing, followType, limit, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|follower|The account to get the following for|String|No leading @ symbol|
|startFollowing|Start the list at which followed account?|String|No leading @symbol. Use the empty string `''` to start the list|
|followType|??|??|Set to 0 or 'blog' - either works|
|limit|The maximum number of items to return|Integer||
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|


Call Example:
```js
pixa.api.getFollowing('dan', '', 'blog', 2, function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
[ { follower: 'dan', following: 'dantheman', what: [ 'blog' ] },
  { follower: 'dan', following: 'krnel', what: [ 'blog' ] } ]
```

Using the Result:
```js
// Extract followed accounts from the result into an array of account name strings
var f = result.map(function(item) { return item.following; });
```
See the usage examples for [getFollowers](#get-followers) because the behaviour is very similar.


See also: [getFollowers](#get-followers), [getFollowCount](#get-follow-count)


- - - - - - - - - - - - - - - - - -
### Get Follow Count
```js
pixa.api.getFollowCount(account, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|account|The name for get the follow ccount for|String|No leading @ symbol|
|function()|Your callback|function|Tip: use `console.log(err, result)` to see the result|


Call Example:
```js
pixa.api.getFollowCount('ned', function(err, result) {
  console.log(err, result);
});
```

Return Example:
```js
{ account: 'ned', follower_count: 16790, following_count: 913 }
```


See also: [getFollowers](#get-followers), [getFollowing](#get-following)


- - - - - - - - - - - - - - - - - -
## Broadcast API
- - - - - - - - - - - - - - - - - -
### Broadcast Block With Options
Broadcast a new block on the pixa blockchain.

```js
pixa.api.broadcastBlockWith(options, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|options|object|like { b: blockObject } where blockObject contains the information on the block you are trying to broadcast|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
var options = { 
    b: {
        previous:"0000000000000000000000000000000000000000",
        timestamp:"1970-01-01T00:00:00",
        witness:"",
        transaction_merkle_root:"0000000000000000000000000000000000000000",
        extensions:[],
        witness_signature:
            "00000000000000000000000000000000000000000000000000000000000000000"+
            "00000000000000000000000000000000000000000000000000000000000000000",
        transactions: []
    }
};

pixa.api.broadcastBlockWith(options, function(err, data) {
	console.log(err, data);
});
```
- - - - - - - - - - - - - - - - - -
### Broadcast Transaction Synchronous
```js
pixa.api.broadcastTransactionSynchronous(trx, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Broadcast Block
```js
pixa.api.broadcastBlock(b, function(err, result) {
  console.log(err, result);
});
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Broadcast
The `pixa.broadcast` methods cause permanent changes on the blockchain.
- - - - - - - - - - - - - - - - - -
### Account Create
```js
pixa.broadcast.accountCreate(wif, fee, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Account Create With Delegation
```js
pixa.broadcast.accountCreateWithDelegation(wif, fee, delegation, creator, newAccountName, owner, active, posting, memoKey, jsonMetadata, extensions, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Delegate Vesting Shares
Delegates PIXA POWER, denominated in VESTS, from a `delegator` to the `delegatee`. Requires the `delegator`'s private WIF key. Set the delegation to 0 to undelegate.
```js
pixa.broadcast.delegateVestingShares(wif, delegator, delegatee, vesting_shares, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Account Update
```js
pixa.broadcast.accountUpdate(wif, account, owner, active, posting, memoKey, jsonMetadata, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Account Witness Proxy
```js
pixa.broadcast.accountWitnessProxy(wif, account, proxy, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Account Witness Vote
```js
pixa.broadcast.accountWitnessVote(wif, account, witness, approve, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Challenge Authority
```js
pixa.broadcast.challengeAuthority(wif, challenger, challenged, requireOwner, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Change Recovery Account
```js
pixa.broadcast.changeRecoveryAccount(wif, accountToRecover, newRecoveryAccount, extensions, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Comment
```js
pixa.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Comment Options
```js
pixa.broadcast.commentOptions(wif, author, permlink, maxAcceptedPayout, percentPixaBurgers, allowVotes, allowCurationRewards, extensions, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Comment Payout
```js
pixa.broadcast.commentPayout(wif, author, permlink, payout, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Comment Reward
```js
pixa.broadcast.commentReward(wif, author, permlink, pxsPayout, vestingPayout, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Convert
```js
pixa.broadcast.convert(wif, owner, requestid, amount, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Curate Reward
```js
pixa.broadcast.curateReward(wif, curator, reward, commentAuthor, commentPermlink, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Custom
```js
pixa.broadcast.custom(wif, requiredAuths, id, data, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Custom Binary
```js
pixa.broadcast.customBinary(wif, id, data, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Custom Json
```js
pixa.broadcast.customJson(wif, requiredAuths, requiredPostingAuths, id, json, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Delete Comment
```js
pixa.broadcast.deleteComment(wif, author, permlink, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Escrow Dispute
```js
pixa.broadcast.escrowDispute(wif, from, to, agent, who, escrowId, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Escrow Release
```js
pixa.broadcast.escrowRelease(wif, from, to, agent, who, receiver, escrowId, pxsAmount, pixaAmount, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Escrow Transfer
```js
pixa.broadcast.escrowTransfer(wif, from, to, agent, escrowId, pxsAmount, pixaAmount, fee, ratificationDeadline, escrowExpiration, jsonMeta, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Escrow
```js
pixa.api.getEscrow(from, escrowId, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|from|string|a pixa username|
|escrowId|number|id of the specific escrow transfer|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getEscrow("username", 23456789, function(err, data) {
	console.log(err, data);
});
```
- - - - - - - - - - - - - - - - - -
### Feed Publish
```js
pixa.broadcast.feedPublish(wif, publisher, exchangeRate, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Pow2
```js
pixa.broadcast.pow2(wif, work, newOwnerKey, props, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Fill Convert Request
```js
pixa.broadcast.fillConvertRequest(wif, owner, requestid, amountIn, amountOut, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Fill Order
```js
pixa.broadcast.fillOrder(wif, currentOwner, currentOrderid, currentPays, openOwner, openOrderid, openPays, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Fill Vesting Withdraw
```js
pixa.broadcast.fillVestingWithdraw(wif, fromAccount, toAccount, withdrawn, deposited, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Withdraw Routes
Gets withdraw routes (pixa power withdraws).

```js
pixa.api.getWithdrawRoutes(account, withdrawRouteType, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|withdrawRouteType|number|a number representing a value from an enumeration. Must be 0, 1 or 2|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getWithdrawRoutes("username", 1, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
[ { from_account: 'username',
    to_account: 'receiver',
    percent: 10000,
    auto_vest: false } ]
```
- - - - - - - - - - - - - - - - - -
### Interest
```js
pixa.broadcast.interest(wif, owner, interest, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Limit Order Cancel
Cancels an open limit order on the [internal market](http://steemit.com/market). Be aware that the order might be filled, or partially filled, before this call completes.

```js
pixa.broadcast.limitOrderCancel(wif, owner, orderid, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|wif|Active private key|String||
|owner|Account name|String|No leading @ symbol|
|orderid|User defined ordernumber|Integer|The `orderid` used when the order was created|
|function()|Your callback|function||


See also: [getOpenOrders](#get-open-orders), [limitOrderCancel](#limit-order-cancel), [limitOrderCreate2](#limit-order-create2)


- - - - - - - - - - - - - - - - - -
### Limit Order Create
Creates a limit order on the [internal market](http://steemit.com/market) to trade one asset for another using a specified minimum. Orders can be set attempt to fill immediately and or to go to the orderbook. Orders in the order book remain until filled or the expiration time is reached.

```js
pixa.broadcast.limitOrderCreate(wif, owner, orderid, amountToSell, minToReceive, fillOrKill, expiration, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|wif|Active private key|String||
|owner|Account name|String|No leading @ symbol|
|orderid|User defined ordernumber|Integer|Used to cancel orders|
|amountToSell|Amount to sell|String|"X.XXX ASSET" must have 3 decimal places. e.g. "25.100 PXS"|
|minToReceive|Amount desired|String|"X.XXX ASSET" must have 3 decimal places. e.g. "20.120 PIXA"|
|fillOrKill|Fill order from current order book or kill the order|Boolean|`false` places the order into the Order Book until either cancelled, filled, or the expiration time is reached|
|expiration|Time when order expires|Integer|Unit milliseconds. Zero is UNIX epoch|
|function()|Your callback|function||

Tip: `expiration` time must always be in the future even if `fillOrKill` is set to `true`.

Risky tip: The Internal Market seems to always try and get the best price from the current orderbook so, to place an at market order, then use the `minToReceive` as `0.001` and `fillOrKill` as `true` (use at own risk).


See also: [getOrderBook](#get-order-book), [getOpenOrders](#get-open-orders), [limitOrderCancel](#limit-order-cancel), [limitOrderCreate2](#limit-order-create2)


- - - - - - - - - - - - - - - - - -
### Limit Order Create2
Creates a limit order on the [internal market](http://steemit.com/market) to trade one asset for another using an exchange rate.  Orders can be set attempt to fill immediately and or to go to the orderbook. Orders in the order book remain until filled or the expiration time is reached.

```js
pixa.broadcast.limitOrderCreate2(wif, owner, orderid, amountToSell, exchangeRate, fillOrKill, expiration, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|wif|Active private key|String||
|owner|Account name|String|No leading @ symbol|
|orderid|User defined order identifier|Integer|Used to cancel orders|
|amountToSell|Amount to sell|String|"X.XXX ASSET" must have 3 decimal places. e.g. "25.100 PXS"|
|exchangeRate|The exchange rate|Integer|`amountToSell` is multiplied by the `exchangeRate` to have the same effect as `minToReceive`|
|fillOrKill|Fill order from current order book or kill the order|Boolean|`false` places the order into the Order Book until either canceled, filled, or the expiration time is reached|
|expiration|Time when order expires|Integer|Unit milliseconds. Zero is UNIX epoch|
|function()|Your callback|function||


See also: [getOrderBook](#get-order-book), [getOpenOrders](#get-open-orders), [limitOrderCancel](#limit-order-cancel), [limitOrderCreate](#limit-order-create2)


- - - - - - - - - - - - - - - - - -
### Liquidity Reward
```js
pixa.broadcast.liquidityReward(wif, owner, payout, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Pow
```js
pixa.broadcast.pow(wif, worker, input, signature, work, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Prove Authority
```js
pixa.broadcast.proveAuthority(wif, challenged, requireOwner, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Recover Account
```js
pixa.broadcast.recoverAccount(wif, accountToRecover, newOwnerAuthority, recentOwnerAuthority, extensions, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Set Reset Account
Changes the `current_reset_account` of the `account` to a new `reset_account`

```js
pixa.broadcast.setResetAccount(wif, account, current_reset_account, reset_account, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|wif|string|Use < pixa.auth.toWif(user, pass, type) >|
|account|string|a pixa username|
|current_reset_account|string|a pixa username|
|reset_account|string|a pixa username|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.broadcast.setResetAccount(wif, "username", "oldresetaccount", "newresetaccount", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 AssertException
	`false: Set Reset Account Operation is currently disabled.`
```
- - - - - - - - - - - - - - - - - -
### Report Over Production
```js
pixa.broadcast.reportOverProduction(wif, reporter, firstBlock, secondBlock, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Request Account Recovery
```js
pixa.broadcast.requestAccountRecovery(wif, recoveryAccount, accountToRecover, newOwnerAuthority, extensions, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Escrow Approve
```js
pixa.broadcast.escrowApprove(wif, from, to, agent, who, escrowId, approve, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Set Withdraw Vesting Route
```js
pixa.broadcast.setWithdrawVestingRoute(wif, fromAccount, toAccount, percent, autoVest, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Transfer
Transfers assets, such as PIXA or PXS, from one account to another.
```js
pixa.broadcast.transfer(wif, from, to, amount, memo, function(err, result) {
  console.log(err, result);
});
```
|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|wif|Active private key for the `from` account|String||
|from|Account name to take asset from|String|No leading @ symbol|
|to|Account name to place asset into|String|No leading @ symbol|
|amount|Amount of of asset to transfer|String|"X.XXX ASSET" must have 3 decimal places. e.g. "5.150 PXS"|
|function()|Your callback|function||

See also: [transferToVesting](#transfer-to-vesting)
- - - - - - - - - - - - - - - - - -
### Transfer To Vesting
Vests PIXA into PIXA POWER. This method supports powering up one account from another.
```js
pixa.broadcast.transferToVesting(wif, from, to, amount, function(err, result) {
  console.log(err, result);
});
```

|Parameter|Description|Datatype|Notes|
|---|---|---|---|
|wif|Active private key for the `from` account|String||
|from|Account name to take PIXA from|String|No leading @ symbol|
|to|Account name to vest PIXA POWER into|String|No leading @ symbol. Can be the same account as `to`|
|amount|Amount of PIXA to vest/power up|String|"X.XXX PIXA" must have 3 decimal places. e.g. "25.100 PIXA". Must be denominated in PIXA|
|function()|Your callback|function||

See also: [transfer](#transfer)
- - - - - - - - - - - - - - - - - -
### Vote
```js
pixa.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Withdraw Vesting
```js
pixa.broadcast.withdrawVesting(wif, account, vestingShares, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Witness Update
```js
pixa.broadcast.witnessUpdate(wif, owner, url, blockSigningKey, props, fee, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Fill Vesting Withdraw
```js
pixa.broadcast.fillVestingWithdraw(wif, fromAccount, toAccount, withdrawn, deposited, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Fill Order
```js
pixa.broadcast.fillOrder(wif, currentOwner, currentOrderid, currentPays, openOwner, openOrderid, openPays, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Recent Trades
Gets a list of the last `limit` trades from the market.

```js
pixa.api.getRecentTrades(limit, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|limit|number|a positive number|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getRecentTrades(2, function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ { date: '2018-02-10T20:38:39',
    current_pays: '0.306 PXS',
    open_pays: '0.340 PIXA' },
  { date: '2018-02-10T20:36:48',
    current_pays: '8.982 PXS',
    open_pays: '9.995 PIXA' } ]
```
- - - - - - - - - - - - - - - - - -
### Fill Transfer From Savings
```js
pixa.broadcast.fillTransferFromSavings(wif, from, to, amount, requestId, memo, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Get Savings Withdraw From
Gets a list of savings withdraws from `account`.

```js
pixa.api.getSavingsWithdrawFrom(account, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getSavingsWithdrawFrom("username", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ /* list of withdraws from savings */ ]
```
- - - - - - - - - - - - - - - - - -
### Get Savings Withdraw To
Gets a list of savings withdraws from `account`.

```js
pixa.api.getSavingsWithdrawTo(account, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|string|a pixa username|
|callback|function|function(err, data) {/*code*/}|


Call Example:
```js
pixa.api.getSavingsWithdrawTo("username", function(err, data) {
	console.log(err, data);
});
```

Return Example:
```js
 [ /* list of withdraws from savings */ ]
```
- - - - - - - - - - - - - - - - - -
### Comment Payout
```js
pixa.broadcast.commentPayout(wif, author, permlink, payout, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Transfer To Savings
```js
pixa.broadcast.transferToSavings(wif, from, to, amount, memo, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Transfer From Savings
```js
pixa.broadcast.transferFromSavings(wif, from, requestId, to, amount, memo, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Cancel Transfer From Savings
```js
pixa.broadcast.cancelTransferFromSavings(wif, from, requestId, function(err, result) {
  console.log(err, result);
});
```
- - - - - - - - - - - - - - - - - -
### Multisig
You can use multisignature to broadcast an operation.
```js
pixa.broadcast.send({
  extensions: [],
  operations: [
    ['vote', {
      voter: 'guest123',
      author: 'fabien',
      permlink: 'test',
      weight: 1000
    }]
  ]}, [privPostingWif1, privPostingWif2], (err, result) => {
  console.log(err, result);
});
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Auth
- - - - - - - - - - - - - - - - - -
### Verify
```js
pixa.auth.verify(name, password, auths);
```
- - - - - - - - - - - - - - - - - -
### Generate Keys
```js
pixa.auth.generateKeys(name, password, roles);
```
- - - - - - - - - - - - - - - - - -
### Get Private Keys
```js
pixa.auth.getPrivateKeys(name, password, roles);
```
- - - - - - - - - - - - - - - - - -
### Is Wif
```js
pixa.auth.isWif(privWif);
```
- - - - - - - - - - - - - - - - - -
### To Wif
```js
pixa.auth.toWif(name, password, role);
```
- - - - - - - - - - - - - - - - - -
### Wif Is Valid
```js
pixa.auth.wifIsValid(privWif, pubWif);
```
- - - - - - - - - - - - - - - - - -
### Wif To Public
```js
pixa.auth.wifToPublic(privWif);
```
- - - - - - - - - - - - - - - - - -
### Sign Transaction
```js
pixa.auth.signTransaction(trx, keys);
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Formatter
- - - - - - - - - - - - - - - - - -
### Amount
Formats number and currency to the valid way for sending (for example - it trims the number's floating point remainer to 3 digits only).

```js
pixa.formatter.amount(_amount, asset);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|_amount|number|A positive number|
|asset|string|The name of a pixa asset (pixa, pxs)|


Call Example:
```js
pixa.formatter.amount(53.442346, "PIXA");
```

Return Example:
```js
 "53.442 PIXA" 
```
- - - - - - - - - - - - - - - - - -
### Vesting Pixa
Converts the vests of `account` into the number of Pixa they represent.

```js
pixa.formatter.vestingPixa(account, gprops, callback);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|object|a pixa user object|
|groups|object|the properties object of the state of "/@username"|


Call Example:
```js
pixa.api.getAccounts(["username"], function(e1, accounts) {
  pixa.api.getState("/@username", function (e2, state) {        
	  var vestingPixa = pixa.formatter.vestingPixa(accounts[0], state.props);	
  });
});
```

Return Example:
```js
 7.42431235
```
- - - - - - - - - - - - - - - - - -
### Number With Commas
Formats a big number, by adding a comma on every 3 digits.
Attention - only works on strings. No numbers can be passed directly.

```js
pixa.formatter.numberWithCommas(x);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|x|string|Number to format as string|


Call Example:
```js
pixa.formatter.numberWithCommas(53304432342.432.toString());
// or
pixa.formatter.numberWithCommas("53304432342.432");
```

Return Example:
```js
 "53,304,432,342.432" 
```
- - - - - - - - - - - - - - - - - -
### Estimate Account Value
Gets the estimated burger value of the assets of `account`

```js
pixa.formatter.estimateAccountValue(account);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|account|object|a pixa user object|


Call Example:
```js
pixa.api.getAccounts(["username"], function(e1, accounts) {
  var accountValueInUSD = pixa.formatter.estimateAccountValue(accounts[0])
    .catch(function (err) { console.log(err); })
    .then(function (data) { console.log(data); });
});
```

Return Example:
```js
 // The method returns a promise object, that later returns a number as result
 32.25
```
- - - - - - - - - - - - - - - - - -
### Create Suggested Password
```js
var password = pixa.formatter.createSuggestedPassword();
console.log(password);
// => 'GAz3GYFvvQvgm7t2fQmwMDuXEzDqTzn9'
```
- - - - - - - - - - - - - - - - - -
### Comment Permlink
```js
var parentAuthor = 'ned';
var parentPermlink = 'a-selfie';
var commentPermlink = pixa.formatter.commentPermlink(parentAuthor, parentPermlink);
console.log(commentPermlink);
// => 're-ned-a-selfie-20170621t080403765z'
```
- - - - - - - - - - - - - - - - - -
### Estimate Account Value
```js
var pixaPower = pixa.formatter.estimateAccountValue(account);
```
- - - - - - - - - - - - - - - - - -
### Reputation
```js
var reputation = pixa.formatter.reputation(3512485230915);
console.log(reputation);
// => 56
```
- - - - - - - - - - - - - - - - - -
### Vest To Pixa
```js
var pixaPower = pixa.formatter.vestToPixa(vestingShares, totalVestingShares, totalVestingFundPixa);
console.log(pixaPower);
```

- - - - - - - - - - - - - - - - - -
- - - - - - - - - - - - - - - - - -
# Utils
- - - - - - - - - - - - - - - - - -
### Validate Username
```js
var isValidUsername = pixa.utils.validateAccountName('test1234');
console.log(isValidUsername);
// => 'null'

var isValidUsername = pixa.utils.validateAccountName('a1');
console.log(isValidUsername);
// => 'Account name should be longer.'
```
- - - - - - - - - - - - - - - - - -
### Camel Case
Formats a string with '_' characters to follow the CamelCase notation instead.

```js
pixa.utils.camelCase(str);
```

|Parameter|Datatype|Description|
|---------|--------|-----------|
|str|string|the string will be converted to camelCase like "exampleString"|


Call Example:
```js
pixa.utils.camelCase("example_string");
```

Return Example:
```js
"exampleString"
```
