import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, error, clearError, loading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.username || !formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    if (formData.username.length < 3) {
      setFormError('Username must be at least 3 characters');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      navigate('/assignments');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create Account</h1>

        {(formError || error) && (
          <div className="message message--error">
            {formError || error}
          </div>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-group__label" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-group__input"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

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
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-group__input"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className="auth__submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth__link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
