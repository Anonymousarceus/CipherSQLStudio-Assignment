import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { assignmentService, queryService, hintService } from '../services';

const AssignmentAttemptPage = () => {
  const { id } = useParams();
  const { sessionId, isAuthenticated } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('-- Write your SQL query here\nSELECT ');
  const [executing, setExecuting] = useState(false);

  const [results, setResults] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const [hint, setHint] = useState(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);

  const [activeTable, setActiveTable] = useState(0);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await assignmentService.getById(id);
      setAssignment(response.data.assignment);
      setError(null);
    } catch (err) {
      setError('Failed to load assignment. Please try again.');
      console.error('Error fetching assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = useCallback(async () => {
    if (!query.trim() || executing) return;

    setExecuting(true);
    setQueryError(null);
    setResults(null);

    try {
      const response = await queryService.execute({
        query: query.trim(),
        assignmentId: id,
        sessionId: isAuthenticated ? undefined : sessionId
      });

      if (response.data.querySuccess) {
        setResults({
          rows: response.data.rows,
          columns: response.data.columns,
          rowCount: response.data.rowCount,
          executionTime: response.data.executionTime,
          truncated: response.data.truncated,
          message: response.data.message
        });
      } else {
        setQueryError(response.data.error);
      }
    } catch (err) {
      setQueryError(err.response?.data?.error || 'Failed to execute query');
    } finally {
      setExecuting(false);
    }
  }, [query, id, sessionId, isAuthenticated, executing]);

  const getHint = useCallback(async () => {
    if (hintLoading) return;

    setHintLoading(true);

    try {
      const response = await hintService.generateHint({
        assignmentId: id,
        currentQuery: query.trim() || undefined,
        errorMessage: queryError || undefined,
        hintLevel,
        sessionId: isAuthenticated ? undefined : sessionId
      });

      setHint({
        text: response.data.hint,
        level: response.data.level,
        source: response.data.source
      });
    } catch (err) {
      setHint({
        text: 'Think about which tables and columns you need to answer the question.',
        level: 1,
        source: 'fallback'
      });
    } finally {
      setHintLoading(false);
    }
  }, [id, query, queryError, hintLevel, sessionId, isAuthenticated, hintLoading]);

  const getNextHint = () => {
    if (hintLevel < 3) {
      setHintLevel(hintLevel + 1);
    }
    getHint();
  };

  const closeHint = () => {
    setHint(null);
    setHintLevel(1);
  };

  const clearResults = () => {
    setResults(null);
    setQueryError(null);
  };

  const handleEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      executeQuery();
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 10, bottom: 10 }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading__spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="container">
        <div className="message message--error">
          {error || 'Assignment not found'}
          <Link to="/assignments" className="btn btn--primary btn--sm" style={{ marginLeft: '1rem' }}>
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="attempt">
      <Link to="/assignments" className="attempt__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Assignments
      </Link>

      <div className="attempt__header">
        <div className="attempt__header-left">
          <div className="attempt__title">
            <h1>{assignment.title}</h1>
            <span className={`badge badge--${assignment.difficulty}`}>
              {assignment.difficulty}
            </span>
          </div>
          <div className="attempt__meta">
            <span>{assignment.category}</span>
            <span>{assignment.timeEstimate}</span>
            <span>{assignment.points} points</span>
          </div>
        </div>
      </div>

      <div className="attempt__layout">
        <div className="attempt__sidebar">
          <div className="question-panel">
            <h2 className="question-panel__title">Question</h2>
            <p className="question-panel__content">{assignment.question}</p>
            <div className="question-panel__expected">
              <h3 className="question-panel__expected-title">Expected Output</h3>
              <p className="question-panel__expected-content">{assignment.expectedOutputDescription}</p>
            </div>
          </div>

          <div className="sample-data">
            <h2 className="sample-data__title">Sample Data</h2>
            
            {assignment.tables && assignment.tables.length > 0 && (
              <>
                <div className="sample-data__tabs">
                  {assignment.tables.map((table, index) => (
                    <button
                      key={table.tableName}
                      className={`sample-data__tab ${activeTable === index ? 'sample-data__tab--active' : ''}`}
                      onClick={() => setActiveTable(index)}
                    >
                      {table.tableName}
                    </button>
                  ))}
                </div>

                {assignment.tables[activeTable] && (
                  <>
                    <div className="sample-data__schema">
                      <strong>{assignment.tables[activeTable].tableName}</strong> (
                      {assignment.tables[activeTable].columns.map((col, i) => (
                        <span key={col.name}>
                          {col.name}: {col.type}
                          {i < assignment.tables[activeTable].columns.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      )
                    </div>

                    <div className="sample-data__table-wrapper">
                      <table className="sample-data__table">
                        <thead>
                          <tr>
                            {assignment.tables[activeTable].columns.map((col) => (
                              <th key={col.name}>{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {assignment.tables[activeTable].sampleData?.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {assignment.tables[activeTable].columns.map((col) => (
                                <td key={col.name}>
                                  {row[col.name] !== null && row[col.name] !== undefined 
                                    ? String(row[col.name]) 
                                    : <em style={{ color: '#999' }}>NULL</em>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {hint && (
            <div className="hint-panel">
              <div className="hint-panel__header">
                <h3 className="hint-panel__title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  Hint
                  <span className="hint-panel__level">Level {hint.level}</span>
                </h3>
                <button className="hint-panel__close" onClick={closeHint}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <p className="hint-panel__content">{hint.text}</p>
              {hint.level < 3 && (
                <div className="hint-panel__actions">
                  <button className="hint-panel__next-hint-btn" onClick={getNextHint}>
                    Need more help?
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="attempt__main">
          <div className="sql-editor">
            <div className="sql-editor__header">
              <h2 className="sql-editor__title">SQL Editor</h2>
              <div className="sql-editor__actions">
                <button className="btn btn--ghost btn--sm" onClick={clearResults}>
                  Clear
                </button>
              </div>
            </div>
            
            <div className="sql-editor__editor" onKeyDown={handleEditorKeyDown}>
              <Editor
                height="100%"
                defaultLanguage="sql"
                value={query}
                onChange={(value) => setQuery(value || '')}
                options={editorOptions}
                theme="vs-dark"
              />
            </div>

            <div className="sql-editor__footer">
              <button
                className="sql-editor__execute-btn"
                onClick={executeQuery}
                disabled={executing || !query.trim()}
              >
                {executing ? (
                  <>
                    <div className="loading__spinner" style={{ width: 16, height: 16 }}></div>
                    Executing...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5,3 19,12 5,21"/>
                    </svg>
                    Run Query (Ctrl+Enter)
                  </>
                )}
              </button>
              <button
                className="sql-editor__hint-btn"
                onClick={getHint}
                disabled={hintLoading}
              >
                {hintLoading ? 'Loading...' : 'Get Hint'}
              </button>
            </div>
          </div>

          <div className="results">
            <div className="results__header">
              <h2 className="results__title">Results</h2>
              {results && (
                <span className="results__meta">
                  {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} • {results.executionTime}ms
                </span>
              )}
            </div>

            <div className="results__content">
              {!results && !queryError && (
                <div className="results__empty">
                  Run a query to see results here
                </div>
              )}

              {queryError && (
                <div className="results__error">
                  <strong>Error:</strong> {queryError}
                </div>
              )}

              {results && results.rows.length > 0 && (
                <>
                  <div className="sample-data__table-wrapper">
                    <table className="results__table">
                      <thead>
                        <tr>
                          {results.columns.map((col, i) => (
                            <th key={i}>{col.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {results.columns.map((col, colIndex) => (
                              <td key={colIndex}>
                                {row[col.name] !== null && row[col.name] !== undefined
                                  ? String(row[col.name])
                                  : <em style={{ color: '#999' }}>NULL</em>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {results.message && (
                    <div className="results__message">{results.message}</div>
                  )}
                </>
              )}

              {results && results.rows.length === 0 && (
                <div className="results__empty">
                  Query executed successfully but returned no rows.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentAttemptPage;
