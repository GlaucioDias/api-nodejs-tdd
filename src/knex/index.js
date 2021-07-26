const environment = process.env.ENVIRONMENT || 'development';

const config = require('../../knexfile')[environment];

const db = require('knex')(config);

module.exports = db;