import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { fetchJson } from '../lib/api';
import { gymConfig } from '../config/gym';
import './AuthPage.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailId = useId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchJson('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setSuccess(true);
    } catch (err) {
      // Never reveal enumeration. Just show generic error if API entirely fails.
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your {gymConfig.name} password</p>
        </header>

        {error && (
          <div className="auth-api-error" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="auth-success-message" role="status">
            <p>If an account with that email exists, we have sent a password reset link.</p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/login" className="btn btn--secondary">Return to Log In</Link>
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
            <div className="form-field">
              <label htmlFor={emailId} className="form-label">
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                className={`form-input${error ? ' form-input--error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!error}
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <footer className="auth-footer">
          Remembered your password? <Link to="/login">Log in</Link>
        </footer>
      </div>
    </main>
  );
}
