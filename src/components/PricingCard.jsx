import {
  LayoutGrid,
  RotateCw,
  CodeXml,
  Headphones,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { BlobCard } from './unlumen-ui/blob-card';

// Earth / sage palette — five stops from the founder's reference
// (Cornsilk → Papaya Whip → Beige → Dry Sage → Light Bronze, lightest
// to deepest). Sits in the same warm family as the site backdrop
// (#f4f0e8) so the hover field reads as a continuation of the brand
// rather than an off-brand UI primitive.
//
// The four `lightColors` feed FluidBlobs one-per-origin (Beige is
// dropped from this set because it sits visually between Papaya Whip
// and Dry Sage and would muddy the cycle). The five `glowColors` feed
// the rotating GlowEffect halo as conic-gradient stops at 0°/90°/180°/
// 270°/360°; the fifth loops back to the first so the rotation closes
// seamlessly.
const PALETTE_EARTH = {
  lightColors: ['#fefae0', '#faedcd', '#ccd5ae', '#d4a373'],
  darkColors: ['#d4a373', '#ccd5ae', '#ccd5ae', '#faedcd'],
  glowColors: ['#fefae0', '#faedcd', '#ccd5ae', '#d4a373', '#fefae0'],
};

const TONE_COLORS = {
  warm: PALETTE_EARTH,
  cool: PALETTE_EARTH,
  neutral: PALETTE_EARTH,
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
