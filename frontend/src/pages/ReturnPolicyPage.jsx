import { useEffect } from 'react';

export default function ReturnPolicyPage() {
  useEffect(() => {
    document.title = 'Return Policy | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="page-eyebrow">Legal</p>
          <h1>Return Policy</h1>
          <div className="legal-content" style={{ marginTop: 'var(--space-6)' }}>
            <div className="placeholder-banner" style={{ backgroundColor: 'var(--color-bg-alt)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
              <strong>Note:</strong> This page is a placeholder and does not yet reflect final, reviewed policy terms.
            </div>
            <p><strong>Last updated: [date pending]</strong></p>
            <p><em>Note: This policy applies to the membership/fitness services described on this site, not physical goods. You may want to consider renaming this to "Cancellation Policy".</em></p>
            
            <h3>1. Overview</h3>
            <p>This policy outlines the terms and conditions for cancelling your membership or recurring fitness services at The Grand Fitness.</p>

            <h3>2. Eligibility for Returns/Cancellations</h3>
            <p>Members can cancel their monthly recurring memberships at any time. To avoid being charged for the following month, cancellations must be made at least 7 days before your next billing cycle date.</p>

            <h3>3. Non-Returnable Items/Situations</h3>
            <p>Annual memberships or packages paid entirely upfront are generally non-refundable unless cancelled within an initial 7-day cooling-off period or due to a qualifying relocation/medical condition.</p>
            
            <h3>4. How to Request a Return/Cancellation</h3>
            <p>Cancellation requests must be submitted in writing. You can do this by sending us an email at our official contact address or by filling out a cancellation form directly at the gym's front desk.</p>
            
            <h3>5. Processing Time</h3>
            <p>Once we receive your cancellation request, you will receive a confirmation email within 2-3 business days. Your gym access will remain active until the end of your current paid billing period.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
