import { useState, useId } from 'react';
import { useData } from '../hooks/useData';
import ProgramCard from '../components/ProgramCard';
import './ProgramsPage.css';

const CATEGORIES = ['All', 'strength', 'cardio', 'functional fitness', 'personal training'];
const INTENSITIES = ['All', 'Low', 'Medium', 'High'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function ProgramsPage() {
  const [category, setCategory] = useState('All');
  const [intensity, setIntensity] = useState('All');
  const [level, setLevel] = useState('All');
  const liveId = useId();

  const { data: programs, loading, error } = useData('/programs');

  const filtered = (programs || []).filter((p) => {
    const catMatch = category === 'All' || p.category === category;
    const intMatch = intensity === 'All' || p.intensity === intensity;
    const lvlMatch = level === 'All' || p.experienceLevel === level;
    return catMatch && intMatch && lvlMatch;
  });

  const resetFilters = () => {
    setCategory('All');
    setIntensity('All');
    setLevel('All');
  };

  const hasFilters = category !== 'All' || intensity !== 'All' || level !== 'All';

  return (
    <main className="programs-page" style={{ paddingTop: '68px' }}>

      <div className="programs-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">What we offer</p>
          <h1>Programs</h1>
          <p className="programs-intro">
            Every program at Apex is designed around clear goals, appropriate progressions,
            and coaching that meets you at your level. Browse below and use the filters to
            find what suits you.
          </p>
        </div>
      </div>

      <div className="programs-content section-pad">
        <div className="container">
          <h2 className="sr-only">Available Programs</h2>
          
          {/* Filters */}
          <fieldset className="programs-filters" aria-label="Filter programs">
            <legend className="sr-only">Filter programs by category, intensity and level</legend>

            <div className="filter-group">
              <span className="filter-label" aria-hidden="true">Category</span>
              <div className="filter-chips" role="group" aria-label="Category filters">
                {CATEGORIES.map((c) =>
                <button
                  key={c}
                  className={`filter-chip${category === c ? ' filter-chip--active' : ''}`}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}>
                  
                    {c === 'All' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                )}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label" aria-hidden="true">Intensity</span>
              <div className="filter-chips" role="group" aria-label="Intensity filters">
                {INTENSITIES.map((i) =>
                <button
                  key={i}
                  className={`filter-chip${intensity === i ? ' filter-chip--active' : ''}`}
                  onClick={() => setIntensity(i)}
                  aria-pressed={intensity === i}>
                  
                    {i}
                  </button>
                )}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label" aria-hidden="true">Experience</span>
              <div className="filter-chips" role="group" aria-label="Experience level filters">
                {LEVELS.map((l) =>
                <button
                  key={l}
                  className={`filter-chip${level === l ? ' filter-chip--active' : ''}`}
                  onClick={() => setLevel(l)}
                  aria-pressed={level === l}>
                  
                    {l}
                  </button>
                )}
              </div>
            </div>

            {hasFilters &&
            <button className="filter-reset" onClick={resetFilters}>
                Clear filters
              </button>
            }
          </fieldset>

          {/* Live region for filter results */}
          <div
            id={liveId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only">
            
            {loading ? 'Loading programs...' :
            filtered.length === 0 ?
            'No programs match the selected filters.' :
            `${filtered.length} program${filtered.length === 1 ? '' : 's'} found.`
            }
          </div>

          {/* Grid / Empty State */}
          {loading ?
          <div className="programs-empty" role="status">
              <p className="programs-empty-title">Loading programs...</p>
            </div> :
          error ?
          <div className="programs-empty" role="alert">
              <p className="programs-empty-title">Failed to load programs.</p>
              <p className="programs-empty-sub">{error}</p>
            </div> :
          filtered.length === 0 ?
          <div className="programs-empty" role="alert">
              <p className="programs-empty-title">No programs match these filters.</p>
              <p className="programs-empty-sub">
                Try adjusting the category, intensity, or experience level filters.
              </p>
              <button className="btn btn--secondary btn--md" onClick={resetFilters}>
                Clear all filters
              </button>
            </div> :

          <div className="programs-grid">
              {filtered.map((p) =>
            <ProgramCard key={p.id} program={p} />
            )}
            </div>
          }
        </div>
      </div>
    </main>);

}