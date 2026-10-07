import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

import './ProgramCard.css';





const intensityColor = {
  Low: '#4ade80',
  Medium: '#fbbf24',
  High: '#f87171'
};

export default function ProgramCard({ program }) {
  return (
    <article className="program-card">
      <div className="program-card-image-wrap">
        <img
          src={program.imageUrl || program.image}
          alt={program.title}
          className="program-card-image"
          loading="lazy"
          width={600}
          height={400} />
        
        <span className="program-card-category">{program.category}</span>
      </div>
      <div className="program-card-body">
        <div className="program-card-meta">
          <span
            className="program-card-intensity"
            style={{ color: intensityColor[program.intensity] }}>
            
            {program.intensity} intensity
          </span>
          <span className="program-card-dot" aria-hidden="true">·</span>
          <span className="program-card-level">{program.experienceLevel}</span>
          <span className="program-card-dot" aria-hidden="true">·</span>
          <span className="program-card-duration">{program.duration}</span>
        </div>
        <h3 className="program-card-title">{program.title}</h3>
        <p className="program-card-desc">{program.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem' }}>
          <Link to={`/programs/${program.slug}`} className="program-card-link">
            View Program
            <span aria-hidden="true"> →</span>
          </Link>
          <FavoriteButton itemType="program" itemId={program.id} />
        </div>
      </div>
    </article>);

}