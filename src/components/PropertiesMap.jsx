import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatPrice } from '../lib/properties';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const BUCHAREST = [26.1025, 44.4268];

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const buildPopup = (property, onOpen) => {
  const { price, suffix } = formatPrice(property);
  const root = el('div', 'map-popup-content');

  const image = el('img', 'map-popup-image');
  image.src = property.image_urls[0];
  image.alt = property.name;

  const body = el('div', 'map-popup-body');
  body.append(
    el('h3', 'map-popup-title', property.name),
    el('p', 'map-popup-meta', `${property.zone} · ${property.size} mp`),
    el('p', 'map-popup-price', `${price}${suffix}`),
  );

  root.append(image, body);
  root.addEventListener('click', onOpen);
  return root;
};

export const MapUnavailable = () => (
  <div className="map-unavailable">
    <MapPinOff size={28} />
    <p>Harta nu este disponibilă momentan.</p>
  </div>
);

const PropertiesMap = ({ properties, center = BUCHAREST, zoom = 12, interactivePopups = true }) => {
  const containerRef = useRef(null);
  const [lng, lat] = center;
  const navigate = useNavigate();

  useEffect(() => {
    if (!MAPBOX_TOKEN || !containerRef.current) return undefined;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom,
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    properties
      .filter((property) => property.lat && property.lng)
      .forEach((property) => {
        const popup = new mapboxgl.Popup({ offset: 25, className: 'custom-map-popup', maxWidth: '280px' })
          .setDOMContent(
            buildPopup(property, () => interactivePopups && navigate(`/properties/${property.id}`)),
          );

        new mapboxgl.Marker({ color: '#1DA397' })
          .setLngLat([property.lng, property.lat])
          .setPopup(popup)
          .addTo(map);
      });

    return () => map.remove();
  }, [properties, lng, lat, zoom, interactivePopups, navigate]);

  if (!MAPBOX_TOKEN) return <MapUnavailable />;

  return <div ref={containerRef} className="properties-map" />;
};

export default PropertiesMap;
