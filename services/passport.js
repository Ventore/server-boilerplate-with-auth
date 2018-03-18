const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const SECRET = require('../config').secret;

const localLogin = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        user
          .comparePasswords(password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false);
            }
            return done(null, user);
          })
          .catch(err => done(err, false));
      })
      .catch(err => done(err, false));
  }
);

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
  },
  (payload, done) => {
    User.findById(payload.sub)
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      })
      .catch(err => done(err, false));
  }
);

passport.use(localLogin);
passport.use(jwtLogin);
