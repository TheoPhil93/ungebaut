import { SeoHead } from './SeoHead';

// Datenschutzerklärung scaffold for Swiss DPA + EU GDPR compliance. The
// site currently has no analytics, no contact form, no third-party tracking
// — once any of those are added, the relevant section here must be
// extended (see TODO markers). Last review date should be updated on every
// edit so users can tell when the policy was last touched.
const LAST_UPDATED = '2026-04-30';

export function DatenschutzView() {
  return (
    <section className="view legal" aria-label="Datenschutzerklärung">
      <SeoHead
        title="Datenschutzerklärung — UNGEBAUT"
        description="Datenschutzerklärung von UNGEBAUT — Information zur Erhebung und Verarbeitung personenbezogener Daten."
        path="/datenschutz"
      />

      <header className="legal__header">
        <p className="legal__eyebrow">Rechtliches</p>
        <h1 className="legal__title">Datenschutzerklärung</h1>
        <p className="legal__meta">Stand: {LAST_UPDATED}</p>
      </header>

      <div className="legal__body">
        <section className="legal__block">
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p>
            UNGEBAUT
            <br />
            {/* TODO: Adresse einsetzen */}
            Strasse Nr.
            <br />
            8000 Zürich
            <br />
            Schweiz
            <br />
            <a href="mailto:booking@ungebaut.ch">booking@ungebaut.ch</a>
          </p>
        </section>

        <section className="legal__block">
          <h2>2. Erhebung und Verarbeitung von Daten</h2>
          <p>
            Beim Besuch dieser Website werden durch den Hosting-Provider
            automatisch technische Zugriffsdaten in Server-Logfiles erfasst
            (IP-Adresse, Datum und Uhrzeit, abgerufene URL, übertragene
            Datenmenge, Browser-Typ und -Version, Betriebssystem,
            Referrer-URL). Diese Daten dienen ausschliesslich der
            Sicherstellung des Betriebs und werden nicht mit anderen
            Datenquellen verknüpft.
          </p>
          <p>
            Bei einer Kontaktaufnahme per E-Mail oder Telefon werden die uns
            mitgeteilten Daten zur Beantwortung der Anfrage und für mögliche
            Folgekommunikation gespeichert.
          </p>
        </section>

        <section className="legal__block">
          <h2>3. Cookies</h2>
          <p>
            {/* TODO: Bei Einführung von Analytics oder Marketing-Cookies hier
                ergänzen und Cookie-Banner aktivieren (siehe Issue #19). */}
            Diese Website verwendet derzeit keine Cookies, die über die
            technische Funktion der Seite hinausgehen. Es findet keine
            Auswertung des Nutzerverhaltens statt.
          </p>
        </section>

        <section className="legal__block">
          <h2>4. Externe Dienste</h2>
          <p>
            {/* TODO: Bei Einbindung von Google Fonts (CDN), Maps, Analytics
                oder ähnlichem hier dokumentieren. Aktuell self-hosted. */}
            Schriftarten werden direkt von unserem Server ausgeliefert.
            Es werden keine Drittanbieter-CDNs für Schriften, Skripte oder
            Stilvorlagen eingebunden.
          </p>
        </section>

        <section className="legal__block">
          <h2>5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht, jederzeit unentgeltlich Auskunft über Ihre
            bei uns gespeicherten Personendaten zu verlangen. Zudem können
            Sie deren Berichtigung, Sperrung oder Löschung verlangen, soweit
            keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Bei
            Verstössen können Sie sich an den Eidgenössischen Datenschutz- und
            Öffentlichkeitsbeauftragten (EDÖB) wenden.
          </p>
          <p>
            Anfragen richten Sie bitte an{' '}
            <a href="mailto:booking@ungebaut.ch">booking@ungebaut.ch</a>.
          </p>
        </section>

        <section className="legal__block">
          <h2>6. Datensicherheit</h2>
          <p>
            Diese Website nutzt SSL/TLS-Verschlüsselung. Eine Datenübertragung
            erfolgt verschlüsselt. Wir treffen technische und organisatorische
            Massnahmen, um Ihre Daten gegen zufällige oder vorsätzliche
            Manipulation, Verlust oder Zerstörung zu schützen.
          </p>
        </section>

        <section className="legal__block">
          <h2>7. Anpassungen</h2>
          <p>
            Diese Datenschutzerklärung kann jederzeit ohne Vorankündigung
            angepasst werden. Massgebend ist die jeweils aktuelle, auf dieser
            Website veröffentlichte Fassung.
          </p>
        </section>
      </div>
    </section>
  );
}
