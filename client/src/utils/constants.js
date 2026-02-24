export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Application name
export const APP_NAME = process.env.REACT_APP_APP_NAME || 'CipherSQLStudio';

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

export const CATEGORIES = {
  SELECT: 'SELECT',
  JOIN: 'JOIN',
  AGGREGATE: 'AGGREGATE',
  SUBQUERY: 'SUBQUERY',
  DML: 'DML',
  MIXED: 'MIXED'
};

export const QUERY_LIMITS = {
  MAX_LENGTH: 10000,
  TIMEOUT_MS: 5000,
  MAX_ROWS: 1000
};

export const BREAKPOINTS = {
  xs: 320,
  sm: 641,
  md: 1024,
  lg: 1281
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  SESSION_ID: 'sessionId',
  THEME: 'theme'
};

export const EDITOR_THEMES = {
  LIGHT: 'vs',
  DARK: 'vs-dark',
  HIGH_CONTRAST: 'hc-black'
};

export const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'LIMIT', 'OFFSET', 'AS', 'DISTINCT', 'ALL',
  'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'UNION', 'INTERSECT', 'EXCEPT',
  'EXISTS', 'ANY', 'SOME'
];

export const FORBIDDEN_OPERATIONS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE',
  'INSERT', 'UPDATE', 'GRANT', 'REVOKE', 'EXECUTE'
];
