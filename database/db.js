async function connect() {
  if (global.connection) {
    return global.connection.connect();
  }

  const { Pool } = require('pg');

  const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  });

  global.connection = pool;

  return pool.connect();
}

async function databaseTransaction(sql, args = []) {
  const client = await connect();

  try {
    const res = await client.query(sql, args);

    return res.rows;
  } catch (error) {
    console.error('Database query error:', error);

    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  databaseTransaction,
};
