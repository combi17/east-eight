import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { LOCATION_GROUPS, PROPERTY_TYPES } from '../data/filters';

const SearchCard = () => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (location) {
      const [kind, ...rest] = location.split('_');
      params.set(kind, rest.join('_'));
    }
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text reveal-on-load">
          <h1>Imobiliare <span className="highlight">Premium</span> în București</h1>
          <p>Birouri, spații comerciale și locuințe premium, cu consultanță de la prima vizionare până la semnarea contractului.</p>
          <div className="hero-buttons">
            <Link to="/properties" className="btn-primary">Explorează proprietăți</Link>
            <Link to="/contact?subject=Evaluare proprietate" className="btn-secondary">Evaluare gratuită</Link>
          </div>
        </div>
        <div className="search-widget reveal-on-load reveal-delay-1">
          <h3>Caută proprietatea potrivită</h3>
          <form className="search-form" onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <select
                  aria-label="Tip proprietate"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Tip proprietate</option>
                  {PROPERTY_TYPES.filter((option) => option.value).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select
                  aria-label="Oraș sau zonă"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Oraș / Zonă</option>
                  {LOCATION_GROUPS.map((group) => (
                    <optgroup key={group.value} label={group.label}>
                      <option value={group.value}>Tot {group.label}</option>
                      {group.items.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  aria-label="Preț minim în euro"
                  placeholder="Preț minim (EUR)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  aria-label="Preț maxim în euro"
                  placeholder="Preț maxim (EUR)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="search-btn"><Search size={18} /> Caută</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchCard;
