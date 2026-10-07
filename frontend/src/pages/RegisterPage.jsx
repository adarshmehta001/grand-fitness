import { useState, useId } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchJson, setToken } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { gymConfig } from '../config/gym';
import './AuthPage.css';







export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim() || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
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
      const data = await fetchJson('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      setToken(data.accessToken);

      const userData = await fetchJson('/me');
      login(data.accessToken, userData);

      const redirect = searchParams.get('redirect') || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <h1>Create an Account</h1>
          <p>Join {gymConfig.name} to manage your memberships</p>
        </header>

        {apiError &&
        <div className="auth-api-error" role="alert">
            {apiError}
          </div>
        }

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Registration form">
          {/* Name */}
          <div className="form-field">
            <label htmlFor={nameId} className="form-label">
              Full name <span aria-hidden="true">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              className={`form-input${errors.name ? ' form-input--error' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-required="true"
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              aria-invalid={!!errors.name}
              disabled={isSubmitting} />
            
            {errors.name &&
            <p id={`${nameId}-error`} className="form-error" role="alert">{errors.name}</p>
            }
          </div>

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
              autoComplete="new-password"
              aria-required="true"
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
              aria-invalid={!!errors.password}
              disabled={isSubmitting} />
            
            {errors.password &&
            <p id={`${passwordId}-error`} className="form-error" role="alert">{errors.password}</p>
            }
          </div>

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account? <Link to={`/login?${searchParams.toString()}`}>Log in</Link>
        </footer>
      </div>
    </main>);

}