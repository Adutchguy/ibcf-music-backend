'use strict';

require('dotenv').config();
const CryptoJS = require('crypto-js');
const User = require('../model/user.js');

const passwordUnHash = function(hash){
  let bytes = CryptoJS.AES.decrypt(hash, process.env.APP_SECRET);
  let password = bytes.toString(CryptoJS.enc.Utf8);
  return password;
};


module.exports = (req, res, next) => {
  const {authorization} = req.headers;

  if(!authorization)
    return next(new Error('Unauthorized, no authorization provided'));

  let encoded = authorization.split('Basic')[1];
  console.log(encoded);
  if(!encoded)
    return next(new Error('Unauthorized, no basic authorization provided'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');
  password = passwordUnHash(password);

  if(!username || !password)
    return next(new Error('Unauthorized, username or password is missing, please try again'));

  User.findOne({username})
    .then(user => {
      if(!user)
        return next(new Error('Unauthorized, user does not exist'));
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};
