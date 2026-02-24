import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error, clearError, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    const result = await login(formData);
    
    if (result.success) {
      navigate('/assignments');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome Back</h1>

        {(formError || error) && (
          <div className="message message--error">
            {formError || error}
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-group__input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-group__input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth__submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth__footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth__link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
