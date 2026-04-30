import { useEffect, useState } from 'react';

function formatTime(date) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Zurich',
  }).format(date);
}

export function Footer() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);

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
        <div className="footer__credit">We elevate great ideas — Available 2026</div>
      </div>

      <div className="footer__phone">
        <a href="mailto:booking@ungebaut.ch" className="footer__phone-link">
          booking@ungebaut.ch
        </a>
        <a href="tel:+41775210295" className="footer__phone-link">
          +41 77 521 02 95
        </a>
      </div>
    </footer>
  );
}
