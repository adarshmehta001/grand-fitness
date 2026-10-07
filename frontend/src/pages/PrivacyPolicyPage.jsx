import { useEffect } from 'react';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | The Grand Fitness';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="legal-page" style={{ paddingTop: '68px', paddingBottom: 'var(--space-12)' }}>
      <section className="section-pad">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p className="page-eyebrow">Legal</p>
          <h1>Privacy Policy</h1>
          <div className="legal-content" style={{ marginTop: 'var(--space-6)' }}>
            <p><strong>Effective Date: October 2026</strong></p>
            <p>
              The Grand Fitness ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.
            </p>
            
            <h3>1. Information We Collect</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register at the gym, express an interest in obtaining information about us, or otherwise contact us. This includes:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Name, phone number, email address, and physical address.</li>
              <li><strong>Health Data:</strong> Basic fitness goals, emergency contact information, and relevant medical history necessary for training safely.</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the information we collect or receive:
            </p>
            <ul>
              <li>To manage your membership and process payments.</li>
              <li>To communicate with you regarding schedule changes, gym updates, and promotional offers.</li>
              <li>To ensure your safety and provide personalized training programs.</li>
              <li>To respond to your inquiries and offer customer support.</li>
            </ul>

            <h3>3. Disclosure of Your Information</h3>
            <p>
              We do not sell, trade, or rent your personal identification information to others. We may share your information only with trusted third-party service providers (such as payment processors) necessary to operate our business, or when required by law to comply with legal processes in India.
            </p>

            <h3>4. Data Security</h3>
            <p>
              We implement reasonable administrative, technical, and physical security measures to protect your personal information. However, please understand that no transmission of data over the internet or any wireless network can be guaranteed to be 100% secure.
            </p>

            <h3>5. Contact Us</h3>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
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
