import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, Bath, Maximize } from 'lucide-react';
import { formatPrice } from '../lib/properties';
import { STATUS_LABELS, TRANSACTION_TYPES } from '../data/filters';

const transactionLabel = (value) =>
  TRANSACTION_TYPES.find((option) => option.value === value)?.label ?? value;

const PropertyCard = ({ property }) => {
  const isDubai = property.city === 'Dubai';
  const { price, suffix } = formatPrice(property);
  const status = STATUS_LABELS[property.status];

  return (
    <Link
      to={`/properties/${property.id}`}
      className={`property-card ${isDubai ? 'property-card-dubai' : ''} ${status ? 'property-card-closed' : ''}`}
    >
      <div className="card-image-container">
        <img src={property.image_urls[0]} alt={property.name} className="card-image" loading="lazy" />
        <div className="card-type-badge">{transactionLabel(property.transaction_type)}</div>

        {status && <div className="card-status-badge">{status}</div>}

        {isDubai && !status && (
          <div className="dubai-indicator">
            <img src="https://flagcdn.com/16x12/ae.png" alt="" className="flag-icon" /> Dubai
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-top">
          <div className="card-header">
            <h3 className="card-title">{property.name}</h3>
            <p className={`card-price ${isDubai ? 'card-price-dubai' : ''}`}>
              {price}
              {suffix && <span className="price-suffix">{suffix}</span>}
            </p>
          </div>
          <div className="card-location">
            <MapPin size={15} />
            <span>{isDubai ? 'Dubai, UAE' : property.zone}</span>
          </div>
          <p className="card-description">{property.preview_description}</p>
        </div>

        <div className="card-bottom">
          <div className="card-features">
            <div className="feature-item">
              <Maximize size={16} />
              <span>{property.size} mp</span>
            </div>
            <div className="feature-item">
              <Home size={16} />
              <span>{property.rooms} {property.rooms === 1 ? 'cameră' : 'camere'}</span>
            </div>
            <div className="feature-item">
              <Bath size={16} />
              <span>{property.baths} {property.baths === 1 ? 'baie' : 'băi'}</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="card-year">Construit în {property.year}</span>
            <span className={`details-btn ${isDubai ? 'details-btn-dubai' : ''}`}>Vezi detalii</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
