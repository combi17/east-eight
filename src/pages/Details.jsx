import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Home, Bath, Square, Calendar, Phone, Mail, BadgeCheck, Check, ArrowLeft } from 'lucide-react';
import './Details.css';
import ImageModal from '../components/ImageModal';
import { fetchPropertyById, formatPrice } from '../lib/properties';
import { STATUS_LABELS } from '../data/filters';
import { AGENCY, AGENT } from '../data/agency';

const PropertiesMap = lazy(() => import('../components/PropertiesMap'));

const PROPERTY_TYPE_LABELS = { Birou: 'Birou', Apartament: 'Apartament', Vila: 'Vilă' };

const Details = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchPropertyById(id)
      .then((data) => {
        if (!cancelled) setProperty(data);
      })
      .catch(() => {
        if (!cancelled) setProperty(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="details-status" role="status">Se încarcă detaliile proprietății...</div>;
  }

  if (!property) {
    return (
      <div className="details-status">
        <p>Proprietatea nu a fost găsită sau nu mai este disponibilă.</p>
        <Link to="/properties" className="details-back-link">
          <ArrowLeft size={16} /> Înapoi la proprietăți
        </Link>
      </div>
    );
  }

  const images = Array.isArray(property.image_urls) ? property.image_urls : [];
  const totalImages = images.length;
  const gridImages = images.slice(0, 5);
  const { price, suffix } = formatPrice(property);
  const status = STATUS_LABELS[property.status];
  const typeLabel = PROPERTY_TYPE_LABELS[property.type] ?? property.type;

  const showImage = (offset) =>
    setModalImageIndex((index) => (index + offset + totalImages) % totalImages);

  return (
    <>
      <div className="property-details-page">
        <div className="container">
          <div className="details-header">
            <div className="details-header-main">
              <h1 className="property-title">{property.name}</h1>
              <div className="main-price">
                {price}
                {suffix && <span className="main-price-suffix">{suffix}</span>}
              </div>
            </div>
            <div className="details-header-secondary">
              <div className="details-header-secondary-left">
                <span className="property-type">{typeLabel}</span>
                {status && <span className="property-status">{status}</span>}
                <div className="property-address">
                  <MapPin size={16} />
                  {property.address}
                </div>
              </div>
              {property.priceDetails && (
                <div className="price-details">€{property.priceDetails.toLocaleString('ro-RO')}/mp</div>
              )}
            </div>
          </div>

          {totalImages > 0 ? (
            <div className={`image-grid-container ${totalImages === 1 ? 'single-image' : ''}`}>
              <button type="button" className="grid-image-main" onClick={() => setModalImageIndex(0)}>
                <img src={gridImages[0]} alt={`${property.name} - imagine principală`} />
              </button>
              {totalImages > 1 && (
                <div className="grid-image-secondary">
                  {gridImages.slice(1).map((image, index) => (
                    <button
                      type="button"
                      key={image}
                      className="grid-image-item"
                      onClick={() => setModalImageIndex(index + 1)}
                    >
                      <img src={image} alt={`${property.name} - imagine ${index + 2}`} loading="lazy" />
                      {index === 3 && totalImages > 5 && (
                        <span className="view-all-overlay">Vezi toate cele {totalImages} imagini</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="no-images-placeholder">Nu sunt disponibile imagini pentru această proprietate.</div>
          )}

          <div className="details-subtitle-bar">
            <span className="property-type-mobile">{typeLabel}</span>
            <div className="property-address-mobile">
              <MapPin size={16} />
              {property.address}
            </div>
          </div>

          <div className="property-content">
            <div className="property-info">
              <div className="property-details">
                <div className="detail-item"><Calendar className="detail-icon" />Construit în {property.year}</div>
                <div className="detail-item"><Square className="detail-icon" />{property.size} mp</div>
                <div className="detail-item"><Home className="detail-icon" />{property.rooms} camere</div>
                {property.baths > 0 && (
                  <div className="detail-item"><Bath className="detail-icon" />{property.baths} {property.baths === 1 ? 'baie' : 'băi'}</div>
                )}
              </div>

              <div className="description-section">
                <h2>Descriere</h2>
                <p className="description-text">{property.description}</p>
              </div>

              {Array.isArray(property.features) && property.features.length > 0 && (
                <div className="features-section">
                  <h2>Caracteristici</h2>
                  <ul className="features-grid">
                    {property.features.map((feature) => (
                      <li key={feature} className="feature-item">
                        <Check size={16} className="feature-check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="property-sidebar">
              <div className="contact-section">
                <h2>Contact agent</h2>
                <div className="agent-card">
                  <div className="agent-info">
                    <div className="agent-avatar"><img src={AGENT.photo} alt={AGENT.name} /></div>
                    <div className="agent-details">
                      <h3>{AGENT.name} <BadgeCheck className="detail-icon" aria-label="Agent verificat" /></h3>
                      <p>{AGENT.role}</p>
                    </div>
                  </div>
                  <div className="contact-buttons">
                    <a href={AGENCY.phoneHref} className="contact-btn primary"><Phone size={18} /> Sună acum</a>
                    <Link
                      to={`/contact?subject=Cerere vizionare&property=${encodeURIComponent(property.name)}`}
                      className="contact-btn secondary"
                    >
                      <Mail size={18} /> Programează o vizionare
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {property.lat && property.lng && (
            <div className="map-section">
              <h2>Localizare</h2>
              <div className="property-map">
                <Suspense fallback={null}>
                  <PropertiesMap
                    properties={[property]}
                    center={[property.lng, property.lat]}
                    zoom={15}
                    interactivePopups={false}
                  />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      {modalImageIndex !== null && (
        <ImageModal
          images={images}
          currentIndex={modalImageIndex}
          onClose={() => setModalImageIndex(null)}
          onNext={() => showImage(1)}
          onPrev={() => showImage(-1)}
          title={property.name}
        />
      )}
    </>
  );
};

export default Details;
