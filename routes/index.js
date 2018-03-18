const express = require('express');
const passport = require('passport');

const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  res.json({ hi: 'there' });
});
router.post('/signup', Authentication.signup);
router.post('/signin', requireSignin, Authentication.signin);

module.exports = router;
