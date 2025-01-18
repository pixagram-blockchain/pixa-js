const pixa = require('../lib');

/* Generate private active WIF */
const username = process.env.PIXA_USERNAME;
const password = process.env.PIXA_PASSWORD;
const privActiveWif = pixa.auth.toWif(username, password, 'active');

/** Add posting key auth */
pixa.broadcast.addKeyAuth({
    signingKey: privActiveWif,
    username,
    authorizedKey: 'STM88CPfhCmeEzCnvC1Cjc3DNd1DTjkMcmihih8SSxmm4LBqRq5Y9',
    role: 'posting',
  },
  (err, result) => {
    console.log(err, result);
  }
);
