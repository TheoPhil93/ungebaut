import { services } from '../data/services';
import { TextCascade } from './TextCascade';
import { SeoHead } from './SeoHead';
import { JsonLd } from './JsonLd';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const SERVICES_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'UNGEBAUT — Leistungen & Preise',
  url: 'https://www.ungebaut.com/services',
  inLanguage: 'de-CH',
  provider: { '@type': 'Organization', name: 'UNGEBAUT' },
  itemListElement: [
    {
      '@type': 'Offer',
      name: 'Aussenrendering',
      priceCurrency: 'CHF',
      price: '1800',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '1800',
        priceCurrency: 'CHF',
        valueAddedTaxIncluded: false,
      },
      description:
        'Fotorealistische Aussenraum-Visualisierung. 5–10 Arbeitstage. Inklusive einer Korrekturrunde.',
    },
    {
      '@type': 'Offer',
      name: 'Innenraum-Rendering',
      priceCurrency: 'CHF',
      price: '2200',
      description:
        'Fotorealistische Innenraum-Visualisierung. 5–10 Arbeitstage. Inklusive einer Korrekturrunde.',
    },
    {
      '@type': 'Offer',
      name: 'Wettbewerbs-Paket',
      priceCurrency: 'CHF',
      price: '8500',
      description:
        'Atmosphärische Stills, Diagramme und Wettbewerbs-Plakate. 3–4 Wochen. Zwei Korrekturrunden.',
    },
    {
      '@type': 'Offer',
      name: 'Architekturanimation (30 Sekunden)',
      priceCurrency: 'CHF',
      price: '6500',
      description: 'Cinematischer 30-Sekunden-Flythrough oder Motion-Sequenz. 3–4 Wochen.',
    },
    {
      '@type': 'Offer',
      name: 'VR-Rundgang',
      priceCurrency: 'CHF',
      price: '9000',
      description: 'Immersiver VR-Rundgang (WebXR oder Headset). 4–6 Wochen.',
    },
    {
      '@type': 'Offer',
      name: 'Drohnen-Fotoset',
      priceCurrency: 'CHF',
      price: '1200',
      description:
        'Aerial-Standortfotografie für Kontextplatten und Standortanalysen. 3–5 Arbeitstage.',
    },
    {
      '@type': 'Offer',
      name: 'Drohnen-Video',
      priceCurrency: 'CHF',
      price: '2400',
      description: 'Cinematisches Standortvideo. 5–7 Arbeitstage.',
    },
  ],
};

export function ServicesView() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="view services" aria-label="Leistungen und Preise">
      <SeoHead
        title="UNGEBAUT — Leistungen & Preise"
        description="Leistungen und Preise von UNGEBAUT, Architekturvisualisierungs-Studio in Zürich. Aussenrenderings ab CHF 1’800, Animationen ab CHF 6’500, Drohnenarbeit ab CHF 1’200."
        path="/services"
      />
      <JsonLd data={SERVICES_SCHEMA} />
      <p className="services__heading">Leistungen & Preise</p>

      <h1 className="services__intro">
        <TextCascade
          text={services.intro}
          axis="y"
          range={110}
          totalDuration={1.6}
          letterDelay={0.012}
          startDelay={0.05}
          random
          reduced={reduced}
        />
      </h1>

      <div className="services__offerings">
        {services.offerings.map((offering, i) => (
          <article key={offering.id} id={offering.id} className="services__offering">
            <span className="services__offering-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 className="services__offering-h2">{offering.heading}</h2>
            <p className="services__offering-summary">{offering.summary}</p>
            <div className="services__offering-includes">
              <p className="services__offering-includes-label">Umfasst</p>
              <ul className="services__offering-list">
                {offering.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <dl className="services__offering-meta">
              <div>
                <dt>Ab</dt>
                <dd>{offering.from}</dd>
              </div>
              <div>
                <dt>Lieferzeit</dt>
                <dd>{offering.turnaround}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="services__pricing" id="pricing">
        <h2 className="services__pricing-h2">Was kostet eine Architekturvisualisierung?</h2>
        <p className="services__pricing-lede">
          Startpreise für die häufigsten Leistungen. Senden Sie Ihre Pläne — Sie erhalten
          innerhalb von 24 Stunden ein Fix-Angebot.
        </p>

        <table className="services__pricing-table">
          <thead>
            <tr>
              <th scope="col">Leistung</th>
              <th scope="col">Ab</th>
              <th scope="col">Lieferzeit</th>
              <th scope="col">Korrekturen inkl.</th>
            </tr>
          </thead>
          <tbody>
            {services.pricingTable.map((row) => (
              <tr key={row.service}>
                <th scope="row">{row.service}</th>
                <td>{row.from}</td>
                <td>{row.turnaround}</td>
                <td>{row.revisions}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="services__pricing-notes">
          {services.pricingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
