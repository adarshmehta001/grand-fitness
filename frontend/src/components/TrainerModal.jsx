import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import { Link } from 'react-router-dom';
import './TrainerModal.css';







export default function TrainerModal({ trainer, triggerRef, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  // Focus trap & Escape
  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [onClose, triggerRef]);

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        ref={dialogRef}
        className="trainer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${trainer.name} profile`}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true">
        
        <button
          ref={closeRef}
          className="modal-close"
          onClick={onClose}
          aria-label="Close trainer profile">
          
          <X size={20} />
        </button>

        <div className="trainer-modal-image-wrap">
          <img
            src={trainer.imageUrl || trainer.image}
            alt={trainer.name}
            className="trainer-modal-image"
            width={400}
            height={500} />
          
        </div>

        <div className="trainer-modal-body">

          <h2 className="trainer-modal-name">{trainer.name}</h2>
          <p className="trainer-modal-specialty">{trainer.specialty}</p>
          <p className="trainer-modal-bio">{trainer.bio}</p>
          <Link
            to={`/contact?interest=trainer&trainer=${trainer.id}`}
            className="btn btn--primary btn--md">
            
            Enquire with {trainer.name.split(' ')[0]}
          </Link>
        </div>
      </div>
    </div>);

}