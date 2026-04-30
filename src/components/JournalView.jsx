import { motion } from 'framer-motion';
import { articles } from '../data/articles';
import { journal } from '../data/journal';
import { TextCascade } from './TextCascade';
import { SeoHead } from './SeoHead';
import { JsonLd } from './JsonLd';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function buildArticleSchema(article) {
  if (!article) return null;
  const url = `https://www.ungebaut.com/journal/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url,
    inLanguage: 'de-CH',
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
      hasCredential: article.author.credentials
        .split('·')
        .map((s) => s.trim())
        .filter(Boolean),
    },
    publisher: {
      '@type': 'Organization',
      name: 'UNGEBAUT',
      url: 'https://www.ungebaut.com',
    },
    mainEntityOfPage: url,
    keywords: article.tags,
    articleSection: 'Journal',
  };
}

const DATE_FMT = new Intl.DateTimeFormat('de-CH', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return DATE_FMT.format(d);
}

// Multi-entry journal. The first entry is the SEO-cornerstone article
// (full body rendered for indexability); subsequent entries are shorter
// editorial notes from `data/journal.js`.
export function JournalView() {
  const reduced = usePrefersReducedMotion();
  const cornerstone = articles[0];

  const item = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { y: 24, opacity: 0 }, animate: { y: 0, opacity: 1 } };

  return (
    <section className="view journal" aria-label="Journal — Notizen aus dem Studio">
      <SeoHead
        title="Journal — UNGEBAUT"
        description="Notizen aus dem Studio. Aktuell: vollständige Preisübersicht für Architekturvisualisierung in der Schweiz 2026 mit konkreten CHF-Werten und Lieferzeiten."
        path="/journal"
        type="article"
      />
      {cornerstone ? <JsonLd data={buildArticleSchema(cornerstone)} /> : null}
      <p className="journal__heading">Journal — Notizen aus dem Studio</p>

      <h1 className="journal__intro" lang="de">
        <TextCascade
          text={journal.intro}
          axis="y"
          range={110}
          totalDuration={1.6}
          letterDelay={0.012}
          startDelay={0.05}
          random
          reduced={reduced}
        />
      </h1>

      <ol className="journal__list">
        {cornerstone ? (
          <motion.li
            id={cornerstone.slug}
            className="journal__entry journal__entry--featured"
            initial={item.initial}
            animate={item.animate}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <article>
              <header className="journal__entry-head">
                <span className="journal__entry-num" aria-hidden="true">01</span>
                <time
                  className="journal__entry-date"
                  dateTime={cornerstone.publishedAt}
                >
                  {formatDate(cornerstone.publishedAt)}
                </time>
                <ul className="journal__entry-tags" aria-label="Schlagworte">
                  {cornerstone.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <span className="journal__entry-badge" aria-hidden="true">
                  Cornerstone
                </span>
              </header>

              <h2 className="journal__entry-title">{cornerstone.title}</h2>

              <p className="journal__byline">
                Von <strong>{cornerstone.author.name}</strong> —{' '}
                {cornerstone.author.role}
                <span className="journal__byline-sep" aria-hidden="true">·</span>
                <span>{cornerstone.readingTimeMin} min Lesezeit</span>
              </p>

              <p className="journal__entry-lede" lang="de">
                {cornerstone.lede}
              </p>

              <details className="journal__entry-details">
                <summary className="journal__entry-toggle">
                  <span className="journal__entry-toggle-open">Weiterlesen</span>
                  <span className="journal__entry-toggle-close">Schliessen</span>
                  <span className="journal__entry-toggle-icon" aria-hidden="true" />
                </summary>

                <div className="journal__entry-body" lang="de">
                  {cornerstone.sections.map((section, i) => (
                    <div className="journal__entry-section" key={i}>
                      <h3 className="journal__entry-h3">{section.h2}</h3>
                      {section.body?.map((paragraph, j) => (
                        <p key={j}>{paragraph}</p>
                      ))}
                      {section.list ? (
                        <ul className="journal__entry-inline-list">
                          {section.list.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>

                <p className="journal__entry-updated">
                  <time dateTime={cornerstone.updatedAt}>
                    Zuletzt aktualisiert: {formatDate(cornerstone.updatedAt)}
                  </time>
                </p>
              </details>
            </article>
          </motion.li>
        ) : null}

        {journal.entries.map((entry, i) => (
          <motion.li
            key={entry.id}
            id={entry.id}
            className="journal__entry"
            initial={item.initial}
            animate={item.animate}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: reduced ? 0 : 0.06 * (i + 1),
            }}
          >
            <article>
              <header className="journal__entry-head">
                <span className="journal__entry-num" aria-hidden="true">
                  {String(i + 2).padStart(2, '0')}
                </span>
                <time className="journal__entry-date" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
                <ul className="journal__entry-tags" aria-label="Schlagworte">
                  {entry.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </header>

              <h2 className="journal__entry-title">{entry.title}</h2>

              <p className="journal__entry-lede" lang="de">
                {entry.excerpt}
              </p>

              <details className="journal__entry-details">
                <summary className="journal__entry-toggle">
                  <span className="journal__entry-toggle-open">Weiterlesen</span>
                  <span className="journal__entry-toggle-close">Schliessen</span>
                  <span className="journal__entry-toggle-icon" aria-hidden="true" />
                </summary>

                <div className="journal__entry-body" lang="de">
                  {entry.body.map((paragraph, k) => (
                    <p key={k}>{paragraph}</p>
                  ))}
                </div>
              </details>
            </article>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
