const jwt = require('jsonwebtoken');

const config = require('../config');

const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, config.secret);
}

module.exports.signin = function(req, res, next) {
  res.json({
    token: tokenForUser(req.user),
  });
};

module.exports.signup = function(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      error: 'Email and password are required!',
    });
  }

  User.findOne({
    email,
  })
    .then(user => {
      if (user) {
        return res.status(422).json({
          error: 'This email is already in use',
        });
      }

      const newUser = new User({
        email,
        password,
      });

      return newUser.save();
    })
    .then(user => {
      res.json({
        token: tokenForUser(user),
      });
    })
    .catch(err => {
      res.status(400).send(err);
    });
};
