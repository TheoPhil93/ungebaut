import {
  House,
  Building2,
  Trophy,
  Image as ImageIcon,
  RotateCw,
  Film,
  Clapperboard,
  Glasses,
  Sparkles,
  Camera,
  Video,
  Map as MapIcon,
  Mountain,
  Layers,
  Download,
  Code,
  Users,
} from 'lucide-react';
import { services } from '../data/services';
import { TextCascade } from './TextCascade';
import { SeoHead } from './SeoHead';
import { JsonLd } from './JsonLd';
import { PricingCard } from './PricingCard';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// OfferCatalog schema — one Offer entry per pricingTable row. Mirrors the
// pricingTable in src/data/services.js. Keep the price + turnaround in sync.
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
        'Fotorealistische Aussenraum-Visualisierung. 5–10 Arbeitstage. Inklusive zwei Korrekturrunden.',
    },
    {
      '@type': 'Offer',
      name: 'Innenraum-Rendering',
      priceCurrency: 'CHF',
      price: '1500',
      description:
        'Fotorealistische Innenraum-Visualisierung. 5–10 Arbeitstage. Inklusive zwei Korrekturrunden.',
    },
    {
      '@type': 'Offer',
      name: 'Wettbewerbs-Paket',
      priceCurrency: 'CHF',
      price: '6500',
      description:
        'Fünf atmosphärische Stills (Mischung Innen-/Aussenraum). 3–4 Wochen. Zwei Korrekturrunden.',
    },
    {
      '@type': 'Offer',
      name: 'Architekturanimation (30 Sekunden)',
      priceCurrency: 'CHF',
      price: '2500',
      description:
        'Cinematischer 30-Sekunden-Flythrough oder Motion-Sequenz. 2–3 Wochen. Zwei Korrekturrunden.',
    },
    {
      '@type': 'Offer',
      name: 'VR-Rundgang (WebXR)',
      priceCurrency: 'CHF',
      price: '5000',
      description:
        'Immersiver VR-Rundgang als WebXR-Build (im Browser begehbar). 4–6 Wochen.',
    },
    {
      '@type': 'Offer',
      name: 'Immobilien-Marketing-Webseite (Microsite)',
      description:
        'Vermarktungs-Microsite für ein Immobilienprojekt — Design, Front-End-Programmierung und Visualisierung aus einem Studio. 3–6 Wochen. Preis auf Anfrage.',
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
      description: 'Cinematisches Standortvideo. 5–7 Arbeitstage. Zwei Korrekturrunden.',
    },
  ],
};

// Per-offering pricing-card content. Keyed by offering.id so reordering
// services.offerings doesn't break the pairing. Each card pulls its price
// + Lieferzeit from the offering record (services.js stays the single
// source of truth for those two fields). Tones rotate warm → cool →
// warm → cool through the four cards.
const CTA_HREF = 'mailto:booking@ungebaut.ch?subject=Pl%C3%A4ne%20%2F%20Anfrage';
const CTA_LABEL = 'Pläne senden';
const FOOTER_LABEL = 'Festpreis. Keine Stundenabrechnung.';

const PRICING_CARDS = {
  visualisation: {
    label: 'Visualisierung',
    secondaryLabel: '[ Standbild ]',
    subtext: ['ab Innenraum-Rendering', '5–10 Arbeitstage'],
    features: [
      { Icon: House, text: 'Innenraum-Rendering' },
      { Icon: Building2, text: 'Aussenrendering' },
      { Icon: Trophy, text: 'Wettbewerbs-Paket' },
      { Icon: ImageIcon, text: 'Atmosphärische Stills' },
      { Icon: RotateCw, text: '2 Korrekturrunden' },
    ],
    tone: 'warm',
  },
  motion: {
    label: '3D & Motion',
    secondaryLabel: '[ Bewegtbild ]',
    subtext: ['ab Animation 30 s', '2–3 Wochen'],
    features: [
      { Icon: Film, text: 'Architekturanimation' },
      { Icon: Clapperboard, text: 'Längere Sequenzen' },
      { Icon: Glasses, text: 'VR-Rundgang (WebXR)' },
      { Icon: Sparkles, text: 'Motion Graphics' },
      { Icon: RotateCw, text: '2 Korrekturrunden' },
    ],
    tone: 'cool',
  },
  web: {
    label: 'Vermarktung',
    secondaryLabel: '[ Microsite ]',
    subtext: ['Preis auf Anfrage', '3–6 Wochen'],
    features: [
      { Icon: ImageIcon, text: 'Rendering-Hero' },
      { Icon: Download, text: 'Verkaufsdossier-Downloads' },
      { Icon: Layers, text: 'Musterwohnung & Grundrisse' },
      { Icon: Code, text: 'Design + Code + Visu' },
      { Icon: Users, text: 'White-Label für Agenturen' },
    ],
    tone: 'warm',
  },
  drone: {
    label: 'Drohne',
    secondaryLabel: '[ Aerial ]',
    subtext: ['ab Aerial-Fotoset', '3–5 Arbeitstage'],
    features: [
      { Icon: Camera, text: 'Aerial-Fotoset' },
      { Icon: Video, text: 'Cinematische Videos' },
      { Icon: MapIcon, text: 'Orthofotos' },
      { Icon: Mountain, text: 'Standort-Doku' },
      { Icon: Layers, text: 'Bauabschluss-Doku' },
    ],
    tone: 'cool',
  },
};

// Offerings whose card sits on the LEFT and text on the RIGHT. Alternating
// across the four offerings gives a back-and-forth rhythm down the page:
// visualisation (text|card) → motion (card|text) → web (text|card) → drone
// (card|text). Mobile collapses to a single column.
const REVERSED_OFFERINGS = new Set(['motion', 'drone']);

export function ServicesView() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="view services" aria-label="Leistungen und Preise">
      <SeoHead
        title="UNGEBAUT — Leistungen & Preise"
        description="Leistungen und Preise von UNGEBAUT, Architekturvisualisierungs-Studio in Zürich. Innenraum-Renderings ab CHF 1’500, Aussenrenderings ab CHF 1’800, Animationen ab CHF 2’500, VR-Rundgänge ab CHF 5’000, Immobilien-Marketing-Webseiten auf Anfrage, Drohnenarbeit ab CHF 1’200."
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
        {services.offerings.map((offering) => {
          const card = PRICING_CARDS[offering.id];
          const reversed = REVERSED_OFFERINGS.has(offering.id);
          return (
            <article
              key={offering.id}
              id={offering.id}
              className={`services__offering${reversed ? ' services__offering--reversed' : ''}`}
            >
              <div className="services__offering-text">
                <div className="services__offering-text-top">
                  <h2 className="services__offering-h2">{offering.heading}</h2>
                  <p className="services__offering-summary">{offering.summary}</p>
                </div>
                <div className="services__offering-includes">
                  <p className="services__offering-includes-label">Umfasst</p>
                  <ul className="services__offering-list">
                    {offering.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {card ? (
                <div className="services__offering-card">
                  <PricingCard
                    label={card.label}
                    secondaryLabel={card.secondaryLabel}
                    price={offering.from}
                    oldPrice={null}
                    subtext={card.subtext}
                    features={card.features}
                    ctaLabel={CTA_LABEL}
                    ctaHref={CTA_HREF}
                    footerLabel={FOOTER_LABEL}
                    tone={card.tone}
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="services__pricing" id="pricing">
        <h2 className="services__pricing-h2">Alle Preise auf einen Blick</h2>
        <p className="services__pricing-lede">
          Vollständige Preisübersicht mit Lieferzeiten und Korrekturrunden. Senden Sie Ihre
          Pläne an booking@ungebaut.ch — Sie erhalten innerhalb von 1–2 Arbeitstagen ein
          Fix-Angebot.
        </p>

        <details className="services__pricing-details">
          <summary>Alle Preise & Lieferzeiten anzeigen</summary>
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
        </details>

        <ul className="services__pricing-notes">
          {services.pricingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
