import { useState, useRef, useCallback } from 'react';
import { useData } from '../hooks/useData';
import { GALLERY_CATEGORIES } from '../data/gallery';

import Lightbox from '../components/Lightbox';
import './GalleryPage.css';

const FACILITY_DESCRIPTIONS = {
  'All': '',
  'Weights Floor': 'Competition-grade barbells, a full dumbbell range from 2.5kg to 60kg, and dedicated squat and deadlift platforms.',
  'Cardio Zone': 'Treadmills, assault bikes, ski ergs, rowers — selected for durability and performance. Never overcrowded.',
  'Functional Area': 'Full-height rig with pull-up bars, gymnastics rings, and battle ropes. Open floor space for functional movement.',
  'Recovery': 'Stretching area, mobility equipment, and recovery tools. A space to wind down after a hard session.'
};

export default function GalleryPage() {
  const { data: rawImages, loading, error } = useData('/gallery');

  const galleryImages = (rawImages || []).map((img) => ({
    id: img.id,
    src: img.src || img.imageUrl,
    alt: img.caption || 'Gallery Image',
    caption: img.caption,
    category: img.category
  }));

  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const triggerRef = useRef(null);

  const filtered = activeCategory === 'All' ?
  galleryImages :
  galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index, btn) => {
    triggerRef.current = btn;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => i === null ? null : (i - 1 + filtered.length) % filtered.length);
  }, [filtered.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => i === null ? null : (i + 1) % filtered.length);
  }, [filtered.length]);

  return (
    <main className="gallery-page" style={{ paddingTop: '68px' }}>

      <section className="gallery-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">Inside Apex</p>
          <h1>Facilities & Gallery</h1>
          <p className="gallery-intro">
            A selection of images from across the gym. Use the filters to browse specific areas.
          </p>
        </div>
      </section>

      <section className="gallery-content section-pad">
        <div className="container">
          {/* Filters */}
          <div className="gallery-filters" role="group" aria-label="Filter gallery by zone">
            {GALLERY_CATEGORIES.map((cat) =>
            <button
              key={cat}
              className={`filter-chip${activeCategory === cat ? ' filter-chip--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}>
              
                {cat}
              </button>
            )}
          </div>

          {/* Facility description */}
          {activeCategory !== 'All' &&
          <div className="facility-desc-box">
              <h2 className="facility-desc-title">{activeCategory}</h2>
              <p>{FACILITY_DESCRIPTIONS[activeCategory]}</p>
            </div>
          }

          {/* Live region */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {loading ? 'Loading images...' :
            filtered.length === 0 ?
            'No images in this category.' :
            `${filtered.length} image${filtered.length === 1 ? '' : 's'} shown.`
            }
          </div>

          {loading && <p>Loading images...</p>}
          {error && <p>Failed to load images: {error}</p>}

          {/* Gallery Grid */}
          {!loading && !error && filtered.length === 0 ?
          <div className="gallery-empty">
              <p>No images in this category yet.</p>
            </div> :

          <div className="gallery-grid">
              {filtered.map((img, i) =>
            <button
              key={img.id}
              className="gallery-item"
              onClick={(e) => openLightbox(i, e.currentTarget)}
              aria-label={`Open image: ${img.alt}`}>
              
                  <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={600}
                height={400}
                className="gallery-item-img" />
              
                  {img.caption &&
              <div className="gallery-item-caption">{img.caption}</div>
              }
                </button>
            )}
            </div>
          }
        </div>
      </section>

      {lightboxIndex !== null &&
      <Lightbox
        images={filtered}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
        triggerRef={triggerRef} />

      }
    </main>);

}