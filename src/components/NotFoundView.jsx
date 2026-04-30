import { SeoHead } from './SeoHead';
import { pathFromView } from '../hooks/useUrlSync';

// Client-side 404. Browsers still receive a 200 from the static host on this
// route — proper HTTP status is a deploy-host concern (Vercel/Netlify
// `_redirects` or rewrite rule, tracked under the deploy issue). The page
// itself self-identifies via `<title>` and `noindex` so search engines drop
// it from the index even when the host returns 200.
export function NotFoundView({ onNavigate }) {
  const handleHome = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate('home');
  };

  return (
    <section className="view not-found" aria-label="Seite nicht gefunden">
      <SeoHead
        title="404 — Seite nicht gefunden · UNGEBAUT"
        description="Diese Seite existiert nicht oder wurde verschoben."
        path="/404"
      />
      <meta name="robots" content="noindex" />

      <div className="not-found__inner">
        <p className="not-found__eyebrow">Error · 404</p>
        <h1 className="not-found__title">Diese Seite gibt es nicht.</h1>
        <p className="not-found__body">
          Der angefragte Inhalt wurde verschoben, gelöscht oder hat eine neue
          Adresse. Zurück zur Übersicht oder direkt zum Kontakt.
        </p>
        <div className="not-found__cta-row">
          <a
            href={pathFromView('home')}
            className="not-found__cta"
            onClick={handleHome}
          >
            Zurück zur Startseite
          </a>
          <a className="not-found__cta-secondary" href="mailto:booking@ungebaut.ch">
            booking@ungebaut.ch
          </a>
        </div>
      </div>
    </section>
  );
}
