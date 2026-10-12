import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { AGENCY } from '../data/agency';
import './Footer.css';

const SERVICES = [
  { label: 'Închiriere birouri', to: '/properties?propertyType=Birou&transactionType=Inchiriere' },
  { label: 'Vânzare apartamente', to: '/properties?propertyType=Apartament&transactionType=Vanzare' },
  { label: 'Proprietăți în Dubai', to: '/properties?city=Dubai' },
  { label: 'Evaluări proprietăți', to: '/contact?subject=Evaluare proprietate' },
];

const ZONES = [
  { label: 'Sector 1', to: '/properties?zone=Sector 1' },
  { label: 'Sector 2', to: '/properties?zone=Sector 2' },
  { label: 'Floreasca', to: '/properties?zone=Floreasca' },
  { label: 'Băneasa', to: '/properties?zone=Baneasa' },
];

const Footer = () => (
  <footer>
    <div className="footer-container">
      <div className="footer-section">
        <h3>{AGENCY.name}</h3>
        <p>Consultanță imobiliară pentru birouri, spații comerciale și locuințe premium, din {AGENCY.since}.</p>
      </div>
      <div className="footer-section" role="navigation" aria-label="Servicii">
        <h3>Servicii</h3>
        {SERVICES.map((item) => (
          <Link key={item.label} to={item.to}>{item.label}</Link>
        ))}
      </div>
      <div className="footer-section" role="navigation" aria-label="Zone deservite">
        <h3>Zone deservite</h3>
        {ZONES.map((item) => (
          <Link key={item.label} to={item.to}>{item.label}</Link>
        ))}
      </div>
      <div className="footer-section">
        <h3>Contact</h3>
        <a className="footer-contact-line" href={AGENCY.phoneHref}><Phone size={16} />{AGENCY.phone}</a>
        <a className="footer-contact-line" href={`mailto:${AGENCY.email}`}><Mail size={16} />{AGENCY.email}</a>
        <p className="footer-contact-line"><MapPin size={16} />{AGENCY.address}</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>
        &copy; {new Date().getFullYear()} {AGENCY.legalName}. Toate drepturile rezervate.{' '}
        <Link to="/confidentialitate">Confidențialitate și termeni</Link>
      </p>
    </div>
  </footer>
);

export default Footer;
