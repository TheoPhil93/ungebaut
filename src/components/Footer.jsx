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
      <div className="footer__location">
        <span>Zürich · Switzerland</span>
        <span className="footer__time" aria-live="off">
          {time} CET
        </span>
      </div>
      <div className="footer__credit">We elevate great ideas — Available 2026</div>
    </footer>
  );
}
