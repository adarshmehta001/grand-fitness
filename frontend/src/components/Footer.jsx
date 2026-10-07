import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Instagram } from 'lucide-react';
import { gymConfig } from '../config/gym';
import './Footer.css';

const footerLinks = [
{ label: 'About', to: '/about' },
{ label: 'Programs', to: '/programs' },
{ label: 'Memberships', to: '/memberships' },
{ label: 'Facilities', to: '/gallery' },
{ label: 'Schedule', to: '/schedule' },
{ label: 'Contact', to: '/contact' }];


export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label={`${gymConfig.name} — home`} style={{ marginBottom: 'var(--space-1)' }}>
              <span>{gymConfig.name.toUpperCase()}</span><span className="footer-logo-dot">.</span>
            </Link>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              A Unit of The Grand Library
            </p>
            <p className="footer-tagline" style={{ marginBottom: 'var(--space-4)' }}>
              Performance training in {gymConfig.location}. Built for those who take their training seriously.
            </p>
            <div className="footer-credits">
              <h3 className="footer-col-heading" style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>Developer Corner</h3>
              <div className="footer-credits-box">
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span>Website built by</span>
                  <a href="https://github.com/adarshmehta001" target="_blank" rel="noopener noreferrer" className="footer-link developer-name" aria-label="Adarsh Kumar's GitHub profile (opens in new tab)" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Github size={14} /> Adarsh Kumar
                  </a>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <a href="https://instagram.com/_the_mehta_" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Adarsh Kumar's Instagram (opens in new tab)" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Instagram size={14} /> Instagram
                  </a>
                  <span style={{ opacity: 0.5 }} className="hide-on-mobile">·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%' }} className="break-on-mobile">
                    Available for web work: 
                    <a href="mailto:ankuraniladarsh@gmail.com" className="footer-link" aria-label="Email Adarsh Kumar for web development enquiries" style={{ textDecoration: 'underline' }}>ankuraniladarsh@gmail.com</a>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <h2 className="sr-only">Footer Information</h2>
          <div className="footer-links-col">
            <h3 className="footer-col-heading">Navigate</h3>
            <ul className="footer-link-list">
              {footerLinks.map((link) =>
              <li key={link.to}>
                  <Link to={link.to} className="footer-link">{link.label}</Link>
                </li>
              )}
            </ul>
          </div>

          <div className="footer-contact-col">
            <h3 className="footer-col-heading">Contact</h3>
            <address className="footer-address">
              <p>{gymConfig.contact.address}</p>
              <p><a href={`tel:${gymConfig.contact.phone}`} className="footer-link">{gymConfig.contact.phone}</a></p>
              <p><a href={`mailto:${gymConfig.contact.email}`} className="footer-link">{gymConfig.contact.email}</a></p>
            </address>
            <div className="footer-hours">
              <p className="footer-hours-label">Opening Hours</p>
              <p>{gymConfig.contact.hours}</p>
            </div>
            <div className="footer-social" style={{ marginTop: 'var(--space-4)' }}>
              <a href={`mailto:${gymConfig.contact.email}`} aria-label={`Email ${gymConfig.name}`} className="social-link">
                <Mail size={18} />
              </a>
              <a href={`tel:${gymConfig.contact.phone}`} aria-label={`Call ${gymConfig.name}`} className="social-link">
                <Phone size={18} />
              </a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gymConfig.contact.address)}`} aria-label="Open address in Google Maps" className="social-link" rel="noopener noreferrer" target="_blank">
                <MapPin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-legal">
            &copy; {new Date().getFullYear()} {gymConfig.name}. All rights reserved.
            <span className="legal-links" style={{ marginLeft: '1rem', display: 'inline-flex', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
              <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link>
              <Link to="/terms-of-service" style={{ color: 'inherit', textDecoration: 'underline' }}>Terms of Service</Link>
              <Link to="/refund-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>Refund Policy</Link>
              <Link to="/return-policy" style={{ color: 'inherit', textDecoration: 'underline' }}>Return Policy</Link>
              <Link to="/disclaimer" style={{ color: 'inherit', textDecoration: 'underline' }}>Disclaimer</Link>
            </span>
          </p>
        </div>
      </div>
    </footer>);

}