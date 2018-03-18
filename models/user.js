const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: {
      validator(input) {
        const emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegEx.test(input);
      },
      message: '{VALUE} is not a valid email!',
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.comparePasswords = function(submittedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt
      .compare(submittedPassword, this.password)
      .then(isMatch => {
        return resolve(isMatch);
      })
      .catch(err => reject(err, false));
  });
};

userSchema.pre('save', function(next) {
  bcrypt
    .hash(this.password, 10)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => {
      next(err);
    });
});

const User = mongoose.model('user', userSchema);

module.exports = User;
