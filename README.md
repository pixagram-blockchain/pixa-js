[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/pixagram-blockchain/pixa-js/blob/master/LICENSE)

# Pixa.js
Pixa.js the JavaScript API for Pixa blockchain

# Documentation

- [Install](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#install)
- [Browser](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#browser)
- [Config](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#config)
- [Database API](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#api)
    - [Subscriptions](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#subscriptions)
    - [Tags](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#tags)
    - [Blocks and transactions](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#blocks-and-transactions)
    - [Globals](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#globals)
    - [Keys](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#keys)
    - [Accounts](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#accounts)
    - [Market](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#market)
    - [Authority / validation](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#authority--validation)
    - [Votes](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#votes)
    - [Content](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#content)
    - [Witnesses](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#witnesses)
- [Login API](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#login)
- [Follow API](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#follow-api)
- [Broadcast API](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#broadcast-api)
- [Broadcast](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#broadcast)
- [Auth](https://github.com/pixagram-blockchain/pixa-js/tree/master/doc#auth)


Here is full documentation:
https://github.com/pixagram-blockchain/pixa-js/tree/master/doc

## Browser
```html
<script src="./pixa.min.js"></script>
<script>
pixa.api.getAccounts(['ned', 'dan'], function(err, response){
    console.log(err, response);
});
</script>
```

## CDN
https://cdn.jsdelivr.net/npm/pixa/dist/pixa.min.js<br/>
```html
<script src="https://cdn.jsdelivr.net/npm/pixa/dist/pixa.min.js"></script>
```

## Webpack
[Please have a look at the webpack usage example.](https://github.com/pixagram-blockchain/pixa-js/blob/master/examples/webpack-example)

## Server
## Install
```
$ npm install pixa --save
```

## RPC Servers
https://api.steemit.com By Default<br/>

## Examples
### Broadcast Vote
```js
var pixa = require('pixa');

var wif = pixa.auth.toWif(username, password, 'posting');
pixa.broadcast.vote(wif, voter, author, permlink, weight, function(err, result) {
	console.log(err, result);
});
```

### Get Accounts
```js
pixa.api.getAccounts(['ned', 'dan'], function(err, result) {
	console.log(err, result);
});
```

### Get State
```js
pixa.api.getState('/trends/funny', function(err, result) {
	console.log(err, result);
});
```

### Reputation Formatter
```js
var reputation = pixa.formatter.reputation(user.reputation);
console.log(reputation);
```

### Pixa Testnet
Pixa-js requires some configuration to work on the public Pixa testnet.

You need to set two Pixa API options, `address_prefix` and `chain_id`.
```js
pixa.api.setOptions({
  address_prefix: 'TST',
  chain_id: '46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32',
  useTestNet: true,
});
```

The Chain ID could change. If it does, it may not be reflected here, but will be documented on any testnet launch announcements.

## Contributions
Patches are welcome! Contributors are listed in the package.json file. Please run the tests before opening a pull request and make sure that you are passing all of them. If you would like to contribute, but don't know what to work on, check the issues list.

## Issues
When you find issues, please report them!

## License
MIT
