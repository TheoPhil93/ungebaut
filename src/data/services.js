// UNGEBAUT — Leistungen + Preise. Deutsch primär. Diese Datenquelle füttert
// die ServicesView und das OfferCatalog-Schema in index.html.

export const services = {
  intro:
    'UNGEBAUT führt vier Studios unter einem Dach: Standbild-Visualisierung, 3D-Design und Bewegtbild, Drohnen-Dokumentation, sowie Immobilien-Marketing-Webseiten. Nachfolgend die Leistungen, Preise und Lieferzeiten.',

  offerings: [
    {
      id: 'visualisation',
      heading: 'Was umfasst Architektur- und Innenraum-Visualisierung?',
      summary:
        'Fotorealistische Standbilder von Gebäuden, Innenräumen und urbanen Szenen — für Wettbewerbe, Marketing, Baueingaben und Markenkampagnen. Produziert aus Ihren Rhino-, Revit-, ArchiCAD-, SketchUp- oder AutoCAD-Dateien.',
      includes: [
        'Aussenraum-Architekturbilder',
        'Innenraum- und Lifestyle-Bilder',
        'Stadt- und Landschaftsbilder',
        'Immobilien-Marketing-Visuals',
        'Atmosphärische Wettbewerbs-Stills',
      ],
      from: 'CHF 1’500',
      turnaround: '5–10 Arbeitstage',
    },
    {
      id: 'motion',
      heading: 'Was umfasst 3D-Design, Animation und VR?',
      summary:
        'Bewegtbild, immersive Erlebnisse und interaktive 3D-Inhalte für Projekte, die mehr brauchen als ein einzelnes Bild. Vom 30-Sekunden-Flug bis zum vollständigen VR-Rundgang durch einen ungebauten Raum.',
      includes: [
        'Architekturanimationen und Flythroughs',
        'Kameragetrackte Motion Graphics',
        'VR-Rundgänge (WebXR)',
      ],
      from: 'CHF 2’500',
      turnaround: '2–6 Wochen',
    },
    {
      id: 'drone',
      heading: 'Was umfasst Drohnen-Fotografie und -Video?',
      summary:
        'Aerial-Dokumentation von Grundstücken, Bestandsbauten und fertiggestellten Projekten vor Ort. Eingesetzt für Kontextplatten, Standortanalysen, Vorher-/Nachher-Sequenzen und Baueingaben.',
      includes: [
        'Aerial-Standortfotografie',
        'Cinematische Standortvideos',
        'Orthofotos für Kontextplatten',
        'Vor-Bau-Dokumentation',
        'Bauabschluss-Dokumentation',
      ],
      from: 'CHF 1’200',
      turnaround: '3–5 Arbeitstage',
    },
    {
      id: 'web',
      heading: 'Was umfasst Immobilien-Marketing-Webseiten?',
      summary:
        'Produktionsreife Microsites und Verkaufs-Webseiten für Immobilienprojekte — bewegungsreich, scrollgetrieben, performant. Diese Website ist ein Beispiel derselben Produktion: WebGL-Galerie, smooth-scroll, prerenderter Build, lighthouse-tauglich.',
      includes: [
        'Projekt-Microsites für Bauträger und Entwickler',
        'Developer-Landing-Pages für laufende Vermarktung',
        'Post-Build-Verkaufs-Webseiten',
        'White-Label-Produktion für Marketing-Agenturen',
        'SEO-, Performance- und Accessibility-Audit',
      ],
      from: 'Auf Anfrage',
      turnaround: '3–6 Wochen',
    },
  ],

  pricingTable: [
    {
      service: 'Aussenrendering',
      from: 'CHF 1’800',
      turnaround: '5–10 Tage',
      revisions: '2 Runden',
    },
    {
      service: 'Innenraum-Rendering',
      from: 'CHF 1’500',
      turnaround: '5–10 Tage',
      revisions: '2 Runden',
    },
    {
      service: 'Wettbewerbs-Paket (5 Stills)',
      from: 'CHF 6’500',
      turnaround: '3–4 Wochen',
      revisions: '2 Runden',
    },
    {
      service: 'Animation (30 s)',
      from: 'CHF 2’500',
      turnaround: '2–3 Wochen',
      revisions: '2 Runden',
    },
    {
      service: 'VR-Rundgang (WebXR)',
      from: 'CHF 5’000',
      turnaround: '4–6 Wochen',
      revisions: '2 Runden',
    },
    {
      service: 'Drohnen-Fotoset',
      from: 'CHF 1’200',
      turnaround: '3–5 Tage',
      revisions: '—',
    },
    {
      service: 'Drohnen-Video',
      from: 'CHF 2’400',
      turnaround: '5–7 Tage',
      revisions: '2 Runden',
    },
    {
      service: 'Immobilien-Marketing-Webseite (Microsite)',
      from: 'Auf Anfrage',
      turnaround: '3–6 Wochen',
      revisions: '2 Runden',
    },
  ],

  pricingNotes: [
    'Preise verstehen sich exkl. MwSt. und sind Startwerte. Finale Offerten hängen von Umfang, Detailgrad und Anzahl der Ansichten ab.',
    'Jedes Projekt beinhaltet Plan-Review, Look-Development-Frame, finale Auslieferung und zwei Korrekturrunden, sofern nicht anders vermerkt.',
    'Senden Sie Ihre Pläne an booking@ungebaut.ch — Sie erhalten innerhalb von 1–2 Arbeitstagen ein Fix-Angebot.',
  ],
};
