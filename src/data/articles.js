// UNGEBAUT — Journal-Artikel. Strukturierte Daten für die JournalView und
// für BlogPosting-JSON-LD. Erstes Cornerstone-Stück: Preise CH 2026.

export const articles = [
  {
    slug: 'kosten-architekturvisualisierung-schweiz-2026',
    title: 'Was kostet eine Architekturvisualisierung in der Schweiz 2026?',
    description:
      'Vollständige Preisübersicht für Architekturvisualisierung in der Schweiz: Aussen- und Innenrenderings, Animation, VR und Drohnenarbeit — mit konkreten CHF-Werten, Lieferzeiten und Faktoren, die den Preis verändern.',
    author: {
      name: 'Philippos Theofanidis',
      role: 'Co-Founder & Visualisation Director, UNGEBAUT',
      credentials: 'Master in Architektur · CAS in Informatik',
    },
    publishedAt: '2026-04-29',
    updatedAt: '2026-04-29',
    readingTimeMin: 7,
    tags: ['Preise', 'Architekturvisualisierung', 'Schweiz', 'Wettbewerb'],
    lede:
      'Eine Architekturvisualisierung in der Schweiz kostet 2026 zwischen CHF 1’800 für ein einzelnes Aussenrendering und CHF 25’000+ für ein vollständiges Wettbewerbs- oder Animationspaket. Der Preis hängt von Detailgrad, Anzahl der Ansichten, Lieferzeit und der Komplexität des Modells ab.',
    sections: [
      {
        h2: 'Was kostet ein einzelnes Architekturrendering?',
        body: [
          'Ein einzelnes fotorealistisches Standbild liegt in der Schweiz typischerweise zwischen CHF 1’800 und CHF 3’500. Aussenrenderings starten bei rund CHF 1’800; Innenraum-Bilder sind durch den höheren Material- und Möblierungsaufwand mit ungefähr CHF 2’200 etwas teurer.',
          'Marktbeobachtungen aus der Schweiz und der DACH-Region zeigen drei Preissegmente: Einsteiger-Studios mit CHF 800–1’500 pro Bild, etablierte Anbieter mit CHF 1’800–3’500, und Premium-Häuser mit CHF 4’000–8’000+ pro Bild für Highend-Marketing-Visualisierungen.',
        ],
      },
      {
        h2: 'Wie unterscheiden sich Aussen- und Innenraum-Renderings im Preis?',
        body: [
          'Innenraum-Renderings kosten meist 15–30 % mehr als vergleichbare Aussenbilder. Der Mehraufwand entsteht durch Material- und Beleuchtungs-Setup, das Möblierungs- und Stylings-Layout sowie die höhere Anzahl an detaillierten Objekten in einer Szene.',
          'Bei einem typischen Mehrfamilienhaus rechnet man etwa CHF 1’800–2’400 pro Aussenansicht und CHF 2’200–3’000 pro Innenraumansicht.',
        ],
      },
      {
        h2: 'Was kostet ein Wettbewerbsbeitrag mit Visualisierungen?',
        body: [
          'Ein vollständiges Wettbewerbs-Paket mit zwei bis drei atmosphärischen Stills, Diagrammen und Plakat-Aufbereitung liegt zwischen CHF 8’500 und CHF 18’000. Grosse offene Wettbewerbe mit umfangreicher Bildwelt erreichen schnell CHF 25’000+.',
          'Kostenfaktoren: Anzahl Visualisierungen, Detailgrad des Modells, Plakat-Layout-Aufwand, Korrekturrunden und die typischerweise knappe Wettbewerbsfrist.',
        ],
      },
      {
        h2: 'Was kostet eine Architekturanimation?',
        body: [
          'Eine cinematische 30-Sekunden-Animation startet bei rund CHF 6’500. Längere Sequenzen oder mehrere Kameras in einem Cut erreichen CHF 12’000–25’000.',
          'Der grösste Kostenfaktor ist nicht die Länge, sondern die Anzahl unterschiedlicher Szenen, die separat ausgeleuchtet und gerendert werden müssen.',
        ],
      },
      {
        h2: 'Was kostet ein VR-Rundgang oder eine AR-Anwendung?',
        body: [
          'Ein VR-Rundgang (WebXR oder Headset-Build) liegt typischerweise zwischen CHF 9’000 und CHF 20’000, abhängig von Modellaufwand, Anzahl interaktiver Elemente und Ziel-Hardware.',
          'AR-Site-Overlays für Kundenpräsentationen sind günstiger, ab rund CHF 4’500, da sie mit weniger Geometrie und weniger interaktiven Zuständen auskommen.',
        ],
      },
      {
        h2: 'Was kostet Drohnen-Fotografie für Architekturprojekte?',
        body: [
          'Aerial-Standortdokumentation startet bei CHF 1’200 für ein Fotoset und ab CHF 2’400 für ein cinematisches Standortvideo. In der Schweiz kommen je nach Standort Bewilligungskosten von CHF 100–300 pro Flug dazu.',
          'Orthofotos und Kontextplatten für Wettbewerbe oder Baueingaben liegen bei CHF 1’500–2’500.',
        ],
      },
      {
        h2: 'Welche Faktoren verändern den Preis am stärksten?',
        body: [
          'Sechs Faktoren bestimmen den Endpreis einer Architekturvisualisierung:',
        ],
        list: [
          'Detailgrad: Wettbewerbs-Skizzen-Look ist günstiger als fotorealistisches Marketing-Material.',
          'Anzahl Ansichten: Jede zusätzliche Kamera erhöht Render- und Korrekturaufwand.',
          'Modellqualität: Gut strukturierte Pläne aus Rhino, Revit oder ArchiCAD reduzieren Vorbereitungszeit deutlich.',
          'Lieferzeit: Express unter 5 Tagen führt typischerweise zu 25–50 % Aufschlag.',
          'Korrekturrunden: Eine Runde ist Standard; jede zusätzliche kostet CHF 200–600.',
          'Nutzungsrechte: Print- und Print-Plus-Web-Rechte sind im Standardpreis enthalten; Out-of-Home-Werbung wird separat lizenziert.',
        ],
      },
      {
        h2: 'Wie lange dauert ein typisches Renderingprojekt?',
        body: [
          'Vom freigegebenen Plan bis zum finalen Bild rechnet man bei einem einzelnen Standbild 5 bis 10 Arbeitstage, inklusive einer Korrekturrunde. Wettbewerbs-Pakete laufen 3 bis 4 Wochen, Animationen 3 bis 6 Wochen.',
          'Für VR-Rundgänge sollte man 4 bis 6 Wochen einplanen, da Modell-Optimierung für Echtzeit-Engines zusätzliche Zeit benötigt.',
        ],
      },
      {
        h2: 'Wie wählt man das richtige Studio?',
        body: [
          'Drei Kriterien zählen mehr als der Preis:',
        ],
        list: [
          'Architektonischer Hintergrund: Studios mit ausgebildeten Architekten verstehen Pläne, Schnitte und Detailfragen ohne Übersetzungsverlust.',
          'Spezialisierung: Wettbewerbs-Atmosphären, Marketing-Hochglanz und technische Baueingabe-Visualisierungen verlangen unterschiedliche Skill-Sets.',
          'Prozess-Transparenz: Klare Zwischenfreigaben (Plan-Review, Look-Development-Frame, finale Auslieferung) verhindern Kosten-Überraschungen.',
        ],
      },
      {
        h2: 'Was ist im Standardpreis enthalten?',
        body: [
          'Bei UNGEBAUT beinhaltet jedes Projekt Plan-Review, einen Look-Development-Frame zur Abnahme, finale Auslieferung in Druck- und Web-Auflösung sowie eine Korrekturrunde. Senden Sie Ihre Pläne an booking@ungebaut.ch — Sie erhalten innerhalb von 24 Stunden ein Fix-Angebot.',
        ],
      },
    ],
    faqRefs: [
      'Was kostet eine Architekturvisualisierung?',
      'Wie lange dauert ein typisches Renderingprojekt?',
      'Welche Dateiformate akzeptiert ihr?',
      'Wie viele Korrekturrunden sind enthalten?',
    ],
  },
];

export const getArticle = (slug) =>
  articles.find((a) => a.slug === slug) ?? null;
