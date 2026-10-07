import { useParams, Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import ProgramCard from '../components/ProgramCard';
import FavoriteButton from '../components/FavoriteButton';
import './ProgramDetailPage.css';

const intensityColor = {
  Low: '#4ade80',
  Medium: '#fbbf24',
  High: '#f87171'
};

export default function ProgramDetailPage() {
  const { slug } = useParams();
  const { data: program, loading, error } = useData(`/programs/${slug}`);
  const { data: allPrograms } = useData('/programs');

  if (loading) {
    return (
      <main className="program-detail-page" style={{ paddingTop: '68px' }}>
        <div className="container section-pad">
          <p>Loading program...</p>
        </div>
      </main>);

  }

  if (error || !program) {
    return (
      <main className="program-not-found" style={{ paddingTop: '68px' }}>
        <div className="container section-pad">
          <p className="page-eyebrow">Program not found</p>
          <h1>This program doesn't exist.</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-5)' }}>
            The URL <code style={{ background: 'var(--color-bg-surface-elevated)', padding: '0.1em 0.4em', borderRadius: 4 }}>/programs/{slug}</code> doesn't match any program in our schedule.
          </p>
          <Link to="/programs" className="btn btn--primary btn--md">
            Back to All Programs
          </Link>
        </div>
      </main>);

  }


  const related = (allPrograms || []).filter((p) => p.id !== program.id && p.category === program.category).slice(0, 3);

  const sessionDetails = {
    'strength': [
    'Warm-up and activation (10–15 min)',
    'Technique review of the main lifts',
    'Working sets with appropriate load',
    'Accessory exercises to support the primary movement',
    'Cool-down and mobility work'],

    'cardio': [
    'Heart-rate ramp-up (5–8 min)',
    'Alternating high-effort and recovery intervals',
    'Conditioning circuits or structured intervals',
    'Active recovery and breathing focus'],

    'functional fitness': [
    'Movement prep and dynamic warm-up',
    'Skill or technique focus',
    'Functional circuit or structured WOD',
    'Cool-down and mobility'],

    'personal training': [
    'Review of previous session and goals',
    'Tailored warm-up',
    'Personalised training block based on your programme',
    'Form correction and coaching throughout',
    'Notes and progression planning']

  };

  const schedule = {
    'strength': 'Typically 3 sessions per week, with rest days between.',
    'cardio': 'Recommended 2–4 times per week depending on current fitness base.',
    'functional fitness': '2–3 times per week, complementing strength training.',
    'personal training': 'Based on individual agreement with your trainer.'
  };

  const session = sessionDetails[program.category] ?? sessionDetails['functional fitness'];
  const scheduleNote = schedule[program.category] ?? 'Please enquire for specific scheduling.';

  return (
    <main className="program-detail-page" style={{ paddingTop: '68px' }}>

      {/* Hero */}
      <section className="pd-hero">
        <div className="pd-hero-image-wrap">
          <img
            src={program.imageUrl || program.image}
            alt={program.title}
            className="pd-hero-image"
            fetchpriority="high"
            width={1800}
            height={700} />
          
          <div className="pd-hero-overlay" aria-hidden="true" />
        </div>
        <div className="pd-hero-content container">
          <Link to="/programs" className="pd-back-link">← All Programs</Link>
          <div className="pd-meta">
            <span className="pd-category">{program.category}</span>
            <span
              className="pd-intensity"
              style={{ color: intensityColor[program.intensity] || intensityColor.Medium }}>
              
              {program.intensity} intensity
            </span>
            <span className="pd-level">{program.experienceLevel}</span>
            <span className="pd-duration">{program.duration}</span>
          </div>
          <h1 className="pd-title">{program.title}</h1>
        </div>
      </section>

      {/* Overview */}
      <section className="pd-body section-pad">
        <div className="container">
          <div className="pd-overview-grid">
            <div>
              <h2>Overview</h2>
              <p>{program.description}</p>
              <p>
                This program is suited to <strong>{program.experienceLevel}</strong> level athletes
                and runs at a <strong>{program.intensity?.toLowerCase() || 'medium'}</strong> intensity.
                Sessions last approximately <strong>{program.duration}</strong>.
              </p>
            </div>

            <aside className="pd-sidebar">
              <div className="pd-sidebar-card">
                <dl className="pd-stats">
                  <div>
                    <dt>Category</dt>
                    <dd>{program.category ? program.category.charAt(0).toUpperCase() + program.category.slice(1) : ''}</dd>
                  </div>
                  <div>
                    <dt>Intensity</dt>
                    <dd style={{ color: intensityColor[program.intensity] || intensityColor.Medium }}>{program.intensity}</dd>
                  </div>
                  <div>
                    <dt>Experience Level</dt>
                    <dd>{program.experienceLevel}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{program.duration}</dd>
                  </div>
                </dl>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <Link to={`/contact?interest=program&program=${program.id}`} className="btn btn--primary btn--md pd-enquire-btn">
                    Enquire About This Program
                  </Link>
                  <FavoriteButton itemType="program" itemId={program.id} className="btn btn--secondary btn--md">
                    Favorite
                  </FavoriteButton>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* What a session involves */}
      <section className="pd-session section-pad">
        <div className="container">
          <h2>What a session involves</h2>
          <ul className="pd-session-list">
            {session.map((step, i) =>
            <li key={i}>{step}</li>
            )}
          </ul>
          <p className="pd-disclaimer">
            Actual session content is tailored by trainers and may vary.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="pd-schedule section-pad">
        <div className="container">
          <h2>Sample Schedule</h2>
          <p>{scheduleNote}</p>
          <p className="pd-disclaimer">Actual class times listed on the <Link to="/schedule">class schedule</Link> page.</p>
        </div>
      </section>


      {/* CTA */}
      <section className="pd-cta section-pad">
        <div className="container">
          <div className="pd-cta-inner">
            <h2>Interested in {program.title}?</h2>
            <p>Use the enquiry form to ask about this program, availability, or how to get started.</p>
            <Link to={`/contact?interest=program&program=${program.id}`} className="btn btn--primary btn--lg">
              Send an Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      {related.length > 0 &&
      <section className="pd-related section-pad">
          <div className="container">
            <h2>Related Programs</h2>
            <div className="related-programs-grid">
              {related.map((p) =>
            <ProgramCard key={p.id} program={p} />
            )}
            </div>
          </div>
        </section>
      }

    </main>);

}