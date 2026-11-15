import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/products';

  useEffect(() => {
    setError('');
  }, [email, password]);

  if (loading) {
    return (
      <div className="page-loading" data-testid="auth-loading">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const result = login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="login-page" data-testid="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1 data-testid="login-title">ShopEase</h1>
          <p data-testid="login-subtitle">Sign in to continue shopping</p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          data-testid="login-form"
          noValidate
        >
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="email-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                data-testid="toggle-password"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="form-error" data-testid="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
            data-testid="login-button"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="demo-hint" data-testid="demo-credentials">
          Demo: testuser@example.com / Test@123
        </p>
      </div>
    </div>
  );
}
