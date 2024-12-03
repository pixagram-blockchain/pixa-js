const crypto = require('crypto');

// Mock window and window.crypto
global.window = {};
window.crypto = {
    getRandomValues: function (buffer) {
        return crypto.randomFillSync(buffer);
    },
};

// Import the library
const steem = require('./lib');

steem.api.setOptions({
    url: 'http://173.212.236.106:7777',
    address_prefix: 'PIX',
    chain_id: '46d82ab7d8db682eb1959aed0ada039a6d49afa1602491f93dde9cac3e8e6c32',
    useTestNet: true,
  });

// Test functionality
steem.api.getAccounts(['initminer'], (err, result) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Account Info:', result);
    }
});

