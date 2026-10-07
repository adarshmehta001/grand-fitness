import { Link } from 'react-router-dom';
import { gymConfig } from '../config/gym';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero" aria-labelledby="about-hero-heading">
        <div className="about-hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1800&auto=format&fit=crop"
            alt="Wide gym floor with racks and natural light"
            className="about-hero-image"
            width={1800}
            height={900}
            fetchpriority="high" />
          
          <div className="about-hero-overlay" aria-hidden="true" />
        </div>
        <div className="about-hero-content container">
          <p className="page-eyebrow">About {gymConfig.name}</p>
          <h1 id="about-hero-heading">What we're about.</h1>
        </div>
      </section>

      {/* Story */}
      <section className="about-story section-pad" aria-labelledby="story-heading">
        <div className="container">
          <div className="about-two-col">
            <div>
              <h2 id="story-heading">Our Story</h2>
            </div>
            <div className="about-prose">
              <p>
                {gymConfig.name} was created out of a straightforward frustration:
                {gymConfig.location} had plenty of gyms, but very few that felt like they were built
                for serious training. The majority of commercial gyms are designed
                around membership numbers, not training quality.
              </p>
              <p>
                We built {gymConfig.name} to be different. A space that prioritises equipment quality,
                floor space, and coaching expertise over mirrors and marketing.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-philosophy section-pad" aria-labelledby="philosophy-heading">
        <div className="container">
          <h2 id="philosophy-heading" className="about-section-heading">Training Philosophy</h2>
          <div className="philosophy-grid">
            {[
            {
              num: '01',
              title: 'Progressive Overload',
              body: 'Results come from consistent, structured progression — not from doing different things every session. Our programs are built on this principle.'
            },
            {
              num: '02',
              title: 'Technique First',
              body: `No amount of intensity or volume makes up for poor movement. Every trainer at ${gymConfig.name} is committed to coaching technique before loading.`
            },
            {
              num: '03',
              title: 'Long-term Thinking',
              body: 'We\'re not interested in short-term results or quick fixes. We help members build a training practice that works for years, not weeks.'
            },
            {
              num: '04',
              title: 'Individual Approach',
              body: 'Every member is different. Whether you train in groups or with a PT, your programming reflects your body, your goals, and your schedule.'
            }].
            map((item) =>
            <div key={item.num} className="philosophy-item">
                <span className="philosophy-num" aria-hidden="true">{item.num}</span>
                <h3 className="philosophy-title">{item.title}</h3>
                <p className="philosophy-body">{item.body}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="about-expect section-pad" aria-labelledby="expect-heading">
        <div className="container">
          <div className="about-two-col">
            <div>
              <h2 id="expect-heading">What to expect as a member</h2>
            </div>
            <div className="about-prose">
              <ul className="expect-list">
                <li>A gym floor that's cleaned and maintained to a high standard.</li>
                <li>Equipment that's well-serviced and replaced when it needs to be.</li>
                <li>Coaches who are available and engaged, not just present.</li>
                <li>A culture that respects training time — no loud music, no phone zones, no interruptions.</li>
                <li>Group classes kept to a size where coaching is actually possible.</li>
                <li>Honest feedback and realistic expectations.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Highlights */}
      <section className="about-facilities section-pad" aria-labelledby="about-facilities-heading">
        <div className="container">
          <h2 id="about-facilities-heading" className="about-section-heading">Facilities</h2>
          <div className="facilities-highlights-grid">
            {[
            { area: 'Weights Floor', detail: 'Competition-grade barbells, full dumbbell range, dedicated squat and deadlift platforms.' },
            { area: 'Functional Area', detail: 'Full-height rig, pull-up bars, gymnastics rings, battle ropes, and open floor space.' },
            { area: 'Cardio Zone', detail: 'Treadmills, assault bikes, ski ergs, and rowers — selected for durability and performance.' },
            { area: 'Changing Rooms', detail: 'Clean, well-maintained changing rooms with secure lockers and shower facilities.' }].
            map((f) =>
            <div key={f.area} className="facilities-highlight-item">
                <div className="facilities-accent-bar" aria-hidden="true" />
                <strong>{f.area}</strong>
                <p>{f.detail}</p>
              </div>
            )}
          </div>
          <div className="about-gallery-row">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop"
              alt="Weights floor with barbells and racks"
              loading="lazy"
              width={900}
              height={600} />
            
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=900&auto=format&fit=crop"
              alt="Functional training area"
              loading="lazy"
              width={900}
              height={600} />
            
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta section-pad" aria-labelledby="about-cta-heading">
        <div className="container">
          <div className="about-cta-inner">
            <h2 id="about-cta-heading">Explore our programs</h2>
            <p>Browse everything we offer and find where to start — or where to go next.</p>
            <Link to="/programs" className="btn btn--primary btn--lg">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

    </main>);

}