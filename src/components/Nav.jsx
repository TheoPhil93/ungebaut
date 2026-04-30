import { pathFromView } from '../hooks/useUrlSync';

export function Nav({ view, onNavigate }) {
  const items = [
    { id: 'home', label: 'Arbeiten' },
    { id: 'index', label: 'Index' },
    { id: 'services', label: 'Leistungen' },
    { id: 'journal', label: 'Journal' },
    { id: 'about', label: 'About' },
  ];

  // Real <a href> targets so Googlebot, prerenderers and middle-click /
  // open-in-new-tab all work. Click is intercepted to keep SPA behaviour.
  const handleClick = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    onNavigate(id);
  };

  return (
    <nav className="nav" aria-label="Hauptnavigation">
      {/* Brand + main sections. Labels are German-primary; the route name
          "about" stays English-stable for URL/state consistency. */}
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
        {items.map((item) => (
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
    </nav>
  );
}
