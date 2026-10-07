import { useEffect } from 'react';

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="page-eyebrow">Legal</p>
          <h1>Terms of Service</h1>
          <div className="legal-content" style={{ marginTop: 'var(--space-6)' }}>
            <p><strong>Effective Date: October 2026</strong></p>
            <p>
              Welcome to The Grand Fitness. By accessing our premises, using our website, or purchasing a membership, you agree to be bound by the following Terms of Service.
            </p>

            <h3>1. Membership and Access</h3>
            <p>
              Memberships are strictly non-transferable and non-refundable. You must present valid identification or membership details upon entry. The management reserves the right to deny access to any individual violating gym policies or behaving inappropriately.
            </p>

            <h3>2. Code of Conduct</h3>
            <ul>
              <li><strong>Equipment Usage:</strong> Please wipe down equipment after use and return weights to their designated racks.</li>
              <li><strong>Attire:</strong> Proper athletic attire and closed-toe sports shoes are strictly required.</li>
              <li><strong>Behavior:</strong> Harassment, aggressive behavior, or use of abusive language towards staff or other members will result in immediate termination of membership without refund.</li>
            </ul>

            <h3>3. Health and Safety</h3>
            <p>
              You acknowledge that participating in fitness activities involves inherent risks. By using our facilities, you confirm that you are medically fit to undertake physical exercise. You agree to use the equipment at your own risk and The Grand Fitness shall not be liable for any injury, loss, or damage to personal property.
            </p>

            <h3>4. Operational Hours</h3>
            <p>
              The gym's operating hours are subject to change. We reserve the right to close the facility for public holidays, maintenance, or unavoidable circumstances. Advance notice will be provided whenever possible.
            </p>

            <h3>5. Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Gayaji, Bihar.
            </p>

            <h3>6. Contact Information</h3>
            <p>
              For any queries regarding these Terms, please contact us at:
            </p>
            <p>
              <strong>The Grand Fitness</strong><br />
              Khanjahanpur, Manpur, Gayaji 823003<br />
              Email: amtechnology367@gmail.com<br />
              Phone: 9608431400
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
