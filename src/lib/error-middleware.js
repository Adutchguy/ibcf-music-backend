'use strict';

module.exports = (err, req, res, next) => {
  err.message = err.message.toLowerCase();
  console.log('Error middleware message:\n', err.message);
  console.log('Error middleware res.body:\n', res.body);

  // 400 errors
  if(err.message.includes('validation failed'))
    return(res.sendStatus(400));

  if(err.message.includes('arguments required'))
    return(res.sendStatus(400));

  if(err.message.includes('no data'))
    return(res.sendStatus(400));

  if(err.message.includes('not in schema and strict mode is set to throw'))
    return(res.sendStatus(400));

  // 401 errors
  if(err.message.includes('unauthorized'))
    return(res.sendStatus(401));

  if(err.message.includes('invalid signature'))
    return(res.sendStatus(401));

  // 409 errors
  if(err.message.includes('duplicate key'))
    return(res.sendStatus(409));

  return(res.sendStatus(500));
};
