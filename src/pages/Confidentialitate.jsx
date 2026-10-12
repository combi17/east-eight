import React from 'react';
import { Link } from 'react-router-dom';
import './Confidentialitate.css';
import { AGENCY } from '../data/agency';

const SECTIONS = [
  { id: 'gdpr', label: 'Prelucrarea datelor' },
  { id: 'cookies', label: 'Cookie-uri' },
  { id: 'termeni', label: 'Termeni și condiții' },
];

const Confidentialitate = () => (
  <div className="legal-page">
    <div className="legal-container">
      <h1>Confidențialitate și termeni</h1>
      <p className="legal-lead">
        Cum folosim datele pe care ni le trimiți și regulile de utilizare ale site-ului {AGENCY.name}.
      </p>

      <nav className="legal-toc" aria-label="Cuprins">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>{section.label}</a>
        ))}
      </nav>

      <section id="gdpr">
        <h2>Prelucrarea datelor cu caracter personal</h2>
        <p>
          Site-ul este administrat de {AGENCY.legalName}, cu sediul în {AGENCY.address}. Prelucrăm datele în
          conformitate cu Regulamentul (UE) 2016/679 (GDPR) și cu legislația aplicabilă în România.
        </p>

        <h3>Ce date colectăm</h3>
        <ul>
          <li>Datele pe care ni le trimiți prin formularul de contact, telefon sau email: nume, telefon, adresă de email și conținutul mesajului.</li>
          <li>Adresa IP, înregistrată automat la vizitarea site-ului. Nu o folosim pentru a te identifica.</li>
        </ul>
        <p>Nu colectăm date din categorii speciale și nu prelucrăm intenționat date ale minorilor sub 16 ani.</p>

        <h3>De ce le folosim</h3>
        <ul>
          <li>Pentru a-ți trimite oferte imobiliare și a răspunde solicitărilor tale.</li>
          <li>Pentru negocierea și redactarea contractelor de vânzare sau închiriere.</li>
          <li>Pentru comunicări de marketing, doar cu acordul tău, pe care îl poți retrage oricând.</li>
          <li>Pentru protejarea site-ului și prevenirea fraudelor, în baza interesului nostru legitim.</li>
        </ul>

        <h3>Cât timp le păstrăm</h3>
        <p>
          Păstrăm datele cât este necesar pentru scopurile de mai sus, dar nu mai mult de 5 ani de la ultima
          interacțiune cu noi. Datele de pe facturi se păstrează 10 ani, conform legii.
        </p>

        <h3>Drepturile tale</h3>
        <p>
          Ai dreptul de acces, rectificare, ștergere, restricționare, portabilitate și opoziție, precum și dreptul de
          a depune o plângere la ANSPDCP. Pentru orice solicitare, scrie-ne la{' '}
          <a href={`mailto:${AGENCY.privacyEmail}`}>{AGENCY.privacyEmail}</a>.
        </p>
      </section>

      <section id="cookies">
        <h2>Cookie-uri</h2>
        <p>
          Site-ul folosește doar cookie-urile necesare funcționării (de exemplu, limba aleasă) și cele setate de
          serviciile integrate: harta interactivă și formularul de contact. Poți șterge sau bloca cookie-urile din
          setările browserului.
        </p>
      </section>

      <section id="termeni">
        <h2>Termeni și condiții</h2>
        <ul>
          <li>Anunțurile au caracter informativ și nu constituie o ofertă fermă. Prețurile și disponibilitatea se confirmă de un consultant.</li>
          <li>Fotografiile și descrierile aparțin {AGENCY.name} sau proprietarilor și nu pot fi preluate fără acord scris.</li>
          <li>Trimiterea formularului de contact nu creează o obligație contractuală pentru niciuna dintre părți.</li>
          <li>Ne rezervăm dreptul de a actualiza acești termeni; versiunea curentă este cea publicată pe această pagină.</li>
        </ul>
        <p>
          Întrebări? <Link to="/contact">Contactează-ne</Link> sau scrie la{' '}
          <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>.
        </p>
      </section>
    </div>
  </div>
);

export default Confidentialitate;
