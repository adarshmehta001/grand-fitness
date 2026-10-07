import { useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import './FeedbackPage.css';

// You can add or edit reviews here manually
const googleReviews = [
  {
    id: 1,
    name: 'Rahul Kumar',
    rating: 5,
    date: '2 months ago',
    text: 'Best gym in Gayaji! The trainers are very professional and the equipments are top notch. Highly recommended for anyone looking to transform their physique.',
  },
  {
    id: 2,
    name: 'Priya Singh',
    rating: 5,
    date: '3 weeks ago',
    text: 'Very spacious and clean. The environment is extremely motivating. I love the cardio section.',
  },
  {
    id: 3,
    name: 'Amit Sharma',
    rating: 5,
    date: '1 month ago',
    text: 'Premium machines and great crowd. The management is very cooperative. Best decision to join The Grand Fitness.',
  },
  {
    id: 4,
    name: 'Neha Gupta',
    rating: 4,
    date: '4 months ago',
    text: 'Good facilities and hygiene is well maintained. Could use a few more treadmills during peak hours, but overall a fantastic experience.',
  }
];

export default function FeedbackPage() {
  useEffect(() => {
    document.title = 'Reviews & Feedback | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="feedback-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container">
          <div className="feedback-header" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <p className="page-eyebrow">Testimonials</p>
            <h1>What Our Members Say</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', maxWidth: '600px', margin: 'var(--space-4) auto 0' }}>
              Read the latest feedback from our community. We pride ourselves on delivering a premium fitness experience in Gayaji.
            </p>
          </div>

          <div className="reviews-grid">
            {googleReviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-card-header">
                  <div className="reviewer-avatar">
                    {review.name.charAt(0)}
                  </div>
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.name}</span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  {/* Faux Google Logo */}
                  <div className="google-icon" title="Google Review">
                     G
                  </div>
                </div>
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < review.rating ? '#fbbc04' : 'transparent'} 
                      color={i < review.rating ? '#fbbc04' : 'var(--color-border)'} 
                    />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>

          <div className="feedback-cta" style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Khanjahanpur,+Manpur,+Gayaji+823003" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <MessageSquare size={20} />
              Leave a Review on Google
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
