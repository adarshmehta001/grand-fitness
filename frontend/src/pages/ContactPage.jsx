import { useState, useEffect, useId } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { fetchJson } from '../lib/api';
import { gymConfig } from '../config/gym';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './ContactPage.css';










export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({});

  // Pre-fill from query params
  const qInterest = searchParams.get('interest') || '';
  const qPlan = searchParams.get('plan') || '';
  const qClass = searchParams.get('class') || '';
  const qProgram = searchParams.get('program') || '';

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [interest, setInterest] = useState(qInterest || '');
  const [subSelection, setSubSelection] = useState('');
  const [message, setMessage] = useState('');
  const [requestTrial, setRequestTrial] = useState(false);

  // Fetch lists for the sub-options dropdown
  const { data: programsList } = useData('/programs');
  const { data: plansList } = useData('/memberships');
  const { data: classesList } = useData('/schedule');

  const nameId = useId();
  const contactId = useId();
  const interestId = useId();
  const subId = useId();
  const messageId = useId();
  const trialId = useId();

  // Populate subSelection from URL params
  useEffect(() => {
    if (qPlan) setSubSelection(qPlan);
    if (qClass) setSubSelection(qClass);
    if (qProgram) setSubSelection(qProgram);
  }, [qPlan, qClass, qProgram]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!contactInfo.trim()) newErrors.contact = 'Please provide an email address or phone number.';
    if (!interest) newErrors.interest = 'Please select an area of interest.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      let mappedInterest = interest;
      if (interest === 'plan') mappedInterest = 'membership';
      if (interest === 'trial' || interest === 'trainer') mappedInterest = 'general';

      const finalMessage = `
${interest === 'trial' ? 'Requesting a Trial Visit.\n' : ''}${interest === 'trainer' ? 'Interested in a Trainer.\n' : ''}${requestTrial ? 'Also requested a trial visit.\n' : ''}${message}`.trim() || 'No message provided.';

      await fetchJson('/enquiries', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email: contactInfo.includes('@') ? contactInfo : 'no-email@example.com',
          phone: contactInfo,
          interestType: mappedInterest,
          interestRefId: subSelection,
          message: finalMessage
        })
      });
      setSubmitted(true);
    } catch (err) {
      if (err.status === 429) {
        setApiError('Too many enquiries submitted recently. Please try again later.');
      } else {
        setApiError(`Failed to submit enquiry: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubOptions = () => {
    switch (interest) {
      case 'program':return (programsList || []).map((p) => ({ value: p.id, label: p.title }));
      case 'plan':return (plansList || []).map((p) => ({ value: p.id, label: `${p.name} Membership` }));
      case 'class':return (classesList || []).map((c) => ({ value: c.id, label: `${c.title} (${c.day} ${c.startTime})` }));
      default:return [];
    }
  };

  const subOptions = getSubOptions();

  return (
    <main className="contact-page" style={{ paddingTop: '68px' }}>

      <section className="contact-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">Get in touch</p>
          <h1>Contact & Enquiry</h1>
          <p className="contact-intro">
            Use the form to ask about memberships, programs, classes, or anything else.
          </p>
        </div>
      </section>

      <section className="contact-content section-pad">
        <div className="container">
          <div className="contact-grid">

            {/* Form */}
            <div className="contact-form-wrap">


              {submitted ?
              <div className="contact-success" role="alert">
                  <div className="success-icon" aria-hidden="true">✓</div>
                  <h2>Thanks — we've received your enquiry and will be in touch soon.</h2>
                  <p>Your enquiry has been submitted successfully.</p>
                  <button
                  className="btn btn--secondary btn--md"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setContactInfo('');
                    setInterest('');
                    setSubSelection('');
                    setMessage('');
                    setRequestTrial(false);
                    setErrors({});
                    setApiError('');
                  }}>
                  
                    Submit another enquiry
                  </button>
                </div> :

              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Enquiry form">
                
                  {apiError &&
                <div className="form-error-banner" role="alert">
                      {apiError}
                    </div>
                }

                  {/* Name */}
                  <div className="form-field">
                    <label htmlFor={nameId} className="form-label">
                      Your name <span aria-hidden="true">*</span>
                    </label>
                    <input
                    id={nameId}
                    type="text"
                    className={`form-input${errors.name ? ' form-input--error' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={errors.name ? `${nameId}-error` : undefined}
                    aria-invalid={!!errors.name}
                    disabled={isSubmitting} />
                  
                    {errors.name &&
                  <p id={`${nameId}-error`} className="form-error" role="alert">{errors.name}</p>
                  }
                  </div>

                  {/* Email / Phone */}
                  <div className="form-field">
                    <label htmlFor={contactId} className="form-label">
                      Email address or phone number <span aria-hidden="true">*</span>
                    </label>
                    <input
                    id={contactId}
                    type="text"
                    className={`form-input${errors.contact ? ' form-input--error' : ''}`}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    autoComplete="email"
                    aria-required="true"
                    aria-describedby={errors.contact ? `${contactId}-error` : undefined}
                    aria-invalid={!!errors.contact}
                    disabled={isSubmitting} />
                  
                    {errors.contact &&
                  <p id={`${contactId}-error`} className="form-error" role="alert">{errors.contact}</p>
                  }
                  </div>

                  {/* Interest */}
                  <div className="form-field">
                    <label htmlFor={interestId} className="form-label">
                      Area of interest <span aria-hidden="true">*</span>
                    </label>
                    <select
                    id={interestId}
                    className={`form-select${errors.interest ? ' form-input--error' : ''}`}
                    value={interest}
                    onChange={(e) => {
                      setInterest(e.target.value);
                      setSubSelection('');
                    }}
                    aria-required="true"
                    aria-describedby={errors.interest ? `${interestId}-error` : undefined}
                    aria-invalid={!!errors.interest}
                    disabled={isSubmitting}>
                    
                      <option value="">Select an option</option>
                      <option value="general">General enquiry</option>
                      <option value="program">A specific program</option>
                      <option value="plan">A membership plan</option>
                      <option value="class">A specific class</option>
                      <option value="trainer">Working with a trainer</option>
                      {gymConfig.trialRequestEnabled &&
                    <option value="trial">Trial visit</option>
                    }
                    </select>
                    {errors.interest &&
                  <p id={`${interestId}-error`} className="form-error" role="alert">{errors.interest}</p>
                  }
                  </div>

                  {/* Sub-selection */}
                  {subOptions.length > 0 &&
                <div className="form-field">
                      <label htmlFor={subId} className="form-label">
                        {interest === 'program' ? 'Which program?' :
                    interest === 'plan' ? 'Which plan?' :
                    'Which class?'}
                      </label>
                      <select
                    id={subId}
                    className="form-select"
                    value={subSelection}
                    onChange={(e) => setSubSelection(e.target.value)}
                    disabled={isSubmitting}>
                    
                        <option value="">Select (optional)</option>
                        {subOptions.map((opt) =>
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                      </select>
                    </div>
                }

                  {/* Trial fields */}
                  {gymConfig.trialRequestEnabled &&
                <div className="form-field form-field--check">
                      <input
                    id={trialId}
                    type="checkbox"
                    className="form-checkbox"
                    checked={requestTrial}
                    onChange={(e) => setRequestTrial(e.target.checked)}
                    disabled={isSubmitting} />
                  
                      <label htmlFor={trialId} className="form-check-label">
                        I'd like to request a trial visit
                      </label>
                    </div>
                }

                  {/* Message */}
                  <div className="form-field">
                    <label htmlFor={messageId} className="form-label">
                      Message (optional)
                    </label>
                    <textarea
                    id={messageId}
                    className="form-textarea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Any additional context or questions..."
                    disabled={isSubmitting} />
                  
                  </div>

                  <button type="submit" className="btn btn--primary btn--lg contact-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>

                </form>
              }
            </div>

            {/* Sidebar info */}
            <aside className="contact-info" aria-label="Contact information">
              <div className="contact-info-section">
                <h2 className="contact-info-heading">Visit Us</h2>
                <address className="contact-address">
                  <div className="contact-info-item">
                    <MapPin size={16} aria-hidden="true" />
                    <span>{gymConfig.contact.address}</span>
                  </div>
                  <div className="contact-info-item">
                    <Phone size={16} aria-hidden="true" />
                    <a href={`tel:${gymConfig.contact.phone}`}>{gymConfig.contact.phone}</a>
                  </div>
                  <div className="contact-info-item">
                    <Mail size={16} aria-hidden="true" />
                    <a href={`mailto:${gymConfig.contact.email}`}>{gymConfig.contact.email}</a>
                  </div>
                  <div className="contact-info-item">
                    <Clock size={16} aria-hidden="true" />
                    <span>{gymConfig.contact.hours}</span>
                  </div>
                </address>
              </div>

              {/* Map embed */}
              <div className="map-placeholder" aria-label="Location Map" style={{ padding: 0, border: 'none' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1076.6134896059236!2d85.0367402263522!3d24.820038421095294!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f329f0e95b9e8d%3A0x8e0c6874fe4b343d!2sThe%20Grand%20Library!5e0!3m2!1sen!2sus!4v1790938415682!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px', display: 'block', borderRadius: 'inherit' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Gym Location"
                ></iframe>
              </div>
            </aside>

          </div>
        </div>
      </section>

    </main>);

}