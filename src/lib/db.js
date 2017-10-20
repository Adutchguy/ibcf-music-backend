'use strict';

// DEPENDENCIES
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = Promise;

// STATE
const state = { isOn: false };

// Module Config

// INTERFACE
module.exports = {

  start: function(URI){
    console.log('__DB_UP__', URI);
    if(state.isOn)
      return Promise.reject(new Error('USER ERROR: db is connected'));
    state.isOn = true;
    return mongoose.createConnection(URI, {useMongoClient: true});
  },

  stop: function() {
    console.log('__DB_DOWN__');
    if(!state.isOn)
      return Promise.reject(new Error('USER ERROR: db is disconnected'));
    state.isOn = false;
    return mongoose.disconnect();
  },
};
