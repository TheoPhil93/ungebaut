import { SeoHead } from './SeoHead';

// Swiss-law compliant Impressum scaffold. Editorially neutral placeholders
// where the operator must fill in real information before launch — see
// `TODO:` markers below. Required by Schweizer UWG Art. 3 Abs. 1 lit. s for
// any commercial site operated from Switzerland.
export function ImpressumView() {
  return (
    <section className="view legal" aria-label="Impressum">
      <SeoHead
        title="Impressum — UNGEBAUT"
        description="Impressum von UNGEBAUT — Architekturvisualisierungs-Studio in Zürich."
        path="/impressum"
      />

      <header className="legal__header">
        <p className="legal__eyebrow">Rechtliches</p>
        <h1 className="legal__title">Impressum</h1>
      </header>

      <div className="legal__body">
        <section className="legal__block">
          <h2>Verantwortlich für den Inhalt</h2>
          <p>
            UNGEBAUT
            <br />
            {/* TODO: Vollständige Firmierung gemäss Handelsregister einsetzen */}
            Inhaber: Philippos &amp; Luna Theofanidis
          </p>
        </section>

        <section className="legal__block">
          <h2>Adresse</h2>
          <p>
            {/* TODO: Strasse + Hausnummer einsetzen */}
            Strasse Nr.
            <br />
            8000 Zürich
            <br />
            Schweiz
          </p>
        </section>

        <section className="legal__block">
          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:booking@ungebaut.ch">booking@ungebaut.ch</a>
            <br />
            Telefon: <a href="tel:+41775210295">+41 77 521 02 95</a>
          </p>
        </section>

        <section className="legal__block">
          <h2>Handelsregister &amp; Steuern</h2>
          <p>
            {/* TODO: Falls im HR eingetragen, UID und Handelsregisternummer
                einsetzen. Falls nicht eintragungspflichtig, Block entfernen
                oder durch entsprechenden Hinweis ersetzen. */}
            Handelsregister-Eintrag: noch zu ergänzen.
            <br />
            UID: noch zu ergänzen.
            <br />
            MwSt-Nr.: noch zu ergänzen.
          </p>
        </section>

        <section className="legal__block">
          <h2>Haftungsausschluss</h2>
          <p>
            Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt.
            UNGEBAUT übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und
            Aktualität der bereitgestellten Inhalte. Die Nutzung erfolgt auf eigenes Risiko.
          </p>
          <p>
            Verweise und Links auf Websites Dritter liegen ausserhalb des
            Verantwortungsbereichs von UNGEBAUT. Eine Haftung für die Inhalte verlinkter
            Websites wird abgelehnt.
          </p>
        </section>

        <section className="legal__block">
          <h2>Urheberrecht</h2>
          <p>
            Sämtliche auf dieser Website veröffentlichten Inhalte (Texte, Bilder,
            Visualisierungen, Animationen) sind urheberrechtlich geschützt. Eine
            Vervielfältigung, Bearbeitung, Verbreitung oder Verwertung — auch in Auszügen —
            bedarf der vorherigen schriftlichen Zustimmung von UNGEBAUT.
          </p>
        </section>
      </div>
    </section>
  );
}
