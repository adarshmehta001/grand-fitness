import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { DAYS, CLASS_CATEGORIES } from '../data/schedule';
import FavoriteButton from '../components/FavoriteButton';

import './SchedulePage.css';

const intensityColor = {
  Low: '#4ade80',
  Medium: '#fbbf24',
  High: '#f87171'
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const liveId = useId();

  const { data: scheduleClasses, loading, error } = useData('/schedule');

  const filtered = (scheduleClasses || []).filter((c) => {
    const dayMatch = activeDay === 'All' || c.day === activeDay;
    const catMatch = activeCategory === 'All' || c.category === activeCategory;
    return dayMatch && catMatch;
  });

  // For desktop timetable: group by day
  const byDay = DAYS.map((day) => ({
    day,
    classes: filtered.filter((c) => c.day === day)
  })).filter((d) => activeDay === 'All' || d.day === activeDay);

  return (
    <main className="schedule-page" style={{ paddingTop: '68px' }}>

      <section className="schedule-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">What's on</p>
          <h1>Class Schedule</h1>
          <p className="schedule-intro">
            Browse the weekly timetable below. To register interest in a class, use the "Enquire"
            link — this will open a pre-filled enquiry form.
          </p>
        </div>
      </section>

      <section className="schedule-content section-pad">
        <div className="container">
          {/* Filters */}
          <div className="schedule-filters">
            <div>
              <p className="filter-label-text">Day</p>
              <div className="filter-chips" role="group" aria-label="Filter by day">
                <button
                  className={`filter-chip${activeDay === 'All' ? ' filter-chip--active' : ''}`}
                  onClick={() => setActiveDay('All')}
                  aria-pressed={activeDay === 'All'}>
                  All</button>
                {DAYS.map((d) =>
                <button
                  key={d}
                  className={`filter-chip${activeDay === d ? ' filter-chip--active' : ''}`}
                  onClick={() => setActiveDay(d)}
                  aria-pressed={activeDay === d}>
                  {d.slice(0, 3)}</button>
                )}
              </div>
            </div>
            <div>
              <p className="filter-label-text">Category</p>
              <div className="filter-chips" role="group" aria-label="Filter by category">
                <button
                  className={`filter-chip${activeCategory === 'All' ? ' filter-chip--active' : ''}`}
                  onClick={() => setActiveCategory('All')}
                  aria-pressed={activeCategory === 'All'}>
                  All</button>
                {CLASS_CATEGORIES.map((c) =>
                <button
                  key={c}
                  className={`filter-chip${activeCategory === c ? ' filter-chip--active' : ''}`}
                  onClick={() => setActiveCategory(c)}
                  aria-pressed={activeCategory === c}>
                  {c}</button>
                )}
              </div>
            </div>
          </div>

          {/* Live region */}
          <div id={liveId} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {loading ? 'Loading schedule...' :
            filtered.length === 0 ?
            'No classes match the selected filters.' :
            `${filtered.length} class${filtered.length === 1 ? '' : 'es'} found.`
            }
          </div>

          {loading ?
          <div className="schedule-empty">
              <p>Loading schedule...</p>
            </div> :
          error ?
          <div className="schedule-empty">
              <p>Failed to load schedule: {error}</p>
            </div> :
          filtered.length === 0 ?
          <div className="schedule-empty">
              <p className="schedule-empty-title">No classes match these filters.</p>
              <p>Try selecting a different day or category.</p>
              <button className="btn btn--secondary btn--md" onClick={() => {setActiveDay('All');setActiveCategory('All');}}>
                Show all classes
              </button>
            </div> :

          <>
              {/* Desktop: timetable view */}
              <div className="schedule-timetable" aria-label="Weekly class timetable" role="region">
                {byDay.filter((d) => d.classes.length > 0).map(({ day, classes }) =>
              <div key={day} className="schedule-day-group">
                    <h2 className="schedule-day-heading">{day}</h2>
                    <div className="schedule-classes">
                      {classes.map((cls) =>
                  <div key={cls.id} className="schedule-class-card">
                          <div className="scc-time-col">
                            <span className="scc-time">{cls.startTime}</span>
                            <span className="scc-duration">{cls.duration}min</span>
                          </div>
                          <div className="scc-main">
                            <div className="scc-header">
                              <strong className="scc-title">{cls.title}</strong>
                              <span
                          className="scc-intensity"
                          style={{ color: intensityColor[cls.intensity] }}>
                          
                                {cls.intensity}
                              </span>
                            </div>
                            <p className="scc-meta">
                              {cls.trainer} · {cls.category}
                            </p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <button
                              className="btn btn--ghost btn--sm scc-enquire"
                              onClick={() => navigate(`/contact?interest=class&class=${cls.id}`)}>
                              Enquire
                            </button>
                            <FavoriteButton itemType="class" itemId={cls.id} />
                          </div>
                        </div>
                  )}
                    </div>
                  </div>
              )}
              </div>

              {/* Mobile: agenda view */}
              <div className="schedule-agenda" role="list">
                {filtered.map((cls) =>
              <div key={cls.id} className="agenda-item" role="listitem">
                    <div className="agenda-time">
                      <span className="agenda-day">{cls.day.slice(0, 3)}</span>
                      <span className="agenda-clock">{cls.startTime}</span>
                    </div>
                    <div className="agenda-body">
                      <strong className="agenda-title">{cls.title}</strong>
                      <span className="agenda-trainer">{cls.trainer}</span>
                      <div className="agenda-tags">
                        <span className="agenda-cat">{cls.category}</span>
                        <span
                      className="agenda-intensity"
                      style={{ color: intensityColor[cls.intensity] }}>
                      {cls.intensity}</span>
                        <span className="agenda-dur">{cls.duration}min</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => navigate(`/contact?interest=class&class=${cls.id}`)}>
                        Enquire
                      </button>
                      <FavoriteButton itemType="class" itemId={cls.id} />
                    </div>
                  </div>
              )}
              </div>
            </>
          }


        </div>
      </section>

    </main>);

}