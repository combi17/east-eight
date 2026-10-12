import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, ArrowRight } from 'lucide-react';
import './DubaiSection.css';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { fetchPropertiesByCity, formatPrice } from '../lib/properties';

const DubaiSection = () => {
  const titleRef = useScrollAnimation(0);
  const subtitleRef = useScrollAnimation(90);
  const bannerRef = useScrollAnimation(0);

  const card1Ref = useScrollAnimation(0);
  const card2Ref = useScrollAnimation(100);
  const card3Ref = useScrollAnimation(200);

  const cardRefs = [card1Ref, card2Ref, card3Ref];

  const [dubaiProperties, setDubaiProperties] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchPropertiesByCity('Dubai', 3)
      .then((data) => {
        if (!cancelled) setDubaiProperties(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (dubaiProperties.length === 0) return null;

  return (
    <section className="dubai-section">
      <div className="dubai-container">
        <div className="dubai-header">
          <div className="dubai-header-content">
            <h2 className="dubai-title" ref={titleRef}>
              Descoperă Proprietăți Premium în Dubai
            </h2>
            <p className="dubai-subtitle" ref={subtitleRef}>
              Investește în una dintre cele mai dinamice piețe imobiliare din lume. 
              Proprietăți de lux cu randamente excepționale.
            </p>
          </div>
          <Link to="/properties?city=Dubai" className="dubai-view-all">
            Vezi toate proprietățile
            <ArrowRight size={20} />
          </Link>
        </div>

        <div className="dubai-properties-grid">
          {dubaiProperties.map((property, index) => {
            const { price, suffix } = formatPrice(property);

            return (            
            <Link 
              key={property.id} 
              to={`/properties/${property.id}`}
              className="dubai-property-card"
              ref={cardRefs[index]}
            >
              <div className="dubai-card-image-wrapper">
                <img 
                  src={property.image_urls[0]} 
                  alt={property.name}
                  loading="lazy"
                  className="dubai-card-image"
                />
                <div className="dubai-card-overlay">
                  <div className="dubai-location-badge">
                    <img src="https://flagcdn.com/16x12/ae.png" alt="" className="flag-icon" /> Dubai, UAE
                  </div>
                </div>
              </div>
              
              <div className="dubai-card-content">
                <h3 className="dubai-card-title">{property.name}</h3>
                
                <div className="dubai-card-location">
                  <MapPin size={14} />
                  <span>{property.address}</span>
                </div>

                <div className="dubai-card-footer">
                  <div className="dubai-card-details">
                    <span><Home size={14} /> {property.rooms} camere</span>
                    <span>{property.size} mp</span>
                  </div>
                  <div className="dubai-card-price">
                    {price}
                    {suffix && <span className="price-suffix">{suffix}</span>}
                  </div>
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        <div className="dubai-cta-banner" ref={bannerRef}>
          <div className="dubai-cta-content">
            <h3>Interesat de investiții internaționale?</h3>
            <p>Echipa noastră te poate ghida prin întreg procesul de achiziție în Dubai</p>
          </div>
          <Link to="/contact" className="dubai-cta-button">
            Contactează un consultant
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DubaiSection;