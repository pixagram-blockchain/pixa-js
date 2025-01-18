const crypto = require('crypto');
const steem = require('./lib');

// Mock `window` and `window.crypto` if needed
global.window = {};
window.crypto = {
  getRandomValues(buffer) {
    return crypto.randomFillSync(buffer);
  },
};

steem.api.setOptions({
  url: 'http://134.122.91.207:7777',
  address_prefix: 'PIX',
  chain_id: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
  useAppbaseApi: true,
  // useTestNet: true, // Uncomment if needed for your particular environment
});

// Replace with actual initminer key
const INITMINER_WIF = '5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n';

async function createAccountAndTransfer() {
  try {

    steem.api.getWitnessSchedule((err, schedule) => {
        if (err) {
          console.error('Error fetching witness schedule:', err);
        } else {
          console.log('Witness Schedule:', schedule);
          console.log('Account Creation Fee (median_props):', schedule.median_props.account_creation_fee);
        }
      });

    // Generate a random 3-digit number (100–999)
    const randomDigits = Math.floor(Math.random() * 900) + 100;
    const newAccountName = `temp${randomDigits}`;

    // Generate keys
    const password   = `random-${Date.now()}`;
    const ownerWif   = steem.auth.toWif(newAccountName, password, 'owner');
    const ownerPubkey = steem.auth.wifToPublic(ownerWif);

    // Define an authority (for owner, active, posting)
    const ownerAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[ownerPubkey, 1]],
    };

    // Adjust based on your chain's asset symbol
    const creationFee = '0.000 PXCT';  // Must match chain settings
    const creatorName = 'initminer';

    // 1) Create the account using accountCreate
    await new Promise((resolve, reject) => {
    steem.broadcast.accountCreate(
        INITMINER_WIF,
        creationFee,
        creatorName,
        newAccountName,
        ownerAuth,
        ownerAuth,
        ownerAuth,
        ownerPubkey,
        '',
        (err, result) => {
        if (err) return reject(err);
        resolve(result);
        }
    );
    });

    console.log(`New account created: ${newAccountName}`);

    // OPTIONAL: If you want to do a transfer after creation...
    const transferAmount = '1.000 PXCT';
    await new Promise((resolve, reject) => {
      steem.broadcast.transfer(
        INITMINER_WIF,
        creatorName,
        newAccountName,
        transferAmount,
        'Initial deposit',
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
    console.log(`Transferred ${transferAmount} to ${newAccountName}`);

    // Finally, check the new account
    steem.api.getAccounts([newAccountName], (err, result) => {
      if (err) {
        console.error('Error getting account info:', err);
      } else {
        console.log('New account info:', result[0]);
      }
    });

  } catch (error) {
    console.error('Caught error in createAccountAndTransfer:', error);
  }
}

createAccountAndTransfer();
