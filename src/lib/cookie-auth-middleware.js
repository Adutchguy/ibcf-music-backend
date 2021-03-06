'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const universalify = require('universalify');

module.exports = (req, res, next) => {
  // console.log(req);
  // if any of the following fail, we will next an unauthorized Error

  let {cookie} = req.headers;
  if(!cookie)
    return next(new Error('unauthorized not logged in, no cookie found'));

  // check for a cookie tokenseed
  let token = cookie.split('=')[1];
  if(!token)
    return next(new Error('unauthorized no token found'));

  // decrypt the token
  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)
  // find the user by the tokenSeed
    .then(decoded => {
      return User.findOne({tokenSeed: decoded.tokenSeed});
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};
