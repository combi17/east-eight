import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import { Phone, Mail, MapPin, Linkedin, Instagram, CircleCheck } from 'lucide-react';
import './Contact.css';
import { AGENCY, AGENT } from '../data/agency';

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || 'xeopkkpk';

const SUBJECTS = ['Cerere ofertă', 'Cerere vizionare', 'Evaluare proprietate', 'Alt subiect'];

const Contact = () => {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const [searchParams] = useSearchParams();

  const requestedSubject = searchParams.get('subject');
  const defaultSubject = SUBJECTS.includes(requestedSubject) ? requestedSubject : '';
  const property = searchParams.get('property');
  const defaultMessage = property ? `Bună ziua, aș dori mai multe detalii despre „${property}”.` : '';

  return (
    <div className="contact-page-container">
      <section className="contact-hero" style={{ backgroundImage: 'url(/listings/mendeleev/2.jpg)' }}>
        <div className="contact-hero-overlay" />
        <div className="container contact-hero-text">
          <h1>Hai să vorbim despre proprietatea ta</h1>
          <p>Cumperi, vinzi sau cauți un spațiu de închiriat? Scrie-ne și revenim cu un răspuns în cel mai scurt timp.</p>
        </div>
      </section>

      <div className="container">
        <div className="contact-content-grid">
          <div className="contact-form-wrapper">
            <h2>Trimite-ne un mesaj</h2>
            <p>Toate câmpurile sunt obligatorii, cu excepția telefonului.</p>

            {state.succeeded ? (
              <div className="form-status success" role="status">
                <CircleCheck size={22} />
                <div>
                  <strong>Mulțumim, mesajul a fost trimis.</strong>
                  <span>Te contactăm la adresa de email indicată.</span>
                </div>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nume</label>
                    <input type="text" id="name" name="name" autoComplete="name" placeholder="Ion Popescu" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" autoComplete="email" placeholder="ion.popescu@gmail.com" required />
                    <ValidationError prefix="Email" field="email" errors={state.errors} className="field-error" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Telefon (opțional)</label>
                    <input type="tel" id="phone" name="phone" autoComplete="tel" placeholder="0712 345 678" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subiect</label>
                    <select id="subject" name="subject" defaultValue={defaultSubject} required>
                      <option value="" disabled hidden>Alege un subiect</option>
                      {SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Mesaj</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    defaultValue={defaultMessage}
                    placeholder="Ce fel de proprietate cauți, în ce zonă și în ce buget?"
                    required
                  />
                </div>

                <label className="consent-checkbox">
                  <input type="checkbox" name="consent" value="da" required />
                  <span>
                    Sunt de acord cu prelucrarea datelor conform{' '}
                    <Link to="/confidentialitate">politicii de confidențialitate</Link>.
                  </span>
                </label>

                <button type="submit" className="submit-btn" disabled={state.submitting}>
                  {state.submitting ? 'Se trimite...' : 'Trimite mesajul'}
                </button>

                {state.errors && (
                  <div className="form-status error" role="alert">
                    Mesajul nu a putut fi trimis. Încearcă din nou sau scrie-ne direct la {AGENCY.email}.
                  </div>
                )}
              </form>
            )}
          </div>

          <aside className="contact-info-wrapper">
            <div className="agent-contact-card">
              <img src={AGENT.photo} alt={AGENT.name} className="agent-photo" />
              <div className="agent-contact-body">
                <h3>{AGENT.name}</h3>
                <p>{AGENT.experience}</p>
                <div className="agent-socials">
                  <a href={AGENT.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={`${AGENT.name} pe LinkedIn`}>
                    <Linkedin size={20} />
                  </a>
                  <a href={AGENT.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={`${AGENT.name} pe Instagram`}>
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="info-item">
                <div className="info-icon"><Phone size={20} /></div>
                <div className="info-text">
                  <h4>Telefon</h4>
                  <a href={AGENCY.phoneHref}>{AGENCY.phone}</a>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div className="info-text">
                  <h4>Email</h4>
                  <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><MapPin size={20} /></div>
                <div className="info-text">
                  <h4>Sediu</h4>
                  <p>{AGENCY.address}</p>
                </div>
              </div>
            </div>

            <figure className="contact-office-photo">
              <img src="/listings/mendeleev/6.jpg" alt="Recepția unei clădiri de birouri clasa A din portofoliul East8" loading="lazy" />
            </figure>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;
