// UNGEBAUT — Leistungen + Preise. Deutsch primär. Diese Datenquelle füttert
// die ServicesView und das OfferCatalog-Schema in index.html.
//
// Reihenfolge der Studios bewusst gewählt: (1) Standbild-Visualisierung als
// Kernkompetenz, (2) Bewegtbild/VR als Erweiterung, (3) Vermarktungs-
// Webseiten als Bündel-Angebot für Bauträger und Marketing-Agenturen,
// (4) Drohnen-Dokumentation für Standort und Bauphasen. Die Webseiten
// sitzen direkt nach Animation/VR, weil sie häufig dieselben Render-
// Assets als Hero verwenden.

export const services = {
  intro:
    'UNGEBAUT führt vier Studios unter einem Dach: Standbild-Visualisierung, 3D-Design und Bewegtbild, Vermarktungs-Webseiten, sowie Drohnen-Dokumentation. Nachfolgend die Leistungen, Preise und Lieferzeiten.',

  offerings: [
    {
      id: 'visualisation',
      heading: 'Was umfasst eine Innenraum- und Aussenraumvisualisierung?',
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
      heading: 'Welche Leistungen umfassen 3D-Design, Animation und VR?',
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
      id: 'web',
      heading: 'Was umfassen Immobilien-Marketing-Webseiten?',
      summary:
        'Vermarktungs-Microsites für einzelne Immobilienprojekte — Design, Front-End-Programmierung und Visualisierung aus einem Studio. Rendering-Hero, Downloads-Bereich für Verkaufsdossier, Musterwohnungs-Walkthrough, Grundrisse und Standort-Karte. Diese Website selbst ist Beispiel-Produktion: WebGL-Galerie, smooth-scroll, prerenderter Build.',
      includes: [
        'Projekt-Microsites mit Rendering-Hero und Downloads',
        'Musterwohnungs-Walkthrough mit Grundrissen',
        'Vor-Bau-Vermarktung für Bauträger und Entwickler',
        'Post-Build-Verkaufs-Webseiten',
        'Design, Programmierung und Visualisierung aus einem Studio',
        'White-Label-Produktion für Marketing-Agenturen',
      ],
      from: 'Auf Anfrage',
      turnaround: '3–6 Wochen',
    },
    {
      id: 'drone',
      heading: 'Welche Leistungen umfassen Drohnenfotografie und Drohnenvideo?',
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
      service: 'Immobilien-Marketing-Webseite (Microsite)',
      from: 'Auf Anfrage',
      turnaround: '3–6 Wochen',
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
  ],

  pricingNotes: [
    'Preise verstehen sich exkl. MwSt. und sind Startwerte. Finale Offerten hängen von Umfang, Detailgrad und Anzahl der Ansichten ab.',
    'Jedes Projekt beinhaltet Plan-Review, Look-Development-Frame, finale Auslieferung und zwei Korrekturrunden, sofern nicht anders vermerkt.',
    'Senden Sie Ihre Pläne an booking@ungebaut.ch — Sie erhalten innerhalb von 1–2 Arbeitstagen ein Fix-Angebot.',
  ],
};
