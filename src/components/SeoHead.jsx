// React 19 hoists <title>, <meta>, <link> rendered inside any component into
// the document <head>. This component centralises per-route SEO so each view
// gets its own title, description, canonical, Open Graph block and Twitter
// card. Pass `image` to override the default OG/Twitter card asset on routes
// that have a natural hero (project detail, cornerstone journal entry).

const SITE_URL = 'https://www.ungebaut.com';
const SITE_NAME = 'UNGEBAUT';
// Drop a 1200×630 brand card at /public/og-default.jpg and it will be used
// for every route that does not pass a more specific `image`. Until that
// asset lands, individual project routes still pass through their own hero
// via the `image` prop, so social previews already work for the views that
// most need them.
const OG_DEFAULT_IMAGE = '/og-default.jpg';

function absolute(url) {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function SeoHead({
  title,
  description,
  path = '/',
  ogTitle,
  ogDescription,
  image,
  type = 'website',
}) {
  const url = `${SITE_URL}${path}`;
  const cardImage = absolute(image || OG_DEFAULT_IMAGE);
  const cardTitle = ogTitle ?? title;
  const cardDescription = ogDescription ?? description;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph — Facebook, LinkedIn, Slack, generic crawlers. */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={cardTitle} />
      <meta property="og:description" content={cardDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:image" content={cardImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={cardTitle} />

      {/* Twitter / X — `summary_large_image` shows the card image edge-to-edge. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={cardTitle} />
      <meta name="twitter:description" content={cardDescription} />
      <meta name="twitter:image" content={cardImage} />
    </>
  );
}
