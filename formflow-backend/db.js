const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or use user, host, database, password, port
});

module.exports = pool;