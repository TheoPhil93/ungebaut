# Ungebaut — AI SEO Audit

**Date:** 2026-04-29
**Scope:** Live site (ungebaut.com) + new rebrand `AboutView` page

---

## Part 1 — Live site AI visibility audit

### Current AI visibility: ~0%

Tested across ChatGPT/Perplexity/Google-style category queries. Ungebaut is not cited anywhere. Competitors getting all the citations:

| Query                             | Cited studios                                         | Ungebaut? |
| --------------------------------- | ----------------------------------------------------- | --------- |
| "best archviz studio Zurich 2026" | GRAPHEX, Slashcube, Total Real, OVA Studio, VisEngine | No        |
| "top 3D rendering studios Europe" | MIR, Hayes Davidson, ZOA, Render Vision, VisEngine    | No        |
| Direct brand search               | Only own Facebook + own site                          | Barely    |

### Why you're invisible

1. **Image-first, text-zero homepage.** AI can't extract from images. H1 is just "UNGEBAUT" + tagline — no extractable answer to "what is Ungebaut / who / where / for whom."
2. **No third-party presence.** Biggest issue. AI cites aggregator/listicle articles far more than studio sites. Not on:
   - swiss-architects.com (where OVA is listed)
   - Architizer, ArchDaily roundups
   - Maverickframe / ensun / cylind "top studios" lists
   - Newlyswissed-style local features
   - Chaos CGconnect / Behance featured artists
   - Wikipedia, Reddit r/architecture
3. **No author/team/expertise signals.** AI heavily weights E-E-A-T.
4. **No dates anywhere.** No founding year, project dates, blog timestamps.
5. **No schema markup.** Missing `Organization`, `LocalBusiness`, `Service`, `Article`.
6. **Pricing page ("PREISE") not machine-readable.** No `/pricing.md`.
7. **Mixed German/English** with no `hreflang`.

**Good news:** robots.txt allows all AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).

### Priority fixes

**Tier 1 — Third-party listings (biggest lever)**

1. Submit to swiss-architects.com
2. Pitch 2+ "top archviz" listicles (Architizer, Maverickframe, CGconnect, OMEGARENDER)
3. Build Wikipedia-eligible footprint (press, awards, publications) — Wikipedia = 7.8% of all ChatGPT citations
4. Behance / CGconnect / ArchDaily project submissions

**Tier 2 — Make own site extractable** 5. Homepage definition block (see Part 2 — already partly handled in new About page) 6. Named founders + credentials on About 7. FAQ section (pricing model, turnaround, file formats, competition vs commercial, languages) 8. Named case studies with client, project type, location, year 9. `Organization` + `LocalBusiness` + `Service` schema 10. `/pricing.md` and `/llms.txt` at site root 11. Visible dates on blog and project entries

**Tier 3 — Cornerstone content** 12. Write 3–5 cornerstone articles targeting citable queries: - "Architectural Visualization in Switzerland: A Studio Guide" - "How Much Does Architectural Rendering Cost in 2026?" (with CHF ranges) - "Competition Renderings vs Marketing Renderings: What's the Difference?" - "Choosing an Archviz Studio: 8 Questions to Ask"

**Tier 4 — Monitor** 13. Manual monthly check of top 10 queries across ChatGPT/Perplexity/Google.

---

## Part 2 — New `AboutView` page scan

**Files reviewed:** `src/components/AboutView.jsx`, `src/data/about.js`, `index.html`

### What's good (big improvement vs live site)

- Clear **definition block** in `about.intro`: "UNGEBAUT is a Zürich-based architectural visualisation studio." — exactly the extractable opener AI needs.
- **Named founders:** "Founded by Philippos & Luna Theofanidis." Major E-E-A-T win vs current live site.
- **Capabilities list** (4 items) — clean, AI-extractable.
- **Specific geographic projects** named (UK quarry house, Via Salaria palazzina, Madrid interiors, Swiss tower) — concrete, citable detail.
- `index.html` has a real meta description and OG tags. Good baseline.

### Gaps that will limit AI citation

| #   | Gap                                                                                                                                                                       | Fix                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **No founding year.** "Founded by ..." but no date. AI weights dated entities.                                                                                            | Add "Founded in [YYYY]" to `about.body[0]`.                                                                                                                               |
| 2   | **No founder credentials.** Names alone, no "architect, MSc ETH Zürich" etc.                                                                                              | Add 1-line bio per founder (background, training, years in field).                                                                                                        |
| 3   | **No client names.** "Architects, developers and brands" is generic.                                                                                                      | Add 3–5 named clients or "Selected clients:" list (with permission).                                                                                                      |
| 4   | **No FAQ block.** Highest-leverage citable format for archviz queries.                                                                                                    | Add FAQ section: pricing model, turnaround, formats, competition vs commercial, revisions, languages.                                                                     |
| 5   | **No schema markup.** SPA renders client-side; AI parsers may miss it entirely.                                                                                           | Add SSR/prerender for `/about` + JSON-LD `Organization` and `LocalBusiness` schema in `index.html` or per-route head.                                                     |
| 6   | **SPA = no per-route `<title>` / meta.** Single `index.html` serves all routes; About page has no unique title or description for crawlers.                               | Add `react-helmet-async` (or migrate to Next.js/Astro) to set per-route `<title>`, `<meta description>`, canonical URL.                                                   |
| 7   | **Aristide-style letter-cascade animation on H1.** If implemented as per-letter spans without proper text content, screen readers and AI parsers may see fragmented text. | Verify the rendered DOM contains the full readable string in a single accessible node (or use `aria-label` with the full string and `aria-hidden` on the animated layer). |
| 8   | **Social links are placeholder URLs** (`https://www.instagram.com/`, `https://www.linkedin.com/`, `https://www.behance.net/`).                                            | Replace with real profile URLs — these are external trust signals and citation pathways.                                                                                  |
| 9   | **`lang="en"` but address/phone are Swiss + alt locale `de_CH`.** No `hreflang` for de version.                                                                           | If a German version exists/will exist, add `hreflang` alternates.                                                                                                         |
| 10  | **Email mismatch:** copy uses `booking@ungebaut.ch` but live site footer is also `.ch`; new domain is `.com`. Check inbox routing.                                        | Confirm and unify.                                                                                                                                                        |
| 11  | **No "Last updated" on About.**                                                                                                                                           | Add `<time dateTime="2026-04-29">Last updated April 2026</time>` somewhere in the footer or About.                                                                        |
| 12  | **No pricing or service-tier detail visible from About.**                                                                                                                 | Link to `/pricing` from capabilities, and ship a `/pricing.md` for AI agents.                                                                                             |

### Suggested rewrite of `about.intro` (AI-optimized)

> UNGEBAUT is a Zürich-based architectural visualisation studio founded in [YEAR] by Philippos and Luna Theofanidis. We produce photorealistic still-image renderings, 3D design, animation and drone documentation for architects, developers and brands across Europe.

This single paragraph answers: what · where · when · who · for whom · services. That's the form AI extracts as a citation snippet.

### Suggested FAQ block to add (high-value for AI)

- What does an architectural visualisation cost?
- How long does a typical rendering project take?
- What file formats do you accept (DWG, RVT, SKP, 3DM)?
- Do you work on competition entries?
- Do you offer animation and VR alongside still images?
- Do you work outside Switzerland?
- What's the revision policy?

Wrap in `FAQPage` JSON-LD schema for direct AI extraction.

### Schema markup to add to `index.html`

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "UNGEBAUT",
    "description": "Architectural visualisation studio in Zürich. Renderings, 3D design, animation, VR/AR and drone documentation.",
    "url": "https://www.ungebaut.com",
    "email": "booking@ungebaut.ch",
    "telephone": "+41775210295",
    "founder": [
      { "@type": "Person", "name": "Philippos Theofanidis" },
      { "@type": "Person", "name": "Luna Theofanidis" }
    ],
    "foundingDate": "YYYY",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Röntgenstrasse 10",
      "postalCode": "8005",
      "addressLocality": "Zürich",
      "addressCountry": "CH"
    },
    "areaServed": ["CH", "DE", "AT", "IT", "GB", "ES"],
    "sameAs": [
      "https://www.instagram.com/...",
      "https://www.linkedin.com/...",
      "https://www.behance.net/..."
    ]
  }
</script>
```

### Verdict

The new About page is a **major step up** from the live site for AI extractability — definition + founders + capabilities is the right shape. To actually win citations you still need: dated entity, schema markup, FAQ, real social URLs, and **third-party presence** (Tier 1 above), which no on-site change can fix.
