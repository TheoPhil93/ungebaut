import { useEffect, useId, useRef, useState } from 'react';
import { pathFromView } from '../hooks/useUrlSync';

const ITEMS = [
  { id: 'home', label: 'Arbeiten' },
  { id: 'index', label: 'Index' },
  { id: 'services', label: 'Leistungen' },
  { id: 'journal', label: 'Journal' },
  { id: 'about', label: 'About' },
];

export function Nav({ view, onNavigate }) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);

  const handleClick = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onNavigate(id);
    setOpen(false);
  };

  // Close drawer when the route changes (e.g. user clicked a link).
  useEffect(() => {
    setOpen(false);
  }, [view]);

  // Lock page scroll while the drawer is open and trap focus.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    const focusables = drawer
      ? drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      : [];
    if (focusables.length) focusables[0].focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <nav className="nav" aria-label="Hauptnavigation">
      <a
        href={pathFromView('home')}
        className="nav__brand"
        onClick={(e) => handleClick(e, 'home')}
        data-cursor="hover"
        aria-label="UNGEBAUT — zur Startseite"
      >
        UNGEBAUT
      </a>

      <ul className="nav__list">
        {ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={pathFromView(item.id)}
              className="nav__btn"
              onClick={(e) => handleClick(e, item.id)}
              aria-current={view === item.id ? 'page' : undefined}
              data-cursor="hover"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        ref={triggerRef}
        className="nav__toggle"
        aria-expanded={open}
        aria-controls={drawerId}
        aria-label={open ? 'Menü schliessen' : 'Menü öffnen'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav__toggle-bar" aria-hidden="true" />
        <span className="nav__toggle-bar" aria-hidden="true" />
      </button>

      <div
        id={drawerId}
        ref={drawerRef}
        className="nav__drawer"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Hauptnavigation"
        hidden={!open}
      >
        <ul className="nav__drawer-list">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={pathFromView(item.id)}
                className="nav__drawer-link"
                onClick={(e) => handleClick(e, item.id)}
                aria-current={view === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
