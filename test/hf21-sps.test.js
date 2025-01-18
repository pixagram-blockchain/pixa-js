import assert from "assert"
import Promise from 'bluebird';
import should from 'should';
import pixa from '../src';

const username = process.env.PIXA_USERNAME || 'guest123';
const password = process.env.PIXA_PASSWORD;
const activeWif = pixa.auth.toWif(username, password, 'active');

describe('pixa.hf21-accounts:', () => {
  it('has generated methods', () => {
    should.exist(pixa.broadcast.createProposal);
    should.exist(pixa.broadcast.updateProposalVotes);
    should.exist(pixa.broadcast.removeProposal);
  });

  it('has promise methods', () => {
    should.exist(pixa.broadcast.createProposalAsync);
    should.exist(pixa.broadcast.updateProposalVotesAsync);
    should.exist(pixa.broadcast.removeProposalAsync);
  });

  describe('create proposal ops', () => {
/*  Skip these tests. Pixa-js test infrastructure not set up for testing active auths
    Blocked by Pixa issue #3546
    it('signs and verifies create_proposal', function(done) {
      let permlink = 'test';

      let tx = {
        'operations': [[
          'create_proposal', {
            'creator': username,
            'receiver': username,
            'start_date': '2019-09-01T00:00:00',
            'end_date': '2019-10-01T00:00:00',
            'daily_pay': '1.000 PXS',
            'subject': 'testing',
            'permlink': permlink
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.22.0') return done();
        result.should.have.property('blockchain_version');

        pixa.broadcast._prepareTransaction(tx).then(function(tx){
          tx = pixa.auth.signTransaction(tx, [activeWif]);
          pixa.api.verifyAuthorityAsync(tx).then(
            (result) => {result.should.equal(true); done();},
            (err)    => {done(err);}
          );
        });
      });
    })

    it('signs and verifies update_proposal_votes', function(done) {
      let tx = {
        'operations': [[
          'update_proposal_votes', {
            'voter': username,
            'proposal_ids': [7],
            'approve': true
        }]]
      }

      return done();

      pixa.broadcast._prepareTransaction(tx).then(function(tx){
        tx = pixa.auth.signTransaction(tx, [activeWif]);
        pixa.api.verifyAuthorityAsync(tx).then(
          (result) => {result.should.equal(true); done();},
          (err)    => {done(err);}
        );
      });
    })
*/
  });
});
