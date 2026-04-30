// React 19 hoists <title>, <meta>, <link> rendered inside any component into
// the document <head>. This component centralises per-route SEO so each view
// gets its own title, description, canonical and OG block.

const SITE_URL = 'https://www.ungebaut.com';

export function SeoHead({
  title,
  description,
  path = '/',
  ogTitle,
  ogDescription,
  type = 'website',
}) {
  const url = `${SITE_URL}${path}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={ogTitle ?? title} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="de_CH" />
    </>
  );
}
