import { useState, useId } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { fetchJson } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { gymConfig } from '../config/gym';
import './AuthPage.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { logout } = useAuth(); // Call logout explicitly to clear current local session

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordId = useId();
  const confirmPasswordId = useId();

  const validate = () => {
    const newErrors = {};
    if (!password.trim() || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!token) {
      setApiError('Invalid or missing password reset token.');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await fetchJson('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password })
      });
      
      // Clear out any existing local session if we reset successfully
      logout();
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || 'Password reset failed. The token may be expired or invalid.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-container">
          <header className="auth-header">
            <h1>Password Reset Successful</h1>
          </header>
          <div className="auth-success-message" style={{ textAlign: 'center' }}>
            <p>Your password has been changed successfully.</p>
            <p style={{ marginTop: '1.5rem' }}>
              <Link to="/login" className="btn btn--primary">Proceed to Log In</Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <h1>Reset Password</h1>
          <p>Create a new password for your {gymConfig.name} account</p>
        </header>

        {apiError && (
          <div className="auth-api-error" role="alert">
            {apiError}
          </div>
        )}
        
        {!token && !apiError && (
          <div className="auth-api-error" role="alert">
            Missing reset token. Please use the link sent to your email.
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Reset password form">
          <div className="form-field">
            <label htmlFor={passwordId} className="form-label">
              New Password <span aria-hidden="true">*</span>
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
              disabled={isSubmitting || !token}
            />
            {errors.password && (
              <p id={`${passwordId}-error`} className="form-error" role="alert">{errors.password}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor={confirmPasswordId} className="form-label">
              Confirm New Password <span aria-hidden="true">*</span>
            </label>
            <input
              id={confirmPasswordId}
              type="password"
              className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              aria-required="true"
              aria-describedby={errors.confirmPassword ? `${confirmPasswordId}-error` : undefined}
              aria-invalid={!!errors.confirmPassword}
              disabled={isSubmitting || !token}
            />
            {errors.confirmPassword && (
              <p id={`${confirmPasswordId}-error`} className="form-error" role="alert">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--lg auth-submit" disabled={isSubmitting || !token}>
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </main>
  );
}
