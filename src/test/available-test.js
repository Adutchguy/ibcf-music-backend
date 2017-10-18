'use strict';

require('dotenv').config();

const expect = require('expect');
const superagent = require('superagent');

const User = require('../model/user.js');
const server = require('./lib/test-server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const mockAvailable = require('./lib/mock-available.js');

const API_URL = process.env.API_URL;

describe('Testing Available model', () => {
  
});
