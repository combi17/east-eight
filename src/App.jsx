import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Homepage from './pages/Homepage.jsx';
import Properties from './pages/Properties.jsx';
import Details from './pages/Details.jsx';
import Contact from './pages/Contact.jsx';
import Despre from './pages/Despre.jsx';
import Confidentialitate from './pages/Confidentialitate.jsx';

import './App.css';

const NotFound = () => (
  <div className="not-found">
    <h1>Pagina nu există</h1>
    <p>Linkul poate fi greșit sau pagina a fost mutată.</p>
    <Link to="/properties" className="btn-primary">Vezi proprietățile</Link>
  </div>
);

export default function App() {
  return (
    <div className="app-layout">
      <Header />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<Details />} />
          <Route path="contact" element={<Contact />} />
          <Route path="despre" element={<Despre />} />
          <Route path="confidentialitate" element={<Confidentialitate />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
