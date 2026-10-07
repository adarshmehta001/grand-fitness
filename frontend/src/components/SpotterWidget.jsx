import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { spotterQuestions } from '../data/faq';
import './SpotterWidget.css';

const SpotterWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Move focus into the panel when opened
      const firstFocusable = panelRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        panelRef.current?.focus();
      }
    } else {
      // Return focus to button when closed (if it was already mounted)
      if (buttonRef.current && activeQuestion === null && !isOpen) {
        // Return focus to trigger after closing
      }
    }
  }, [isOpen]);

  const closeWidget = () => {
    setIsOpen(false);
    setTimeout(() => {
      buttonRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeWidget();
    }
  };

  return (
    <div className="spotter-widget">
      {isOpen && (
        <div 
          className="spotter-panel" 
          ref={panelRef} 
          tabIndex="-1" 
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-label="Spotter FAQ chat"
        >
          <div className="spotter-header">
            <div className="spotter-title">
              <MessageCircle size={18} />
              <span>Spotter</span>
            </div>
            <button className="spotter-close" onClick={closeWidget} aria-label="Close Spotter panel">
              <X size={20} />
            </button>
          </div>
          
          <div className="spotter-body">
            {!activeQuestion ? (
              <>
                <p className="spotter-greeting">
                  Hi, I'm Spotter — ask me about our hours, pricing, location, or programs.
                </p>
                <div className="spotter-questions">
                  {spotterQuestions.map(q => (
                    <button 
                      key={q.id} 
                      className="spotter-question-btn"
                      onClick={() => setActiveQuestion(q)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="spotter-answer-view">
                <div className="spotter-question-bubble">
                  {activeQuestion.label}
                </div>
                <div className="spotter-answer-bubble" aria-live="polite">
                  <activeQuestion.answer />
                </div>
                <button 
                  className="spotter-back-btn" 
                  onClick={() => setActiveQuestion(null)}
                >
                  Ask Spotter something else
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button 
        ref={buttonRef}
        className={`spotter-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => {
          if (isOpen) {
             closeWidget();
          } else {
             setIsOpen(true);
             setActiveQuestion(null);
          }
        }}
        aria-label={isOpen ? "Close Spotter" : "Open Spotter, our FAQ assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default SpotterWidget;
