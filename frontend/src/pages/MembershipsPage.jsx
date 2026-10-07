import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../hooks/useData';
import { fetchJson } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { membershipFaqs } from '../data/memberships';
import FaqAccordion from '../components/FaqAccordion';
import './MembershipsPage.css';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function MembershipsPage() {
  const { data: membershipPlans, loading, error } = useData('/memberships');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubscribe = (plan, cycle) => {
    navigate(`/contact?interest=plan&plan=${plan.id}&cycle=${cycle}`);
  };

  return (
    <main className="memberships-page" style={{ paddingTop: '68px' }}>

      {/* Hero */}
      <section className="mem-hero section-pad">
        <div className="container">
          <p className="page-eyebrow">Training Plans</p>
          <h1>Membership</h1>
          <p className="mem-intro">
            Three membership options, each designed around a different level of access and commitment.
          </p>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="mem-plans-section section-pad">
        <div className="container">
          <p className="duration-note" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            Compare our commitment lengths below. Choose the billing cycle that fits your goals.
          </p>

          {loading && <p>Loading membership plans...</p>}
          {error && <p>Failed to load memberships: {error}</p>}

          {/* Desktop Table View */}
          {!loading && membershipPlans && (
            <div className="pricing-table-wrap" aria-label="Membership plans pricing table">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '30%' }}>Membership Tier</th>
                    <th scope="col">Monthly</th>
                    <th scope="col">Quarterly</th>
                    <th scope="col">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {membershipPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="tier-info-cell">
                        <h2 className="tier-title">{plan.name}</h2>
                        <p className="tier-desc">{plan.description}</p>
                        <ul className="plan-inclusions-list">
                          {(plan.inclusions || []).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="price-cell">
                        <div className="price-cell-content">
                          <div className="price-primary" aria-describedby="gst-note">
                            {formatCurrency(plan.prices.monthly)}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                          </div>
                          <div className="price-secondary">billed {formatCurrency(plan.prices.monthly)} every month</div>
                          <button onClick={() => handleSubscribe(plan, 'monthly')} className="btn btn--secondary btn--sm">Enquire Now</button>
                        </div>
                      </td>
                      <td className="price-cell">
                        <div className="price-cell-content">
                          <div className="price-primary" aria-describedby="gst-note">
                            {formatCurrency(Math.round(plan.prices.quarterly / 3))}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                          </div>
                          <div className="price-secondary">billed {formatCurrency(plan.prices.quarterly)} every 3 months</div>
                          <button onClick={() => handleSubscribe(plan, 'quarterly')} className="btn btn--secondary btn--sm">Enquire Now</button>
                        </div>
                      </td>
                      <td className="price-cell">
                        <div className="price-cell-content">
                          <div className="price-primary" aria-describedby="gst-note">
                            {formatCurrency(Math.round(plan.prices.annual / 12))}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                          </div>
                          <div className="price-secondary">billed {formatCurrency(plan.prices.annual)} yearly</div>
                          <button onClick={() => handleSubscribe(plan, 'annual')} className="btn btn--secondary btn--sm">Enquire Now</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Stacked Cards View */}
          {!loading && membershipPlans && (
            <div className="pricing-mobile-cards" aria-label="Mobile membership pricing cards">
              {membershipPlans.map((plan) => (
                <div key={plan.id} className="pricing-mobile-card">
                  <div className="pricing-mobile-header">
                    <h2 className="tier-title">{plan.name}</h2>
                    <p className="tier-desc">{plan.description}</p>
                    <ul className="plan-inclusions-list">
                      {(plan.inclusions || []).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pricing-options-list">
                    <div className="pricing-option">
                      <div className="pricing-option-info">
                        <strong>Monthly</strong>
                        <div className="price-primary" aria-describedby="gst-note">
                          {formatCurrency(plan.prices.monthly)}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                        </div>
                        <div className="price-secondary">billed {formatCurrency(plan.prices.monthly)} every month</div>
                      </div>
                      <button onClick={() => handleSubscribe(plan, 'monthly')} className="btn btn--secondary btn--sm">Enquire Now</button>
                    </div>
                    <div className="pricing-option">
                      <div className="pricing-option-info">
                        <strong>Quarterly</strong>
                        <div className="price-primary" aria-describedby="gst-note">
                          {formatCurrency(Math.round(plan.prices.quarterly / 3))}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                        </div>
                        <div className="price-secondary">billed {formatCurrency(plan.prices.quarterly)} every 3 months</div>
                      </div>
                      <button onClick={() => handleSubscribe(plan, 'quarterly')} className="btn btn--secondary btn--sm">Enquire Now</button>
                    </div>
                    <div className="pricing-option">
                      <div className="pricing-option-info">
                        <strong>Annual</strong>
                        <div className="price-primary" aria-describedby="gst-note">
                          {formatCurrency(Math.round(plan.prices.annual / 12))}/mo<span aria-hidden="true" style={{ fontSize: '0.6em', verticalAlign: 'super' }}>*</span>
                        </div>
                        <div className="price-secondary">billed {formatCurrency(plan.prices.annual)} yearly</div>
                      </div>
                      <button onClick={() => handleSubscribe(plan, 'annual')} className="btn btn--secondary btn--sm">Enquire Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GST Disclaimer Footnote */}
          <p id="gst-note" className="duration-note" style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
            *Prices shown are exclusive of GST. GST will be added at the time of payment.
          </p>

        </div>
      </section>

      {/* Comparison Section (Feature Table) */}
      <section className="mem-comparison section-pad">
        <div className="container">
          <h2>Feature Comparison</h2>
          
          {/* Desktop Table View */}
          {!loading && membershipPlans &&
          <div className="comparison-table-wrap" aria-label="Desktop membership plan comparison table">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Inclusion</th>
                    {membershipPlans.map((p) =>
                  <th key={p.id} scope="col">{p.name}</th>
                  )}
                  </tr>
                </thead>
                <tbody>
                  {[
                { label: 'Gym floor access', vals: [true, true, true] },
                { label: 'Extended hours', vals: [false, true, true] },
                { label: '24/7 access', vals: [false, false, true] },
                { label: 'Group classes', vals: [false, true, true] },
                { label: 'PT sessions', vals: [false, false, true] },
                { label: 'Priority booking', vals: [false, false, true] },
                { label: 'Towel service', vals: [false, true, true] },
                { label: 'Recovery suite', vals: [false, false, true] },
                { label: 'Nutrition review', vals: [false, false, true] }].
                map((row) =>
                <tr key={row.label}>
                      <td>{row.label}</td>
                      {row.vals.map((v, i) =>
                  <td key={i} aria-label={v ? 'Included' : 'Not included'}>
                          {v ?
                    <span className="check" aria-hidden="true">✓</span> :

                    <span className="dash" aria-hidden="true">—</span>
                    }
                        </td>
                  )}
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }

          {/* Mobile Stacked Cards View (No horizontal scrolling on 375px) */}
          {!loading && membershipPlans &&
          <div className="comparison-mobile-cards" aria-label="Mobile membership plan comparison cards">
              {membershipPlans.map((plan, planIdx) => {
              const features = [
              { label: 'Gym floor access', val: true },
              { label: 'Extended hours', val: planIdx >= 1 },
              { label: '24/7 access', val: planIdx >= 2 },
              { label: 'Group classes', val: planIdx >= 1 },
              { label: 'PT sessions', val: planIdx >= 2 },
              { label: 'Priority booking', val: planIdx >= 2 },
              { label: 'Towel service', val: planIdx >= 1 },
              { label: 'Recovery suite', val: planIdx >= 2 },
              { label: 'Nutrition review', val: planIdx >= 2 }];

              return (
                <div key={plan.id} className="comp-mobile-card">
                    <div className="comp-mobile-card-header">
                      <h3>{plan.name}</h3>
                    </div>
                    <ul className="comp-mobile-feature-list">
                      {features.map((f, i) =>
                    <li key={i} className={f.val ? 'feature-included' : 'feature-excluded'}>
                          <span className="feature-icon">{f.val ? '✓' : '—'}</span>
                          <span className="feature-name">{f.label}</span>
                        </li>
                    )}
                    </ul>
                  </div>);

            })}
            </div>
          }

        </div>
      </section>

      {/* FAQ */}
      <section className="mem-faq section-pad">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <FaqAccordion items={membershipFaqs} />
        </div>
      </section>

    </main>);
}