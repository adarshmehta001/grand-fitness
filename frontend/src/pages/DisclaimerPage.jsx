import { useEffect } from 'react';

export default function DisclaimerPage() {
  useEffect(() => {
    document.title = 'Disclaimer | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="page-eyebrow">Legal</p>
          <h1>Disclaimer</h1>
          <div className="legal-content" style={{ marginTop: 'var(--space-6)' }}>
            <div className="placeholder-banner" style={{ backgroundColor: 'var(--color-bg-alt)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
              <strong>Note:</strong> This page is a placeholder and does not yet reflect final, reviewed policy terms.
            </div>
            <p><strong>Last updated: [date pending]</strong></p>
            
            <h3>1. General Disclaimer</h3>
            <p>The information provided by The Grand Fitness on this website is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, or completeness of any information on the site.</p>

            <h3>2. Fitness/Health Disclaimer</h3>
            <p>
              The information and training programs provided on this website are for educational and informational purposes only. Training involves physical risk. You should always consult your physician or other healthcare provider before changing your diet or starting an exercise program. We make no medical claims or guaranteed results.
            </p>
            <p>You should not rely on this information as a substitute for, nor does it replace, professional medical advice, diagnosis, or treatment. If you have any concerns or questions about your health, you should always consult with a physician or other health-care professional.</p>

            <h3>3. External Links Disclaimer</h3>
            <p>The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
            
            <h3>4. Limitation of Liability</h3>
            <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site, our training programs, or reliance on any information provided. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
