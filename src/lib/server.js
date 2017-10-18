'use strict';

require('dotenv').config();

//npm modules
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');

//app modules
const db = require('./db.js');

//module logic
const MONGODB_URI = process.env.MONGODB_URI;

// config and connect to mongoose
db.start(MONGODB_URI);

//*create app
const app = express();

//* load middleware
app.use(morgan('dev'));
app.use(cors({
  credentials: true,
  origin: process.env.CORS_ORIGINS,
}));

//* load routes
app.use(require('../route/user-router.js'));
app.use(require('../route/available-router.js'));

//* add 404 routes
app.all('/api/*', (req, res, next) => res.sendStatus(404));

//* require error middleware
app.use(require('./error-middleware.js'));

//* export start and stop
const server = module.exports = {};
server.isOn = false;

server.start = () => {
  return new Promise((resolve, reject) => {
    if(!server.isOn){
      server.http = app.listen(process.env.PORT, () => {
        server.isOn = true;
        console.log('server up', process.env.PORT);
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
