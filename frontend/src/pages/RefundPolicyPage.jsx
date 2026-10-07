import { useEffect } from 'react';

export default function RefundPolicyPage() {
  useEffect(() => {
    document.title = 'Refund Policy | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="page-eyebrow">Legal</p>
          <h1>Refund Policy</h1>
          <div className="legal-content" style={{ marginTop: 'var(--space-6)' }}>
            <div className="placeholder-banner" style={{ backgroundColor: 'var(--color-bg-alt)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
              <strong>Note:</strong> This page is a placeholder and does not yet reflect final, reviewed policy terms.
            </div>
            <p><strong>Last updated: [date pending]</strong></p>
            
            <h3>1. Overview</h3>
            <p>We strive to provide the best fitness experience at The Grand Fitness. If you are not completely satisfied with our services, we offer refund options under the specific conditions outlined below.</p>

            <h3>2. Eligibility for Refunds</h3>
            <p>Refunds are generally applicable if a membership is cancelled within the first 7 days of sign-up, or if you can provide a documented medical reason that permanently prevents you from using our gym facilities.</p>

            <h3>3. Non-Refundable Items/Situations</h3>
            <p>Enrollment fees, personal training sessions that have already been used, drop-in passes, day passes, and special promotional memberships are strictly non-refundable.</p>
            
            <h3>4. How to Request a Refund</h3>
            <p>To request a refund, please contact our support team via email or visit the front desk in person. You will need to provide your membership details, proof of payment, and any relevant documentation (such as a medical certificate).</p>
            
            <h3>5. Processing Time</h3>
            <p>Once your refund request is approved, it will be processed within 7-10 business days. The funds will be credited back to your original method of payment.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
