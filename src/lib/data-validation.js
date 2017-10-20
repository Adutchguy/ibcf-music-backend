'use strict';

module.exports = (err, req, res, next) => {

  if(req.body.username)
    if(typeof(req.body.username) !== 'string')
      return next(new Error('validation failed, username must be of type String'));

  if(req.body.firstName)
    if(typeof(req.body.firstName) !== 'string')
      return next(new Error('validation failed, firstName must be of type String'));

  if(req.body.lastName)
    if(typeof(req.body.lastName) !== 'string')
      return next(new Error('validation failed, lastName must be of type String'));

  if(req.body.email)
    if(typeof(req.body.email) !== 'string')
      return next(new Error('validation failed, email must be of type String'));
  return next();
};
