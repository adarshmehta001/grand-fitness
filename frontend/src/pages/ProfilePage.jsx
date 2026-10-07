import { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchJson } from '../lib/api';
import ProgramCard from '../components/ProgramCard';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const nameId = useId();
  const phoneId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/profile', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJson('/me/favorites').then(setFavorites).catch(console.error);
      fetchJson('/me/enquiries').then(setEnquiries).catch(console.error);
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const validateProfile = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    if (!validateProfile()) return;
    
    setIsUpdatingProfile(true);
    try {
      await fetchJson('/me', {
        method: 'PATCH',
        body: JSON.stringify({ name, phone })
      });
      setProfileSuccess('Profile updated successfully');
    } catch (err) {
      setProfileErrors({ form: err.message || 'Failed to update profile' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!currentPassword) errors.currentPassword = 'Required';
    if (!newPassword || newPassword.length < 8) errors.newPassword = 'Must be at least 8 characters';
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    if (!validatePassword()) return;
    
    setIsUpdatingPassword(true);
    try {
      await fetchJson('/me/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      setPasswordSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordErrors({ form: err.message || 'Failed to change password' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const removeFavorite = async (id) => {
    try {
      await fetchJson(`/me/favorites/${id}`, { method: 'DELETE' });
      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="profile-page" style={{ paddingTop: '68px' }}>
      <div className="profile-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">Your Account</p>
          <h1>Profile</h1>
        </div>
      </div>
      
      <div className="profile-content section-pad">
        <div className="container profile-grid">
          
          <section className="profile-panel">
            <h2>Account Details</h2>
            <div className="profile-form-wrap">
              <form onSubmit={handleProfileUpdate} noValidate aria-label="Update profile">
                {profileSuccess && <div className="form-success" role="status">{profileSuccess}</div>}
                {profileErrors.form && <div className="form-error" role="alert">{profileErrors.form}</div>}
                
                <div className="form-field">
                  <label className="form-label">Email address (read-only)</label>
                  <input type="email" className="form-input" value={user?.email || ''} readOnly disabled />
                </div>
                
                <div className="form-field">
                  <label htmlFor={nameId} className="form-label">Name <span aria-hidden="true">*</span></label>
                  <input id={nameId} type="text" className={`form-input${profileErrors.name ? ' form-input--error' : ''}`} value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!profileErrors.name} />
                  {profileErrors.name && <p className="form-error" role="alert">{profileErrors.name}</p>}
                </div>
                
                <div className="form-field">
                  <label htmlFor={phoneId} className="form-label">Phone</label>
                  <input id={phoneId} type="tel" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                
                <button type="submit" className="btn btn--primary" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
            
            <div className="profile-form-wrap">
              <h3>Change Password</h3>
              <form onSubmit={handlePasswordUpdate} noValidate aria-label="Change password">
                {passwordSuccess && <div className="form-success" role="status">{passwordSuccess}</div>}
                {passwordErrors.form && <div className="form-error" role="alert">{passwordErrors.form}</div>}
                
                <div className="form-field">
                  <label htmlFor={currentPasswordId} className="form-label">Current Password <span aria-hidden="true">*</span></label>
                  <input id={currentPasswordId} type="password" className={`form-input${passwordErrors.currentPassword ? ' form-input--error' : ''}`} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} aria-invalid={!!passwordErrors.currentPassword} />
                  {passwordErrors.currentPassword && <p className="form-error" role="alert">{passwordErrors.currentPassword}</p>}
                </div>
                
                <div className="form-field">
                  <label htmlFor={newPasswordId} className="form-label">New Password <span aria-hidden="true">*</span></label>
                  <input id={newPasswordId} type="password" className={`form-input${passwordErrors.newPassword ? ' form-input--error' : ''}`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} aria-invalid={!!passwordErrors.newPassword} />
                  {passwordErrors.newPassword && <p className="form-error" role="alert">{passwordErrors.newPassword}</p>}
                </div>
                
                <div className="form-field">
                  <label htmlFor={confirmPasswordId} className="form-label">Confirm New Password <span aria-hidden="true">*</span></label>
                  <input id={confirmPasswordId} type="password" className={`form-input${passwordErrors.confirmPassword ? ' form-input--error' : ''}`} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} aria-invalid={!!passwordErrors.confirmPassword} />
                  {passwordErrors.confirmPassword && <p className="form-error" role="alert">{passwordErrors.confirmPassword}</p>}
                </div>
                
                <button type="submit" className="btn btn--secondary" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </section>

          <section className="profile-panel">
            <h2>Saved Favorites</h2>
            {favorites.length === 0 ? (
              <div className="empty-state" role="status">
                <p>You haven't saved any programs or classes yet — browse Programs or Schedule to add some.</p>
              </div>
            ) : (
              <div className="favorites-list">
                {favorites.map(fav => (
                  <div key={fav.id} className="favorite-item">
                    {fav.itemType === 'program' && fav.program && (
                      <div className="fav-wrapper">
                        <ProgramCard program={fav.program} />
                        <button className="remove-fav-btn" onClick={() => removeFavorite(fav.id)} aria-label="Remove from saved programs">Remove</button>
                      </div>
                    )}
                    {fav.itemType === 'class' && fav.class && (
                      <div className="fav-wrapper fav-class-card">
                        <h3>{fav.class.title}</h3>
                        <p>{fav.class.day} at {fav.class.startTime}</p>
                        <button className="remove-fav-btn btn btn--secondary btn--sm" onClick={() => removeFavorite(fav.id)} aria-label="Remove from saved classes">Remove</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <section className="profile-panel">
            <h2>Enquiry History</h2>
            {enquiries.length === 0 ? (
              <div className="empty-state" role="status">
                <p>You have no past enquiries.</p>
              </div>
            ) : (
              <ul className="enquiries-list">
                {enquiries.map(enq => (
                  <li key={enq.id} className="enquiry-card">
                    <div className="enquiry-header">
                      <span className="enquiry-date">{new Date(enq.createdAt).toLocaleDateString()}</span>
                      <span className="enquiry-type">{enq.interestType}</span>
                    </div>
                    <p className="enquiry-message">{enq.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </main>
  );
}
