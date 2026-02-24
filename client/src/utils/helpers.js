export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(2);
  return `${seconds}s`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateSessionId = () => {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#28a745',
    medium: '#ffc107',
    hard: '#dc3545'
  };
  return colors[difficulty] || colors.easy;
};

export const isValidSQLQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  const trimmed = query.trim().toUpperCase();
  return trimmed.startsWith('SELECT');
};

export const extractTableNames = (query) => {
  if (!query) return [];
  
  const fromMatch = query.match(/FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi);
  const joinMatch = query.match(/JOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi);
  
  const tables = new Set();
  
  if (fromMatch) {
    fromMatch.forEach(match => {
      const tableName = match.replace(/FROM\s+/i, '').trim();
      tables.add(tableName.toLowerCase());
    });
  }
  
  if (joinMatch) {
    joinMatch.forEach(match => {
      const tableName = match.replace(/JOIN\s+/i, '').trim();
      tables.add(tableName.toLowerCase());
    });
  }
  
  return Array.from(tables);
};
