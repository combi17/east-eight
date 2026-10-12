import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import "./Header.css";

const flagRoUrl = "https://flagcdn.com/w20/ro.png";
const flagGbUrl = "https://flagcdn.com/w20/gb.png";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [menuActive, setMenuActive] = useState(false);
  const { pathname } = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (menuActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuActive]);

  return (
    <>
      <header>
        <div className={`header-background ${menuActive ? 'header-background-hidden' : ''}`}></div>
        <nav>
          <Link to="/" className={`logo ${menuActive ? 'logo-centered' : ''}`} onClick={closeMenu}>
            Premium East8
          </Link>
          
          <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
            <li><Link to="/" onClick={closeMenu}>{t('header.acasa')}</Link></li>
            <li><Link to="/properties" onClick={closeMenu}>{t('header.proprietati')}</Link></li>
            <li><Link to="/despre" onClick={closeMenu}>{t('header.despre')}</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>{t('header.contact')}</Link></li>
            <li className="mobile-theme-item">
              <ThemeToggle className="theme-toggle-wide" showLabel />
            </li>
            <li className="mobile-language-item">
              <div className="language-switcher mobile-language-switcher">
                <button 
                  onClick={() => changeLanguage('ro')} 
                  className={i18n.language === 'ro' ? 'active' : ''}
                >
                  <img src={flagRoUrl} alt="" className="flag-icon" />
                  <span className="lang-text">Română</span>
                </button>
                <span className="lang-separator">|</span>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className={i18n.language === 'en' ? 'active' : ''}
                >
                  <img src={flagGbUrl} alt="" className="flag-icon" />
                  <span className="lang-text">English</span>
                </button>
              </div>
            </li>
          </ul>
          <div className="header-right-controls desktop-language">
            <ThemeToggle />
            <div className="language-switcher">
              <button 
                onClick={() => changeLanguage('ro')} 
                className={i18n.language === 'ro' ? 'active' : ''}
              >
                <img src={flagRoUrl} alt="" className="flag-icon" />
                <span className="lang-text">RO</span>
              </button>
              <span className="lang-separator">|</span>
              <button 
                onClick={() => changeLanguage('en')} 
                className={i18n.language === 'en' ? 'active' : ''}
              >
                <img src={flagGbUrl} alt="" className="flag-icon" />
                <span className="lang-text">EN</span>
              </button>
            </div>
          </div>

          <button 
            className={`hamburger ${menuActive ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label={menuActive ? "Închide meniul" : "Deschide meniul"}
            aria-expanded={menuActive}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
      <div 
        className={`mobile-overlay ${menuActive ? 'active' : ''}`} 
        onClick={closeMenu}
      ></div>
    </>
  );
};

export default Header;