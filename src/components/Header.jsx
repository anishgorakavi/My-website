import React, { useEffect, useState } from 'react';
import { Arrow, Brand } from './Shared.jsx';

const navigationLinks = [
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Journey', id: 'journey' },
  { label: 'Writing', id: 'writing' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (window.siteTheme) {
      setTheme(window.siteTheme.get());
    }

    function handleThemeChange(event) {
      setTheme(event.detail.theme);
    }

    window.addEventListener('site-theme-change', handleThemeChange);
    return () => window.removeEventListener('site-theme-change', handleThemeChange);
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleTheme() {
    if (window.siteTheme) {
      setTheme(window.siteTheme.toggle());
    }
  }

  return (
    <header className="header">
      <Brand label="Anish Gorakavi home" />
      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen(open => !open)}
        aria-expanded={isMenuOpen}
        aria-controls="navigation"
      >
        {isMenuOpen ? 'Close −' : 'Menu +'}
      </button>
      <nav
        id="navigation"
        className={isMenuOpen ? 'open' : ''}
        aria-label="Main navigation"
      >
        {navigationLinks.map(({ label, id }) => (
          <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>
        ))}
        <a href="./thinklab/" onClick={closeMenu}>Think Lab</a>
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
        <a className="nav-contact" href="#connect" onClick={closeMenu}>
          Let’s connect <Arrow />
        </a>
      </nav>
    </header>
  );
}
