import React from 'react';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="display-headline">Welcome Back, Alex</h1>
        <div className="membership-badge">
          <span className="label-sm">Status</span>
          <span className="badge-text">ELITE TIER</span>
        </div>
      </header>

      <section className="dashboard-grid">
        {/* Gym Statistics */}
        <div className="dashboard-panel metrics-panel">
          <h2 className="panel-title label-sm">Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="label-sm text-muted">Sessions This Week</span>
              <div className="metric-value">
                <span className="metric-display">4</span>
                <span className="label-md text-lime">/ 5</span>
              </div>
            </div>
            <div className="metric-card">
              <span className="label-sm text-muted">Total Volume</span>
              <div className="metric-value">
                <span className="metric-display">12.4</span>
                <span className="label-md text-lime">TONS</span>
              </div>
            </div>
            <div className="metric-card">
              <span className="label-sm text-muted">Avg Heart Rate</span>
              <div className="metric-value">
                <span className="metric-display">142</span>
                <span className="label-md text-lime">BPM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="dashboard-panel classes-panel">
          <div className="panel-header">
            <h2 className="panel-title label-sm">Upcoming Classes</h2>
            <button className="btn-ghost label-sm">VIEW SCHEDULE</button>
          </div>
          <div className="class-list">
            <div className="class-row">
              <div className="class-time label-md">18:00 - 19:00</div>
              <div className="class-details">
                <span className="class-name">HYROX ENGINE</span>
                <span className="class-coach text-muted">with Marcus T.</span>
              </div>
              <div className="class-action">
                <span className="spots-left label-sm">2 SPOTS</span>
                <button className="btn-primary">BOOK</button>
              </div>
            </div>
            <div className="class-row">
              <div className="class-time label-md">TOMORROW 07:00</div>
              <div className="class-details">
                <span className="class-name">METCON ELITE</span>
                <span className="class-coach text-muted">with Sarah W.</span>
              </div>
              <div className="class-action">
                <span className="spots-left label-sm">BOOKED</span>
                <button className="btn-secondary">CANCEL</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-panel activity-panel">
          <h2 className="panel-title label-sm">Recent Activity</h2>
          <div className="activity-feed">
            <div className="activity-item">
              <div className="activity-indicator"></div>
              <div className="activity-content">
                <span className="activity-title">Strength: Lower Body</span>
                <span className="activity-meta text-muted">Yesterday, 17:30 • 65 mins</span>
              </div>
              <span className="activity-tag">PR CRUSHED</span>
            </div>
            <div className="activity-item">
              <div className="activity-indicator"></div>
              <div className="activity-content">
                <span className="activity-title">Recovery Protocol</span>
                <span className="activity-meta text-muted">Tuesday, 08:00 • 45 mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* PT Recommendations */}
        <div className="dashboard-panel pt-panel">
          <h2 className="panel-title label-sm">Coach Recommendations</h2>
          <div className="pt-card">
            <div className="pt-avatar"></div>
            <div className="pt-info">
              <span className="pt-name">David K.</span>
              <span className="pt-specialty text-muted">Powerlifting & Hypertrophy</span>
            </div>
            <button className="btn-secondary">BOOK SESSION</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
