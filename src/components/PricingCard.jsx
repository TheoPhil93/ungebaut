import {
  LayoutGrid,
  RotateCw,
  CodeXml,
  Headphones,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { BlobCard } from './unlumen-ui/blob-card';

// Per-tone palette. All three tones share the unlumen demo's pink/
// magenta palette per user request — single colour scheme across cards
// rather than the prior cream/ink-on-warm/cool/neutral split.
const DEMO_PINK = {
  lightColors: ['#ff0020', '#fc0f60', '#e8227a', '#ff85b3'],
  darkColors: ['#8c0f60', '#e8227a', '#e8227a', '#ff85b3'],
  glowColors: ['#ff96a9', '#e8b4f0', '#ffb3c6', '#d44d8a', '#ff96a9'],
};

const TONE_COLORS = {
  warm: DEMO_PINK,
  cool: DEMO_PINK,
  neutral: DEMO_PINK,
};

const DEMO_FEATURES = [
  { Icon: LayoutGrid, text: 'All premium components' },
  { Icon: RotateCw, text: 'Future premium releases included' },
  { Icon: CodeXml, text: 'Full source code & customisation' },
  { Icon: InfinityIcon, text: 'Lifetime access, pay once, own forever' },
  { Icon: Headphones, text: 'My own support' },
];

/**
 * Pricing card matching the unlumen blob-card demo layout.
 *
 * Layout (top → bottom):
 *   • Header (BlobCard's `header` slot, sits over the blob field with p-8 pb-0):
 *       — Label  + secondary label (e.g. "Pro [ Early Supporter Price ]")
 *       — Big price + struck-through old price (e.g. "99$ 149$")
 *       — Subtext lines
 *   • Body (BlobCard's `children` slot):
 *       — Big rounded CTA button
 *       — Vertical icon + text feature list
 *       — Centred footer tagline
 *
 * All copy defaults to the unlumen demo content. Pass props to override.
 */
export function PricingCard({
  label = 'Pro',
  secondaryLabel = '[ Early Supporter Price ]',
  price = '99$',
  oldPrice = '149$',
  subtext = ['one-time payment', 'lifetime access'],
  ctaLabel = 'Get Instant Access',
  ctaHref = '#',
  features = DEMO_FEATURES,
  footerLabel = 'Pay once. Own forever.',
  tone = 'warm',
  headerHeight = 240,
}) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.warm;

  const HeaderContent = (
    <div className="pricing-card-top">
      <div className="pricing-card-top__label-row">
        <span className="pricing-card-top__label">{label}</span>
        {secondaryLabel ? (
          <span className="pricing-card-top__secondary-label">{secondaryLabel}</span>
        ) : null}
      </div>
      <div className="pricing-card-top__price-row">
        <span className="pricing-card-top__price">{price}</span>
        {oldPrice ? <span className="pricing-card-top__old-price">{oldPrice}</span> : null}
      </div>
      <div className="pricing-card-top__subtext">
        {subtext.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );

  return (
    <BlobCard
      headerHeight={headerHeight}
      lightColors={colors.lightColors}
      darkColors={colors.darkColors}
      glowColors={colors.glowColors}
      header={HeaderContent}
    >
      <div className="pricing-card-bottom">
        <a className="pricing-card-bottom__cta" href={ctaHref} data-cursor="hover">
          {ctaLabel}
        </a>

        <ul className="pricing-card-bottom__features">
          {features.map(({ Icon, text }) => (
            <li key={text}>
              <Icon className="pricing-card-bottom__feature-icon" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <p className="pricing-card-bottom__footer">{footerLabel}</p>
      </div>
    </BlobCard>
  );
}
