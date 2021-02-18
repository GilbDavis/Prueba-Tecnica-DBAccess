const Pool = require('pg').Pool;
const config = require('./config');

const pool = new Pool({
  user: config.database.userName,
  host: config.database.host,
  database: config.database.database,
  password: config.database.password,
  port: config.database.port
});

module.exports = pool;