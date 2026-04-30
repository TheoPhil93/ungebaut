// Renders a JSON-LD <script> tag inline. React 19 keeps it in the DOM where
// it lands; Google, ChatGPT, Perplexity all parse JSON-LD wherever it appears.
// Scoped to its parent view so the schema fires only on the matching route.
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
