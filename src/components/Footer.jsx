import { useEffect, useState } from 'react';
import { pathFromView } from '../hooks/useUrlSync';

function formatTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Zurich',
  }).format(date);
}

export function Footer({ onNavigate }) {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

  const handleLegalClick = (event, view) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="footer">
      {/* Phone-only: contact rows replace location + credit. CSS toggles
          which set is visible per breakpoint via .footer__desktop/phone. */}
      <div className="footer__desktop">
        <div className="footer__location">
          <span>Zürich · Switzerland</span>
          <span className="footer__time" aria-live="off">
            {time} CET
          </span>
        </div>
        <nav className="footer__legal" aria-label="Rechtliches">
          <a
            href={pathFromView('impressum')}
            onClick={(e) => handleLegalClick(e, 'impressum')}
          >
            Impressum
          </a>
          <span className="footer__legal-sep" aria-hidden="true">
            ·
          </span>
          <a
            href={pathFromView('datenschutz')}
            onClick={(e) => handleLegalClick(e, 'datenschutz')}
          >
            Datenschutz
          </a>
        </nav>
      </div>

      <div className="footer__phone">
        <a href="mailto:booking@ungebaut.ch" className="footer__phone-link">
          booking@ungebaut.ch
        </a>
        <a href="tel:+41775210295" className="footer__phone-link">
          +41 77 521 02 95
        </a>
        <nav className="footer__phone-legal" aria-label="Rechtliches">
          <a
            href={pathFromView('impressum')}
            onClick={(e) => handleLegalClick(e, 'impressum')}
          >
            Impressum
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={pathFromView('datenschutz')}
            onClick={(e) => handleLegalClick(e, 'datenschutz')}
          >
            Datenschutz
          </a>
        </nav>
      </div>
    </footer>
  );
}
