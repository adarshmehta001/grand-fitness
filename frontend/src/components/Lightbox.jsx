import { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

import './Lightbox.css';










export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  triggerRef
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const image = images[currentIndex];

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'Escape':onClose();break;
      case 'ArrowLeft':onPrev();break;
      case 'ArrowRight':onNext();break;
    }
    // Focus trap
    if (e.key === 'Tab') {
      const focusable = dialogRef.current?.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose, onPrev, onNext]);

  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    }
    touchStartX.current = null;
  };

  useEffect(() => {
    closeRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [handleKeyDown, triggerRef]);

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-hidden="true">
      
      <div
        ref={dialogRef}
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Image ${currentIndex + 1} of ${images.length}: ${image.alt}`}
        onClick={(e) => e.stopPropagation()}>
        
        <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
          <X size={20} />
        </button>

        <button
          className="lightbox-nav lightbox-nav--prev"
          onClick={onPrev}
          aria-label="Previous image"
          disabled={images.length <= 1}>
          
          <ChevronLeft size={24} />
        </button>

        <div className="lightbox-image-wrap">
          <img
            src={image.src}
            alt={image.alt}
            className="lightbox-image" />
          
        </div>

        <button
          className="lightbox-nav lightbox-nav--next"
          onClick={onNext}
          aria-label="Next image"
          disabled={images.length <= 1}>
          
          <ChevronRight size={24} />
        </button>

        <div className="lightbox-footer">
          {image.caption && <p className="lightbox-caption">{image.caption}</p>}
          <p className="lightbox-counter" aria-live="polite">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      </div>
    </div>);

}