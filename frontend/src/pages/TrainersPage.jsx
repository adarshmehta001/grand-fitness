import { useState, useRef } from 'react';
import { useData } from '../hooks/useData';
import TrainerModal from '../components/TrainerModal';

import './TrainersPage.css';

export default function TrainersPage() {
  const { data: trainers, loading, error } = useData('/trainers');
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);

  const openTrainer = (trainer, btn) => {
    triggerRef.current = btn;
    setSelected(trainer);
  };

  const closeTrainer = () => {
    setSelected(null);
  };

  return (
    <main className="trainers-page" style={{ paddingTop: '68px' }}>

      <section className="trainers-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">The Team</p>
          <h1>Our Trainers</h1>
          <p className="trainers-intro">
            Each trainer at Apex has a distinct background and specialisation.
            All profiles shown below are for demonstration purposes only.
          </p>
        </div>
      </section>

      <section className="trainers-grid-section section-pad">
        <div className="container">


          {loading && <p>Loading trainers...</p>}
          {error && <p>Failed to load trainers: {error}</p>}

          <div className="trainers-grid" role="list">
            {(trainers || []).map((trainer) =>
            <div key={trainer.id} className="trainer-card" role="listitem">
                <div className="trainer-card-image-wrap">
                  <img
                  src={trainer.imageUrl || trainer.image}
                  alt={trainer.name}
                  className="trainer-card-image"
                  loading="lazy"
                  width={400}
                  height={500} />
                
                </div>
                <div className="trainer-card-body">
                  <div className="trainer-card-info">
                    <h2 className="trainer-card-name">{trainer.name}</h2>
                    <p className="trainer-card-specialty">{trainer.specialty}</p>
                    <p className="trainer-card-bio">{trainer.bio?.split('[')[0].trim() || ''}</p>
                  </div>
                  <button
                  className="btn btn--secondary btn--sm trainer-view-btn"
                  onClick={(e) => openTrainer(trainer, e.currentTarget)}
                  aria-label={`View full profile for ${trainer.name}`}>
                  
                    View Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {selected &&
      <TrainerModal
        trainer={{ ...selected, image: selected.imageUrl || selected.image }}
        triggerRef={triggerRef}
        onClose={closeTrainer} />

      }
    </main>);

}