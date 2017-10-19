'use strict';

require('dotenv').config();

//npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

//app modules

//module logic
const TEST_PORT = process.env.TEST_PORT;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const CORS_ORIGINS = process.env.CORS_ORIGINS;

// config and connect to mongoose
mongoose.Promise = Promise;
mongoose.connect(TEST_MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB/Mongoose connection error:'));

//*create app
const app = express();

//* load middleware
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
  origin: CORS_ORIGINS,
}));

//* load routes
app.use(require('../../route/user-router.js'));
app.use(require('../../route/available-router.js'));

//* add 404 routes
app.all('/api/*', (req, res, next) => res.sendStatus(404));

//* require error middleware
app.use(require('../../lib/error-middleware.js'));

//* export start and stop
const server = module.exports = {};
server.isOn = false;

server.start = () => {
  return new Promise((resolve, reject) => {
    if(!server.isOn){
      server.http = app.listen(TEST_PORT, () => {
        server.isOn = true;
        console.log('server up', TEST_PORT);
        resolve();
      });
      return;
    }
    reject(new Error('server is already running'));
  });
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(server.http && server.isOn){
      return server.http.close(() => {
        server.isOn = false;
        console.log('server down');
        resolve();
      });
    }
    reject(new Error('server is not running'));
  });
};
