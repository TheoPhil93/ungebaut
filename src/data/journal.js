// UNGEBAUT — Journal. Kurze Notizen aus dem Studio: Prozess, Material,
// Werkzeug. Reihenfolge in der UI = Reihenfolge in diesem Array (neueste
// zuerst). Datum als ISO-String, damit Intl.DateTimeFormat in der View
// die Anzeige übernimmt.

export const journal = {
  intro:
    'Notizen aus dem Studio — Prozess, Material und das Werkzeug, mit dem wir arbeiten. Knapp gehalten, ohne Anspruch auf Vollständigkeit.',

  entries: [
    {
      id: 'lichtsetzung-im-modell',
      title: 'Lichtsetzung im Modell',
      date: '2026-04-18',
      tags: ['Prozess', 'Visualisierung'],
      excerpt:
        'Warum wir Lichtsetzungen im Modell machen, bevor das erste Mal gerendert wird — und was wir dabei über den Raum lernen.',
      body: [
        'Bevor ein Bild produziert wird, läuft ein Lichtsetz-Pass im Viewport. Das ist kein finaler Render, sondern eine Studie: vier oder fünf Sonnenstände, je ein Innenraum-Setup, vielleicht eine zweite Lichtquelle. Wir suchen den Moment, in dem die Geometrie sich entscheidet zu sprechen.',
        'Diese Studie ersetzt einen Kalender. Erst danach wissen wir, welcher Tag, welche Stunde, welcher Schatten. Das spart später drei Korrekturrunden.',
      ],
    },
    {
      id: 'warum-stillbild-zuerst',
      title: 'Warum Standbild zuerst',
      date: '2026-03-02',
      tags: ['Prozess', 'Animation'],
      excerpt:
        'Animation kommt selten als erstes Medium. Wir starten mit dem Standbild — und erklären, warum.',
      body: [
        'Eine Animation, die ohne Standbild beginnt, hat keine Achse. Das Standbild ist die Frage: welcher Frame trägt das Projekt? Erst wenn diese Frage beantwortet ist, lohnt sich die Bewegung.',
        'Praktisch heisst das: ein Hero-Frame zuerst, dann die Kamera als Erweiterung dieses Frames. Die Animation ist dann nicht der Anfang, sondern die längere Lesart.',
      ],
    },
    {
      id: 'drohne-als-vermessung',
      title: 'Drohne als Vermessung',
      date: '2026-01-21',
      tags: ['Drohne', 'Standort'],
      excerpt:
        'Aerial-Aufnahmen sind nicht nur Bild — wir nutzen sie zunehmend zur Vermessung von Bestandskontexten.',
      body: [
        'Bei Wettbewerben hilft eine kontrollierte Drohnenflugbahn mehr als ein Schwarm Beweisfotos. Wir fliegen ein Raster, fotogrammetrieren das Resultat und haben so den Standort als bemasstes 3D-Modell — bevor irgendein Plan eingelesen ist.',
        'Das verändert auch die Renderings, die danach entstehen. Der Schatten der Nachbarbebauung wird real, nicht angenommen.',
      ],
    },
  ],
};
