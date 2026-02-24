const { Pool } = require('pg');

let pool = null;

const connectPostgres = async () => {
  try {
    pool = new Pool({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    // Test the connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log(`PostgreSQL Connected: ${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`);
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });

    return pool;
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('PostgreSQL pool not initialized. Call connectPostgres first.');
  }
  return pool;
};

const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

module.exports = connectPostgres;
module.exports.getPool = getPool;
module.exports.query = query;
