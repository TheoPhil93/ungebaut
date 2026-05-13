import {
  LayoutGrid,
  RotateCw,
  CodeXml,
  Headphones,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { BlobCard } from './unlumen-ui/blob-card';

// Mauve / lavender palette — three stops from the founder's reference
// (light dusty-pink-with-violet-tint at the top, mid-violet bridge,
// deep plum at the bottom). Replaces the original unlumen DEMO_PINK,
// which read too magenta for the studio brand. The four lightColors
// are spread one-per-FluidBlobs-origin; the five glowColors are conic-
// gradient stops on the rotating halo (the fifth duplicates the first
// so the loop closes seamlessly).
const PALETTE_MAUVE = {
  lightColors: ['#d4b5c5', '#b59bba', '#9c8cb5', '#6f507d'],
  darkColors: ['#6f507d', '#9c8cb5', '#9c8cb5', '#b59bba'],
  glowColors: ['#d4b5c5', '#b59bba', '#9c8cb5', '#6f507d', '#d4b5c5'],
};

const TONE_COLORS = {
  warm: PALETTE_MAUVE,
  cool: PALETTE_MAUVE,
  neutral: PALETTE_MAUVE,
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
  secondaryLabel = null,
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
