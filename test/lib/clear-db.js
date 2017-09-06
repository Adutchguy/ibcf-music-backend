'use strict';

const User = require('../../model/user.js');
const Available = require('../../model/available.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Available.remove({}),
  ]);
};
