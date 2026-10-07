import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../hooks/useData';
import ProgramCard from '../components/ProgramCard';
import { gymConfig } from '../config/gym';
import './HomePage.css';

const DumbbellHero = lazy(() => import('../components/DumbbellHero'));

export default function HomePage() {
  const { data: programs, loading: programsLoading, error: programsError } = useData('/programs');
  const { data: galleryImages, loading: galleryLoading, error: galleryError } = useData('/gallery');
  const { data: membershipPlans, loading: membershipsLoading, error: membershipsError } = useData('/memberships');

  const [programCategory, setProgramCategory] = useState('All');
  
  const filteredPrograms = (programs || []).filter(p => 
    programCategory === 'All' || p.category === programCategory
  );
  
  const programCategories = ['All', ...new Set((programs || []).map(p => p.category))];

  return (
    <main className="home-page">

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="hero-section" aria-label="Hero">
        <div className="hero-content container">
          <p className="hero-eyebrow">Premium Performance Training · {gymConfig.location}</p>

          <div className="hero-headline-row">
            <h1 className="hero-headline">
              Train with<br />
              <span className="hero-accent">purpose.</span>
            </h1>
            <div className="hero-3d-wrap" aria-hidden="true">
              <Suspense fallback={<div className="hero-3d-placeholder" aria-hidden="true" />}>
                <DumbbellHero />
              </Suspense>
            </div>
          </div>

          <p className="hero-sub">
            {gymConfig.name} is a serious training facility for people who demand more from
            their gym. No fads. No fluff. Just the environment, equipment, and expertise
            to train at your best.
          </p>
          <div className="hero-actions">
            <Link to="/memberships" className="btn btn--primary btn--lg">
              Explore Memberships
            </Link>
            <Link to="/gallery" className="btn btn--secondary btn--lg">
              Explore the Gym
            </Link>
          </div>
        </div>

        <div className="hero-scroll-indicator" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ─── BRAND INTRO ──────────────────────────────── */}
      <section className="brand-intro-section" aria-labelledby="brand-intro-heading">
        <div className="container">
          <div className="brand-intro-grid">
            <div>
              <h2 id="brand-intro-heading" className="brand-intro-heading">
                Built for those who take training seriously.
              </h2>
            </div>
            <div className="brand-intro-body">
              <p>
                Most gyms are built around footfall. {gymConfig.name} is built around performance.
                Every piece of equipment, every class, every square metre of floor space
                is chosen with a single question in mind: does this help our members train better?
              </p>
              <p>
                Whether you're starting out or preparing to compete, you'll find the
                space and the support to do your best work here.
              </p>
            </div>
          </div>
          <div className="brand-pillars" role="list">
            {[
            { label: 'Serious Equipment', desc: 'Competition-grade weights, bars, and machines.' },
            { label: 'Expert Coaching', desc: 'Trainers who know their craft and respect yours.' },
            { label: 'Focused Environment', desc: 'A space designed to help you get into the work.' }].
            map((p) =>
            <div key={p.label} className="brand-pillar" role="listitem">
                <div className="brand-pillar-rule" aria-hidden="true" />
                <strong className="brand-pillar-label">{p.label}</strong>
                <p className="brand-pillar-desc">{p.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROGRAMS ────────────────────────── */}
      <section className="section-featured-programs" aria-labelledby="programs-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="programs-heading">Featured Programs</h2>
            <Link to="/programs" className="section-header-link">
              All Programs →
            </Link>
          </div>
          
          {programCategories.length > 1 && (
            <div className="home-category-filters" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {programCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setProgramCategory(cat)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    background: programCategory === cat ? 'var(--color-accent-primary)' : 'transparent',
                    color: programCategory === cat ? '#000' : 'var(--color-text-secondary)',
                    fontWeight: programCategory === cat ? '600' : '400',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="featured-programs-grid">
            {programsLoading ? (
              <p>Loading programs...</p>
            ) : programsError ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>Unable to load programs at the moment.</p>
            ) : filteredPrograms.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No programs available in this category.</p>
            ) : (
              filteredPrograms.slice(0, 3).map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── FACILITIES PREVIEW ───────────────────────── */}
      <section className="facilities-preview-section" aria-labelledby="facilities-heading">
        <div className="container">
          <div className="facilities-preview-grid">
            <div className="facilities-preview-text">
              <h2 id="facilities-heading">
                The equipment<br />you actually need.
              </h2>
              <p>
                Competition-grade barbells and platforms. A full dumbbell range.
                Dedicated functional training rigs. Cardiovascular equipment
                that keeps pace with you.
              </p>
              <p>
                No crowding, no compromise. Space and kit that match your ambition.
              </p>
              <Link to="/gallery" className="btn btn--secondary btn--md" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                See the Facilities
              </Link>
            </div>
            <div className="facilities-preview-images">
              {galleryLoading ?
              <p>Loading images...</p> :

              <>
                  {galleryImages && galleryImages[0] &&
                <img
                  src={galleryImages[0].src || galleryImages[0].imageUrl}
                  alt={galleryImages[0].caption || 'Gym Facility'}
                  className="facilities-img facilities-img--main"
                  loading="lazy"
                  width={700}
                  height={500} />

                }
                  {galleryImages && galleryImages[4] &&
                <img
                  src={galleryImages[4].src || galleryImages[4].imageUrl}
                  alt={galleryImages[4].caption || 'Gym Facility'}
                  className="facilities-img facilities-img--secondary"
                  loading="lazy"
                  width={400}
                  height={300} />

                }
                </>
              }
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEMBERSHIP PREVIEW ───────────────────────── */}
      <section className="membership-preview-section" aria-labelledby="membership-preview-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="membership-preview-heading">Membership</h2>
            <Link to="/memberships" className="section-header-link">View plans →</Link>
          </div>
          <div className="membership-preview-cards">
            {membershipsLoading ? (
              <p>Loading memberships...</p>
            ) : membershipsError ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>Unable to load memberships.</p>
            ) : membershipPlans?.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No memberships currently available.</p>
            ) : (
              (membershipPlans || []).slice(0, 3).map((m) => (
                <div key={m.id} className="membership-preview-card">
                  <strong className="mp-name">{m.name}</strong>
                  <p className="mp-tag">{(m.features || m.inclusions || [])[0] || 'Full access'}</p>
                  <Link to="/memberships" className="mp-link">See pricing →</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>


      {/* ─── GALLERY PREVIEW ──────────────────────────── */}
      <section className="gallery-preview-section" aria-labelledby="gallery-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="gallery-heading">Inside {gymConfig.name}</h2>
            <Link to="/gallery" className="section-header-link">Full gallery →</Link>
          </div>
          <div className="gallery-preview-grid">
            {galleryLoading ?
            <p>Loading gallery...</p> :
            (galleryImages || []).slice(0, 5).map((img, i) =>
            <div
              key={img.id}
              className={`gallery-preview-item gallery-preview-item--${i + 1}`}>
              
                <img
                src={img.src || img.imageUrl}
                alt={img.caption || 'Gallery Image'}
                loading="lazy"
                width={600}
                height={400} />
              
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── CLOSING CTA ──────────────────────────────── */}
      <section className="closing-cta-section" aria-labelledby="closing-cta-heading">
        <div className="container">
          <div className="closing-cta-inner">
            <h2 id="closing-cta-heading">Ready to start?</h2>
            <p>
              Use the form to ask about memberships, programs, trials,
              or anything else. We'll come back to you directly.
            </p>
            <Link to="/contact" className="btn btn--primary btn--lg">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </main>);

}