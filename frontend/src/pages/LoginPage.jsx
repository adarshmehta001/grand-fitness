import { useState, useId } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchJson, setToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { gymConfig } from '../config/gym';
import './AuthPage.css';






export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailId = useId();
  const passwordId = useId();

  const validate = () => {
    const newErrors = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      newErrors.password = 'Please enter your password.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = await fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Fetch user data
      setToken(data.accessToken);

      const userData = await fetchJson('/me');
      login(data.accessToken, userData);

      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <h1>Welcome Back</h1>
          <p>Log in to manage your {gymConfig.name} account</p>
        </header>

        {apiError &&
        <div className="auth-api-error" role="alert">
            {apiError}
          </div>
        }

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Login form">
          {/* Email */}
          <div className="form-field">
            <label htmlFor={emailId} className="form-label">
              Email address <span aria-hidden="true">*</span>
            </label>
            <input
              id={emailId}
              type="email"
              className={`form-input${errors.email ? ' form-input--error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-required="true"
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              aria-invalid={!!errors.email}
              disabled={isSubmitting} />
            
            {errors.email &&
            <p id={`${emailId}-error`} className="form-error" role="alert">{errors.email}</p>
            }
          </div>

          {/* Password */}
          <div className="form-field">
            <label htmlFor={passwordId} className="form-label">
              Password <span aria-hidden="true">*</span>
            </label>
            <input
              id={passwordId}
              type="password"
              className={`form-input${errors.password ? ' form-input--error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-required="true"
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
              aria-invalid={!!errors.password}
              disabled={isSubmitting} />
            
            {errors.password &&
            <p id={`${passwordId}-error`} className="form-error" role="alert">{errors.password}</p>
            }
          </div>

          <div style={{ textAlign: 'right', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            <Link to={`/forgot-password?${searchParams.toString()}`} style={{ fontSize: '0.875rem' }}>Forgot your password?</Link>
          </div>

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account? <Link to={`/register?${searchParams.toString()}`}>Sign up</Link>
        </footer>
      </div>
    </main>);

}