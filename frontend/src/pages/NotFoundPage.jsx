import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="not-found-page" style={{ paddingTop: '68px' }}>
      <div className="container not-found-container">
        <span className="not-found-num" aria-hidden="true">404</span>
        <h1 className="not-found-title">Page not found.</h1>
        <p className="not-found-body">
          The page you're looking for doesn't exist, has moved, or the URL may have been
          typed incorrectly.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn--primary btn--lg">Go to Home</Link>
          <Link to="/programs" className="btn btn--secondary btn--lg">Browse Programs</Link>
        </div>
      </div>
    </main>);

}