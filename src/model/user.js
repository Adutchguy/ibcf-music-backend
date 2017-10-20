'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: val => {
        return isNaN(parseInt(val));
      },
      message: `validation failed`,
    },
  },
  firstName: {
    type: String,
    required: true,
    validate: {
      validator: val => {
        console.log('VAL:\n', isNaN(val));
        return isNaN(parseInt(val));
      },
      message: `validation failed`,
    },
  },
  lastName: {
    type: String,
    required: true,
    validate: {
      validator: val => {
        return isNaN(parseInt(val));
      },
      message: `validation failed`,
    },
  },
  passwordHash: {
    type: String,
    required: true,
  },
  tokenSeed: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: val => {
        return isNaN(parseInt(val));
      },
      message: `validation failed`,
    },
  },
  timeStamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
},{strict: 'throw'});

userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.methods.passwordHashCreate = function(password){
  return bcrypt.hash(password, 8)
    .then(hash => {
      this.passwordHash = hash;
      return this;
    });
};

userSchema.methods.passwordHashCompare = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(isCorrect => {
      if(isCorrect)
        return this;
      throw new Error('unauthorized password does not match');
    });
};

userSchema.methods.tokenSeedCreate = function(){
  return new Promise((resolve, reject) => {
    let tries = 1;

    let _tokenSeedCreate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this))
        .catch(err => {return reject(err);});
    };

    _tokenSeedCreate();
  });
};

userSchema.methods.tokenCreate = function(){
  return this.tokenSeedCreate()
    .then(()=> {
      return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET);
    });
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = function(data){
  let password = data.password;
  delete data.password;
  return new User(data)
    .passwordHashCreate(password)
    .then(user => user.tokenCreate());
};
