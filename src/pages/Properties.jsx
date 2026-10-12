import React, { Suspense, lazy, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Map as MapIcon, List, Columns2, ChevronDown, Mail, X, Trash2 } from 'lucide-react';
import './Properties.css';
import Dropdown from '../components/Dropdown';
import PropertyCard from '../components/PropertyCard';
import { fetchProperties, readFilters } from '../lib/properties';
import {
  EMPTY_FILTERS,
  LOCATION_GROUPS,
  PROPERTY_TYPES,
  ROOM_OPTIONS,
  SIZE_RANGES,
  TRANSACTION_TYPES,
  YEAR_RANGES,
} from '../data/filters';

const PropertiesMap = lazy(() => import('../components/PropertiesMap'));

const SORT_OPTIONS = [
  { label: 'Preț crescător', value: 'price-asc' },
  { label: 'Preț descrescător', value: 'price-desc' },
];

const FILTER_LABELS = {
  propertyType: 'Tip',
  transactionType: 'Tranzacție',
  city: 'Oraș',
  zone: 'Zonă',
  minPrice: 'Preț min',
  maxPrice: 'Preț max',
  sizeRanges: 'Suprafață',
  rooms: 'Camere',
  yearBuiltRanges: 'An construcție',
};

const optionLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value;

const locationLabel = (key, value) => {
  const target = `${key}_${value}`;
  for (const group of LOCATION_GROUPS) {
    if (group.value === target) return group.label;
    const item = group.items.find((i) => i.value === target);
    if (item) return item.label;
  }
  return value;
};

const describeFilter = (key, value) => {
  switch (key) {
    case 'propertyType':
      return optionLabel(PROPERTY_TYPES, value);
    case 'transactionType':
      return optionLabel(TRANSACTION_TYPES, value);
    case 'rooms':
      return optionLabel(ROOM_OPTIONS, value);
    case 'city':
    case 'zone':
      return locationLabel(key, value);
    case 'sizeRanges':
      return value.map((v) => optionLabel(SIZE_RANGES, v)).join(', ');
    case 'yearBuiltRanges':
      return value.map((v) => optionLabel(YEAR_RANGES, v)).join(', ');
    case 'minPrice':
    case 'maxPrice':
      return `€${Number(value).toLocaleString('ro-RO')}`;
    default:
      return value;
  }
};

const isActive = (value) => (Array.isArray(value) ? value.length > 0 : Boolean(value));

const ActiveFilters = ({ filters, onRemove, onClearAll }) => {
  const active = Object.entries(filters).filter(([, value]) => isActive(value));
  if (active.length === 0) return null;

  return (
    <div className="active-filters-bar">
      <span className="active-filters-label">Filtre active:</span>
      <div className="active-filters-list">
        {active.map(([key, value]) => (
          <div key={key} className="filter-chip">
            <span>{FILTER_LABELS[key]}: {describeFilter(key, value)}</span>
            <button
              type="button"
              onClick={() => onRemove(key)}
              className="filter-chip-remove"
              aria-label={`Elimină filtrul ${FILTER_LABELS[key]}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {active.length > 1 && (
          <button type="button" onClick={onClearAll} className="clear-all-filters">
            <Trash2 size={16} />
            Șterge tot
          </button>
        )}
      </div>
    </div>
  );
};

const ContactBanner = () => (
  <div className="contact-banner">
    <div className="contact-banner-content">
      <div className="contact-banner-left">
        <h3 className="contact-banner-title">Nu ai găsit proprietatea potrivită?</h3>
        <p className="contact-banner-subtitle">
          Spune-ne ce cauți și îți trimitem opțiunile care nu sunt încă listate pe site.
        </p>
      </div>
      <div className="contact-banner-right">
        <Link to="/contact" className="contact-button">
          <Mail size={20} />
          Contactează-ne
        </Link>
      </div>
    </div>
  </div>
);

const PriceRangeFilter = ({ minPrice, maxPrice, onChange }) => (
  <div className="filter-group">
    <label htmlFor="min-price">Preț minim</label>
    <input
      id="min-price"
      type="number"
      min="0"
      inputMode="numeric"
      placeholder="€ Min"
      value={minPrice}
      onChange={(e) => onChange('minPrice', e.target.value)}
      className="price-input"
    />

    <label htmlFor="max-price" className="price-label-spaced">Preț maxim</label>
    <input
      id="max-price"
      type="number"
      min="0"
      inputMode="numeric"
      placeholder="€ Max"
      value={maxPrice}
      onChange={(e) => onChange('maxPrice', e.target.value)}
      className="price-input"
    />
  </div>
);

const CheckboxFilter = ({ label, options, selected, onToggle }) => (
  <fieldset className="filter-group">
    <legend className="filter-label">{label}</legend>
    <div className="checkbox-list">
      {options.map((option) => (
        <label key={option.value} className="checkbox-item">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

const VIEW_MODES = [
  { value: 'list', label: 'Listă', icon: List },
  { value: 'split', label: 'Hartă + Listă', icon: Columns2 },
  { value: 'map', label: 'Doar Hartă', icon: MapIcon },
];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);
  const sortBy = searchParams.get('sortBy') || '';

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [viewMode, setViewMode] = useState('list');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [priceDraft, setPriceDraft] = useState({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });
  const priceTimer = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    setPriceDraft({ minPrice: filters.minPrice, maxPrice: filters.maxPrice });
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => () => clearTimeout(priceTimer.current), []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setViewMode('list');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(false);

    fetchProperties(filters, sortBy)
      .then((data) => {
        if (!cancelled) setProperties(data);
      })
      .catch(() => {
        if (!cancelled) {
          setProperties([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, sortBy]);

  useEffect(() => {
    if (!showSortDropdown) return undefined;
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortDropdown]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      const serialized = Array.isArray(value) ? value.join(',') : value;
      if (serialized) next.set(key, serialized);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handlePriceChange = (key, value) => {
    setPriceDraft((draft) => ({ ...draft, [key]: value }));
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => updateParams({ [key]: value }), 600);
  };

  const handleLocationChange = (selected) => {
    const [kind, ...rest] = selected.split('_');
    const name = rest.join('_');
    updateParams({ city: kind === 'city' ? name : '', zone: kind === 'zone' ? name : '' });
  };

  const toggleInList = (key, value) => {
    const current = filters[key];
    updateParams({ [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value] });
  };

  const handleSortChange = (value) => {
    updateParams({ sortBy: value });
    setShowSortDropdown(false);
  };

  const clearAllFilters = () => {
    clearTimeout(priceTimer.current);
    updateParams(EMPTY_FILTERS);
  };

  const locationValue = filters.city ? `city_${filters.city}` : filters.zone ? `zone_${filters.zone}` : '';
  const activeFilterCount = Object.values(filters).filter(isActive).length;
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label ?? 'Sortează';

  const renderResults = () => {
    if (isLoading) {
      return <div className="results-status" role="status">Se încarcă proprietățile...</div>;
    }
    if (loadError) {
      return (
        <div className="results-status results-status-error" role="alert">
          Nu am putut încărca proprietățile. Reîncarcă pagina sau încearcă din nou peste câteva minute.
        </div>
      );
    }
    if (properties.length === 0) {
      return (
        <div className="results-status">
          <p>Nicio proprietate nu se potrivește filtrelor alese.</p>
          {activeFilterCount > 0 && (
            <button type="button" className="results-reset" onClick={clearAllFilters}>
              Șterge filtrele
            </button>
          )}
        </div>
      );
    }
    return (
      <div className="properties-grid-layout">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    );
  };

  return (
    <div className="properties-page-container">
      {isMobile && (
        <button
          type="button"
          className="mobile-filters-toggle"
          onClick={() => setShowMobileFilters((open) => !open)}
        >
          <Filter size={20} />
          Filtrează
          {activeFilterCount > 0 && <span className="filters-badge">{activeFilterCount}</span>}
        </button>
      )}

      {showMobileFilters && (
        <div className="mobile-filters-overlay" onClick={() => setShowMobileFilters(false)} />
      )}

      {!isMobile && (
        <div className="view-header">
          <div className="view-controls" role="group" aria-label="Mod de afișare">
            {VIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  type="button"
                  key={mode.value}
                  className={`view-btn ${viewMode === mode.value ? 'active' : ''}`}
                  aria-pressed={viewMode === mode.value}
                  onClick={() => setViewMode(mode.value)}
                >
                  <Icon size={18} />
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`main-content-area ${viewMode}`}>
        {viewMode !== 'map' && (
          <aside className={`filters-sidebar ${showMobileFilters ? 'mobile-active' : ''}`}>
            <div className="filters-header">
              <div className="filters-header-left">
                <Filter size={20} />
                <h3>Filtre</h3>
              </div>
              <button
                type="button"
                className="close-filters-btn"
                aria-label="Închide filtrele"
                onClick={() => setShowMobileFilters(false)}
              >
                <X size={24} />
              </button>
            </div>

            <Dropdown
              label="Tip proprietate"
              options={PROPERTY_TYPES}
              value={filters.propertyType}
              onChange={(value) => updateParams({ propertyType: value })}
            />

            <Dropdown
              label="Tip tranzacție"
              options={TRANSACTION_TYPES}
              value={filters.transactionType}
              onChange={(value) => updateParams({ transactionType: value })}
            />

            <Dropdown
              label="Oraș / Zonă"
              groups={LOCATION_GROUPS}
              value={locationValue}
              onChange={handleLocationChange}
            />

            <PriceRangeFilter
              minPrice={priceDraft.minPrice}
              maxPrice={priceDraft.maxPrice}
              onChange={handlePriceChange}
            />

            <CheckboxFilter
              label="Suprafață"
              options={SIZE_RANGES}
              selected={filters.sizeRanges}
              onToggle={(value) => toggleInList('sizeRanges', value)}
            />

            <Dropdown
              label="Număr camere"
              options={ROOM_OPTIONS}
              value={filters.rooms}
              onChange={(value) => updateParams({ rooms: value })}
            />

            <CheckboxFilter
              label="An construcție"
              options={YEAR_RANGES}
              selected={filters.yearBuiltRanges}
              onToggle={(value) => toggleInList('yearBuiltRanges', value)}
            />
          </aside>
        )}

        {isMobile && showMobileFilters && (
          <div className="mobile-filters-footer">
            <button type="button" className="apply-filters-btn" onClick={() => setShowMobileFilters(false)}>
              {isLoading ? 'Aplică filtrele' : `Vezi ${properties.length} rezultate`}
            </button>
          </div>
        )}

        {viewMode !== 'map' && (
          <section className="properties-list-container">
            <div className="results-header">
              <h2>
                {isLoading ? 'Proprietăți' : `${properties.length} ${properties.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'}`}
              </h2>
              <div className="sort-dropdown" ref={sortDropdownRef}>
                <button
                  type="button"
                  className="sort-button"
                  aria-haspopup="true"
                  aria-expanded={showSortDropdown}
                  onClick={() => setShowSortDropdown((open) => !open)}
                >
                  {sortLabel}
                  <ChevronDown size={16} />
                </button>
                {showSortDropdown && (
                  <div className="sort-options">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={sortBy === option.value ? 'active-sort-option' : ''}
                      >
                        {option.label}
                      </button>
                    ))}
                    {sortBy && (
                      <button type="button" onClick={() => handleSortChange('')}>
                        Cele mai noi
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <ActiveFilters
              filters={filters}
              onRemove={(key) => updateParams({ [key]: '' })}
              onClearAll={clearAllFilters}
            />

            {renderResults()}
          </section>
        )}

        {viewMode !== 'list' && (
          <div className="map-area">
            <Suspense fallback={null}>
              <PropertiesMap properties={properties} />
            </Suspense>
          </div>
        )}
      </div>
      <ContactBanner />
    </div>
  );
};

export default Properties;
