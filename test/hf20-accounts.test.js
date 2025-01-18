import Promise from 'bluebird';
import should from 'should';
import pixa from '../src';

const username = process.env.PIXA_USERNAME || 'guest123';
const password = process.env.PIXA_PASSWORD;
const activeWif = pixa.auth.toWif(username, password, 'active');

describe('pixa.hf20-accounts:', () => {
  it('has generated methods', () => {
    should.exist(pixa.broadcast.claimAccount);
    should.exist(pixa.broadcast.createClaimedAccount);
  });

  it('has promise methods', () => {
    should.exist(pixa.broadcast.claimAccountAsync);
    should.exist(pixa.broadcast.createClaimedAccountAsync);
  });


  describe('claimAccount', () => {

/*  Skip these tests. Pixa-js test infrastructure not set up for testing active auths
    Blocked by Pixa issue #3546
    it('signs and verifies auth', function(done) {
      let tx = {
        'operations': [[
          'claim_account', {
            'creator': username,
            'fee': '0.000 PIXA'}]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.22.0') return done();

        pixa.broadcast._prepareTransaction(tx).then(function(tx){
          tx = pixa.auth.signTransaction(tx, [activeWif]);
          pixa.api.verifyAuthorityAsync(tx).then(
            (result) => {result.should.equal(true); done();},
            (err)    => {done(err);}
          );
        });
      });

    });

    it('claims and creates account', function(done) {
      this.skip(); // (!) need test account with enough RC

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.22.0') return done();

        pixa.broadcast.claimAccountAsync(activeWif, username, '0.000 PIXA', []).then((result) => {
            let newAccountName = username + '-' + Math.floor(Math.random() * 10000);
            let keys = pixa.auth.generateKeys(
                username, password, ['posting', 'active', 'owner', 'memo']);

            pixa.broadcast.createClaimedAccountAsync(
                activeWif,
                username,
                newAccountName,
                keys['owner'],
                keys['active'],
                keys['posting'],
                keys['memo'],
                {}, []
              ).then((result) => {
                should.exist(result);
                done();
            }, (err) => {done(err)});
        }, (err) => {done(err)});
      });
    });
*/
  });
});
