import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Building, Trophy, TrendingUp, X, MapPin } from 'lucide-react';
import './Despre.css';
import heroImage from '../assets/birou2.jpg';
import birouImg from '../assets/birou.jpg';
import apartImg from '../assets/apart1.jpg';
import houseImg from '../assets/house1.webp';
import birou3Img from '../assets/birou3.jpg';
import { AGENT } from '../data/agency';

const milestones = [
  {
    year: '2004',
    title: 'Primele proiecte de birouri',
    description: 'Consultanții Premium East8 încep să lucreze pe segmentul de birouri și spații comerciale din București.',
    icon: <Building size={20} />
  },
  {
    year: '2020',
    title: 'Pionierat în Tranzacții "Green"',
    description: 'Am devenit prima agenție de nișă care a facilitat tranzacții exclusiv pentru clădiri de birouri cu certificare BREEAM Outstanding.',
    icon: <TrendingUp size={20} />
  },
  {
    year: '2022',
    title: 'Extinderea Echipei și Parteneriate',
    description: 'Ne-am dublat echipa de consultanți seniori și am format alianțe cheie cu fonduri de investiții internaționale.',
    icon: <Briefcase size={20} />
  },
  {
    year: '2023',
    title: 'Tranzacție Record în Sectorul 1',
    description: 'Intermedierea cu succes a vânzării unei clădiri de birouri de 10.000 mp, stabilind un nou record pe piața din nordul capitalei.',
    icon: <Trophy size={20} />
  }
];

const testimonials = [
    {
        quote: "Serviciile East8 au depășit așteptările. Am obținut o vânzare rapidă la un preț pe care nu ne așteptam să-l atingem. Recomandăm cu încredere.",
        author: "Andrei P.",
        location: "Investitor Imobiliar, Nordul Bucureștiului"
    },
    {
        quote: "Transparența și cunoașterea pieței de către Elena Miu au fost esențiale. Am găsit proprietatea perfectă pentru birourile noastre.",
        author: "Maria S.",
        location: "CEO Tech Solutions, Zona Centrală"
    },
    {
        quote: "Pentru mine, factorul decisiv a fost încrederea. East8 livrează nu doar tranzacții, ci și parteneriate pe termen lung.",
        author: "Alex V.",
        location: "Client Rezidențial, Băneasa"
    }
];

const tranzactii = [
  {
    id: 1,
    title: 'Clădire Birouri Clasa A',
    location: 'Pipera, București',
    description: 'Tranzacție de închiriere pe 10 ani pentru 15.000 mp de spații de birouri moderne, consolidând polul de business din nordul capitalei.',
    image: birouImg
  },
  {
    id: 2,
    title: 'Portofoliu Rezidențial',
    location: 'Băneasa, București',
    description: 'Vânzare a unui pachet de 50 de apartamente de lux într-un complex rezidențial premium, destinată unui fond de investiții internațional.',
    image: apartImg
  },
  {
    id: 3,
    title: 'Vilă Monument Istoric',
    location: 'Zona Aviatorilor, București',
    description: 'Consultanță și intermediere în vânzarea unei proprietăți unice, o vilă monument istoric ce necesită restaurare, preluată de un colecționar privat.',
    image: houseImg
  },
  {
    id: 4,
    title: 'Spațiu Industrial / Logistic',
    location: 'A1, km 23',
    description: 'Închiriere a 20.000 mp de spațiu de depozitare și logistică de ultimă generație pentru o companie de e-commerce de top.',
    image: birou3Img
  }
];

const TimelineItem = ({ item, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const alignment = index % 2 === 0 ? 'left' : 'right';

  return (
    <div 
      className={`timeline-item-container ${alignment} reveal ${inView ? 'is-visible' : ''}`}
      ref={ref}
    >
      <div className="timeline-icon-wrapper">
        <div className="timeline-icon">{item.icon}</div>
      </div>
      <div className="timeline-content">
        <span className="timeline-year">{item.year}</span>
        <h3 className="timeline-title">{item.title}</h3>
        <p className="timeline-description">{item.description}</p>
      </div>
    </div>
  );
};

const TranzactieModal = ({ data, onClose }) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={data.title} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" aria-label="Închide" onClick={onClose}>
          <X size={24} />
        </button>
        <img src={data.image} alt={data.title} className="modal-image" />
        <div className="modal-body">
          <h2 className="modal-title">{data.title}</h2>
          <div className="modal-location">
            <MapPin size={16} /> {data.location}
          </div>
          <p className="modal-description">{data.description}</p>
          <Link to="/contact?subject=Cerere ofertă" className="modal-cta-btn">Discută cu un consultant</Link>
        </div>
      </div>
    </div>
  );
};

const Despre = () => {
  const { t } = useTranslation();
  const [modalData, setModalData] = useState(null);

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const { ref: tranzactiiRef, inView: tranzactiiInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0];
    return names[0][0] + names[names.length - 1][0];
  };

  const handleCloseModal = () => setModalData(null);

  return (
    <div className="despre-page-container">
      <div className="despre-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="despre-hero-overlay"></div>
        
        <div className="container">
          <h1 className="despre-title reveal-on-load">{t('despre.hero.titlu')}</h1>
          <p className="despre-subtitle reveal-on-load reveal-delay-1">
            {t('despre.hero.subtitlu')}
          </p>
        </div>

        <div className="hero-content-overlay">
          <div className="viziune-container">
            <div 
              className="despre-section-text-card reveal-on-load reveal-delay-2"
            >
              <h2>{t('despre.viziune.titlu')}</h2>
              <p>{t('despre.viziune.text')}</p>
            </div>
            <div 
              className="despre-section-image-wrapper reveal-on-load reveal-delay-3"
            >
              <img src={AGENT.photo} alt={`${AGENT.name}, ${AGENT.role}`} className="despre-section-image" />
            </div>
          </div>
        </div>
      </div> 

      <div className="container">
        <div className="despre-section milestones-section">
          <h2 className="section-title">{t('despre.timeline.titlu')}</h2>
          <div className="timeline">
            {milestones.map((item, index) => (
              <TimelineItem item={item} index={index} key={index} />
            ))}
          </div>
        </div>
        
        <div 
          className={`despre-section testimonials-section reveal ${testimonialsInView ? 'is-visible' : ''}`}
          ref={testimonialsRef}
        >
          <h2 className="section-title">Ce spun clienții noștri</h2>
          <div className="testimonials-grid">
            {testimonials.map((item, index) => (
              <div className="testimonial-card" key={index}>
                <div className="testimonial-avatar">
                  {getInitials(item.author)}
                </div>
                <p className="testimonial-quote">"{item.quote}"</p>
                <div className="testimonial-author-info">
                  <span className="author-name">{item.author}</span>
                  <span className="author-location">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div 
          className="despre-section tranzactii-section"
          ref={tranzactiiRef}
        >
          <h2 className="section-title">Cele mai importante tranzacții</h2>
          <div className={`tranzactii-grid reveal ${tranzactiiInView ? 'is-visible' : ''}`}>
            {tranzactii.map((item) => (
              <button
                type="button"
                className="tranzactie-card"
                key={item.id}
                style={{ backgroundImage: `url(${item.image})` }}
                onClick={() => setModalData(item)}
              >
                <div className="tranzactie-card-overlay"></div>
                <div className="tranzactie-card-content">
                  <h3>{item.title}</h3>
                  <p><MapPin size={14} /> {item.location}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        
      </div> 
      {modalData && <TranzactieModal data={modalData} onClose={handleCloseModal} />}
    </div> 
  );
};

export default Despre;