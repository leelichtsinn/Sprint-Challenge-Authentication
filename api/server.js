const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');

const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(logger('dev'));
server.use(cors());
server.use(express.json());

configureRoutes(server);

module.exports = {
  server,
};
