const { getPool } = require('../config/postgres');

const FORBIDDEN_PATTERNS = [
  /\bDROP\b/i,
  /\bDELETE\b/i,
  /\bTRUNCATE\b/i,
  /\bALTER\b/i,
  /\bCREATE\b/i,
  /\bINSERT\b/i,
  /\bUPDATE\b/i,
  /\bGRANT\b/i,
  /\bREVOKE\b/i,
  /\bEXECUTE\b/i,
  /\bCOPY\b/i,
  /--/,
  /\/\*/,
  /;\s*\w/,
];

const validateQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return { valid: false, error: 'Query is required and must be a string' };
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  if (trimmedQuery.length > 10000) {
    return { valid: false, error: 'Query exceeds maximum length of 10000 characters' };
  }

  // Check for forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(trimmedQuery)) {
      return { 
        valid: false, 
        error: 'Query contains forbidden operations. Only SELECT queries are allowed.' 
      };
    }
  }

  // Must start with SELECT (case insensitive)
  if (!trimmedQuery.toUpperCase().startsWith('SELECT')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }

  return { valid: true, query: trimmedQuery };
};

const executeQuery = async (query, options = {}) => {
  const {
    timeout = parseInt(process.env.QUERY_TIMEOUT_MS) || 5000,
    maxRows = parseInt(process.env.MAX_ROWS_RETURNED) || 1000
  } = options;

  const validation = validateQuery(query);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      rows: [],
      columns: [],
      executionTime: 0,
      rowCount: 0
    };
  }

  const pool = getPool();
  const client = await pool.connect();
  const startTime = Date.now();

  try {
    // Set statement timeout
    await client.query(`SET statement_timeout = ${timeout}`);

    // Add LIMIT if not present to prevent huge result sets
    let limitedQuery = validation.query;
    if (!limitedQuery.toUpperCase().includes('LIMIT')) {
      // Remove trailing semicolon if present, add LIMIT
      limitedQuery = limitedQuery.replace(/;?\s*$/, '') + ` LIMIT ${maxRows + 1}`;
    }

    const result = await client.query(limitedQuery);
    const executionTime = Date.now() - startTime;

    // Check if results were truncated
    const wasTruncated = result.rows.length > maxRows;
    const rows = wasTruncated ? result.rows.slice(0, maxRows) : result.rows;

    // Extract column information
    const columns = result.fields.map(field => ({
      name: field.name,
      type: field.dataTypeID
    }));

    return {
      success: true,
      rows,
      columns,
      executionTime,
      rowCount: rows.length,
      totalCount: wasTruncated ? `${maxRows}+` : rows.length,
      truncated: wasTruncated,
      message: wasTruncated 
        ? `Results limited to ${maxRows} rows. Your query returned more results.`
        : null
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    // Handle specific PostgreSQL errors
    let errorMessage = error.message;
    
    if (error.code === '57014') {
      errorMessage = `Query timeout: Execution exceeded ${timeout}ms limit.`;
    } else if (error.code === '42P01') {
      errorMessage = `Table not found: ${error.message}`;
    } else if (error.code === '42703') {
      errorMessage = `Column not found: ${error.message}`;
    } else if (error.code && error.code.startsWith('42')) {
      errorMessage = `SQL Syntax Error: ${error.message}`;
    }

    return {
      success: false,
      error: errorMessage,
      rows: [],
      columns: [],
      executionTime,
      rowCount: 0
    };
  } finally {
    client.release();
  }
};

const getTableInfo = async (tableName, sampleSize = 5) => {
  const pool = getPool();
  
  try {
    // Get column information
    const schemaQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `;
    const schemaResult = await pool.query(schemaQuery, [tableName]);

    // Get sample data
    const sampleQuery = `SELECT * FROM ${tableName} LIMIT $1`;
    const sampleResult = await pool.query(sampleQuery, [sampleSize]);

    return {
      success: true,
      tableName,
      columns: schemaResult.rows,
      sampleData: sampleResult.rows,
      rowCount: sampleResult.rows.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  validateQuery,
  executeQuery,
  getTableInfo
};
