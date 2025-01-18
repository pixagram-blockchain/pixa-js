import assert from 'assert'
import Promise from 'bluebird';
import should from 'should';
import pixa from '../src';

const username = process.env.PIXA_USERNAME || 'guest123';
const password = process.env.PIXA_PASSWORD;
const activeWif = pixa.auth.toWif(username, password, 'active');

describe('pixa.smt:', () => {

  describe('smt creation ops', () => {
    it('signs and verifies smt_create', function(done) {
      let url = pixa.config.get('uri');
      pixa.api.setOptions({ url: url, useAppbaseApi: true });

      let tx = {
        'operations': [[
          'smt_create', {
            'control_account': username,
            'symbol': {'nai':'@@631672482','precision':3},
            'smt_creation_fee': {'amount':'10000','precision':3,'nai':'@@000000013'},
            'precision': 3,
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_setup', function(done) {
      let tx = {
        'operations': [[
          'smt_setup', {
            'control_account' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'max_supply' : '1000000000000000',
            'contribution_begin_time' : '2020-12-21T00:00:00',
            'contribution_end_time' : '2021-12-21T00:00:00',
            'launch_time' : '2021-12-22T00:00:00',
            'pixa_units_min' : 0,
            'min_unit_ratio' : 50,
            'max_unit_ratio' : 100,
            'extensions':[]
          }
        ]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_setup_ico_tier', function(done) {
      let tx = {
        'operations': [[
          'smt_setup_ico_tier', {
            'control_account' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'pixa_units_cap' : 10000,
            'generation_policy' : [
              0,
              {
                'generation_unit' : {
                  'pixa_unit' : [
                    ['$!alice.vesting',2],
                    ['$market_maker',2],
                    ['alice',2]
                  ],
                  'token_unit' : [
                    ['$!alice.vesting',2],
                    ['$from',2],
                    ['$from.vesting',2],
                    ['$market_maker',2],
                    ['$rewards',2],
                    ['alice',2]
                  ]
                },
                'extensions':[]
              }
            ],
            'remove' : false,
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_setup_emissions', function(done) {
      let tx = {
        'operations': [[
          'smt_setup_emissions', {
            'control_account' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'schedule_time' : '2019-10-16T19:47:05',
            'emissions_unit' : {
              'token_unit' : [
                ['$market_maker',1],
                ['$rewards',1],
                ['$vesting',1]
              ]
            },
            'interval_seconds' : 21600,
            'emission_count' : 1,
            'lep_time' : '1970-01-01T00:00:00',
            'rep_time' : '1970-01-01T00:00:00',
            'lep_abs_amount' : 0,
            'rep_abs_amount': 0,
            'lep_rel_amount_numerator' : 1,
            'rep_rel_amount_numerator' : 0,
            'rel_amount_denom_bits' : 0,
            'remove' : false,
            'floor_emissions' : false,
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_set_setup_parameters', function(done) {
      let tx = {
        'operations': [[
          'smt_set_setup_parameters', {
            'control_account' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'setup_parameters' : [[
              0, {
                'value':false
            }]],
          'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_set_runtime_parameters', function(done) {
      let tx = {
        'operations': [[
          'smt_set_runtime_parameters', {
            'control_account' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'runtime_parameters' : [[
              1, {
                'vote_regeneration_period_seconds' : 604800,
                'votes_per_regeneration_period' : 6999
            }]],
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies smt_contribute', function(done) {
      let tx = {
        'operations': [[
          'smt_contribute', {
            'contributor' : username,
            'symbol' : {'nai':'@@631672482','precision':3},
            'contribution_id' : 1,
            'contribution': {'amount':'1000','precision':3,'nai':'@@000000013'},
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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
  });

  describe('smt extended ops', () => {
    let permlink = 'test';

    it('signs and verifies claim_rewards_balance2', function(done) {
      let tx = {
        'operations': [[
          'claim_reward_balance2', {
            'account' : username,
            'reward_tokens' : [
              {'amount':'1000','precision':3,'nai':'@@000000013'},
              {'amount':'1000','precision':3,'nai':'@@000000021'},
              {'amount':'1000000','precision':6,'nai':'@@000000037'},
              {'amount':'1','precision':1,'nai':'@@631672482'},
              {'amount':'1','precision':0,'nai':'@@642246725'},
              {'amount':'1','precision':1,'nai':'@@678264426'}
            ],
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies comment_options', function(done) {
      let tx = {
        'operations': [[
          'comment_options', {
            'author' : username,
            'permlink' : permlink,
            'max_accepted_payout' : '1000000.000 TESTS',
            'percent_pixa_burgers' : 10000,
            'allow_votes' : true,
            'allow_curation_rewards' : true,
            'extensions' : [[
              1, {
                'votable_assets':[[
                  {'nai':'@@631672482','precision':3}, {
                    'max_accepted_payout' : 10,
                    'allow_curation_rewards' : true,
                    'beneficiaries' : {
                      'beneficiaries' : [
                        { 'account' : 'alice', 'weight' : 100 },
                        { 'account': 'bob' , 'weight' : 100 }
        ]}}]]}]]}]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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

    it('signs and verifies vote2', function(done) {
      let tx = {
        'operations': [[
          'vote2', {
            'voter' : username,
            'author' : username,
            'permlink' : permlink,
            'rshares': [
              [{'nai':'@@631672482','precision':3},2000000000],
              [{'nai':'@@000000013','precision':3},81502331182]
            ],
            'extensions':[]
        }]]
      }

      pixa.api.callAsync('condenser_api.get_version', []).then((result) => {
        if(result['blockchain_version'] < '0.24.0') return done(); /* SKIP AS THIS WILL ONLY PASS ON A TESTNET CURRENTLY */
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
  });
});
