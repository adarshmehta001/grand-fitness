import { Link } from 'react-router-dom';
import { gymConfig } from '../config/gym';
import { membershipPlans } from './memberships';

export const spotterQuestions = [
  {
    id: 'hours',
    label: 'What are your hours?',
    answer: () => (
      <p>{gymConfig.contact.hours}</p>
    )
  },
  {
    id: 'location',
    label: 'Where are you located?',
    answer: () => (
      <p>{gymConfig.contact.address}</p>
    )
  },
  {
    id: 'pricing',
    label: 'How much is membership?',
    answer: () => {
      const essentials = membershipPlans.find(p => p.id === 'essentials');
      const performance = membershipPlans.find(p => p.id === 'performance');
      return (
        <div>
          <p>Our {essentials?.name} tier starts at ${essentials?.prices.monthly}/mo. The {performance?.name} tier is ${performance?.prices.monthly}/mo. Quarterly and annual discounts are available.</p>
          <div style={{ marginTop: '0.5rem' }}>
            <Link to="/memberships" style={{ textDecoration: 'underline', color: 'var(--color-accent-primary)' }}>See all memberships</Link>
          </div>
        </div>
      );
    }
  },
  {
    id: 'programs',
    label: 'What programs do you offer?',
    answer: () => (
      <div>
        <p>We offer strength, cardio, functional fitness, and personal training.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/programs" style={{ textDecoration: 'underline', color: 'var(--color-accent-primary)' }}>Explore programs</Link>
        </div>
      </div>
    )
  },
  {
    id: 'contact_trainer',
    label: 'How do I contact a trainer?',
    answer: () => (
      <div>
        <p>Use our contact form to get in touch with a personal trainer.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/contact" style={{ textDecoration: 'underline', color: 'var(--color-accent-primary)' }}>Go to Contact</Link>
        </div>
      </div>
    )
  },
  {
    id: 'free_trial',
    label: 'Do you offer a free trial?',
    answer: () => (
      <div>
        <p>Please reach out via our Contact page for the latest on trial options.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/contact" style={{ textDecoration: 'underline', color: 'var(--color-accent-primary)' }}>Contact us</Link>
        </div>
      </div>
    )
  }
];
