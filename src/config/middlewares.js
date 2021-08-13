const express = require('express');
// const knexLogger = require('knex-logger');
const cors = require('cors');

module.exports = (app) => {
  app.use(cors());
  app.use(express.json());
  // app.use(knexLogger(app.db));
};
