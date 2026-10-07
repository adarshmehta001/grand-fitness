import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gymConfig } from '../config/gym';
import './Header.css';

const navLinks = [
{ to: '/', label: 'Home' },
{ to: '/about', label: 'About' },
{ to: '/programs', label: 'Programs' },
{ to: '/memberships', label: 'Memberships' },
{ to: '/gallery', label: 'Facilities' },
{ to: '/feedback', label: 'Reviews' },
{ to: '/schedule', label: 'Schedule' },
{ to: '/contact', label: 'Enquire' }];


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isTabHidden, setIsTabHidden] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`} role="banner">
      <div className="header-inner">
        <Link to="/" className="header-logo" aria-label={`${gymConfig.name} — home`} style={{ gap: '0.5rem' }}>
          <img src="/logo.png" alt="The Grand Fitness Logo" width="32" height="32" style={{ objectFit: 'contain' }} />
          <span className="logo-text">{gymConfig.name.toUpperCase()}</span>
          <span className="logo-dot" aria-hidden="true">.</span>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          <ul className="nav-list">
            {navLinks.map((link) =>
            <li key={link.to}>
                <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>
                
                  {link.label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="nav-link"
            aria-label="Toggle theme"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {isAuthenticated ?
            <>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button className="nav-link" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Logout
              </button>
            </> :
          <Link to="/login" className="nav-link">
              Log In
            </Link>
          }
          <Link to="/contact" className="header-cta">
            Get Started
          </Link>
        </div>

        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((v) => !v)}>
          
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Ticker Bar */}
      <div className="gym-ticker" aria-hidden="true" inert="true">
        <div className={`gym-ticker-track${isTabHidden ? ' paused' : ''}`}>
          {[...Array(8)].map((_, i) => (
            <span key={i} className="gym-ticker-content">
              {gymConfig.name.toUpperCase()} — OPEN {gymConfig.contact.hours} —&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        className={`mobile-nav${menuOpen ? ' mobile-nav--open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        aria-hidden={!menuOpen}
        data-lenis-prevent="true">
        
        <nav aria-label="Mobile navigation links">
          <ul className="mobile-nav-list">
            {navLinks.map((link) =>
            <li key={link.to}>
                <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `mobile-nav-link${isActive ? ' mobile-nav-link--active' : ''}`}
                tabIndex={menuOpen ? 0 : -1}>
                
                  {link.label}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
          <button 
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className="mobile-nav-link"
            tabIndex={menuOpen ? 0 : -1}
            style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {theme === 'dark' ? <><Sun size={20} /> Light Mode</> : <><Moon size={20} /> Dark Mode</>}
          </button>
          {isAuthenticated ?
            <>
              <Link to="/profile" className="mobile-nav-link" tabIndex={menuOpen ? 0 : -1}>Profile</Link>
              <button className="mobile-nav-link" onClick={handleLogout} tabIndex={menuOpen ? 0 : -1} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Logout
              </button>
            </> :
          <Link to="/login" className="mobile-nav-link" tabIndex={menuOpen ? 0 : -1}>
              Log In
            </Link>
          }
          <Link to="/contact" className="mobile-cta" tabIndex={menuOpen ? 0 : -1}>
            Get Started
          </Link>
        </div>
      </div>

      {menuOpen &&
      <div
        className="nav-overlay"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true" />

      }
    </header>);

}