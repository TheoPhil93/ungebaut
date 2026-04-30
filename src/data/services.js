// UNGEBAUT — Leistungen + Preise. Deutsch primär. Diese Datenquelle füttert
// die ServicesView und das OfferCatalog-Schema in index.html.

export const services = {
  intro:
    'UNGEBAUT führt drei Studios unter einem Dach: Standbild-Visualisierung, 3D-Design und Bewegtbild, sowie Drohnen-Dokumentation. Nachfolgend die Leistungen, Preise und Lieferzeiten.',

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
        'Wettbewerbs-Plakate und atmosphärische Stills',
      ],
      from: 'CHF 1’800',
      turnaround: '5–10 Arbeitstage',
    },
    {
      id: 'motion',
      heading: 'Was umfasst 3D-Design, Animation und VR/AR?',
      summary:
        'Bewegtbild, immersive Erlebnisse und interaktive 3D-Inhalte für Projekte, die mehr brauchen als ein einzelnes Bild. Vom 30-Sekunden-Flug bis zum vollständigen VR-Rundgang durch einen ungebauten Raum.',
      includes: [
        'Architekturanimationen und Flythroughs',
        'Kameragetrackte Motion Graphics',
        'VR-Rundgänge (WebXR oder Headset)',
        'AR-Site-Overlays für Kundenpräsentationen',
        'Echtzeit-3D-Szenen (Unreal / Twinmotion)',
      ],
      from: 'CHF 6’500',
      turnaround: '3–6 Wochen',
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
  ],

  pricingTable: [
    { service: 'Aussenrendering', from: 'CHF 1’800', turnaround: '5–10 Tage', revisions: '1 Runde' },
    { service: 'Innenraum-Rendering', from: 'CHF 2’200', turnaround: '5–10 Tage', revisions: '1 Runde' },
    { service: 'Wettbewerbs-Paket', from: 'CHF 8’500', turnaround: '3–4 Wochen', revisions: '2 Runden' },
    { service: 'Animation (30 s)', from: 'CHF 6’500', turnaround: '3–4 Wochen', revisions: '1 Runde' },
    { service: 'VR-Rundgang', from: 'CHF 9’000', turnaround: '4–6 Wochen', revisions: '1 Runde' },
    { service: 'Drohnen-Fotoset', from: 'CHF 1’200', turnaround: '3–5 Tage', revisions: '—' },
    { service: 'Drohnen-Video', from: 'CHF 2’400', turnaround: '5–7 Tage', revisions: '1 Runde' },
  ],

  pricingNotes: [
    'Preise verstehen sich exkl. MwSt. und sind Startwerte. Finale Offerten hängen von Umfang, Detailgrad und Anzahl der Ansichten ab.',
    'Jedes Projekt beinhaltet Plan-Review, Look-Development-Frame, finale Auslieferung und eine Korrekturrunde, sofern nicht anders vermerkt.',
    'Senden Sie Ihre Pläne an booking@ungebaut.ch — Sie erhalten innerhalb von 24 Stunden ein Fix-Angebot.',
  ],
};
