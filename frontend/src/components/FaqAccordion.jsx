import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FaqAccordion.css';










export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-accordion" role="list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const id = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <div
            key={i}
            className={`faq-item${isOpen ? ' faq-item--open' : ''}`}
            role="listitem">
            
            <button
              id={btnId}
              className="faq-question"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpenIndex(isOpen ? null : i)}>
              
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                className="faq-icon"
                aria-hidden="true" />
              
            </button>
            <div
              id={id}
              role="region"
              aria-labelledby={btnId}
              className="faq-answer"
              hidden={!isOpen}>
              
              <p>{item.a}</p>
            </div>
          </div>);

      })}
    </div>);

}