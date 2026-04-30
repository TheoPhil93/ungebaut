import { about } from '../data/about';
import { faq } from '../data/faq';
import { TextCascade } from './TextCascade';
import { SeoHead } from './SeoHead';
import { JsonLd } from './JsonLd';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: 'de-CH',
  mainEntity: faq.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export function AboutView() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="view about" aria-label="Über UNGEBAUT">
      <SeoHead
        title="UNGEBAUT — Studio, Gründer & Kontakt"
        description="UNGEBAUT — Architekturvisualisierungs-Studio in Zürich, gegründet 2021 von Philippos und Luna Theofanidis. Studio, Gründer, Kunden und Kontakt."
        path="/about"
      />
      <JsonLd data={FAQ_SCHEMA} />
      <p className="about__heading">Studio — Architekturvisualisierung</p>

      {/* Top spread: introductory paragraph on the left, contact details on
          the right. On narrow screens the contact card stacks below the
          intro. */}
      <div className="about__top">
        <h1 className="about__intro" aria-label={about.intro} lang="de">
          <TextCascade
            text={about.intro}
            axis="y"
            range={110}
            totalDuration={1.6}
            letterDelay={0.012}
            startDelay={0.05}
            random
            reduced={reduced}
          />
        </h1>

        <aside className="about__top-contact" id="contact" aria-labelledby="contact-h2">
          <h2 className="about__h2" id="contact-h2">
            {about.contact.heading}
          </h2>

          <div className="about__contact-grid">
            <div className="about__contact-cell">
              <p className="about__contact-label">E-Mail</p>
              <a
                className="about__email"
                href={`mailto:${about.contact.email}`}
                data-cursor="hover"
              >
                {about.contact.email}
              </a>
            </div>

            <div className="about__contact-cell">
              <p className="about__contact-label">Telefon</p>
              <a
                className="about__contact-value"
                href={`tel:${about.contact.phone.replace(/\s+/g, '')}`}
                data-cursor="hover"
              >
                {about.contact.phone}
              </a>
            </div>

            <div className="about__contact-cell">
              <p className="about__contact-label">Studio</p>
              <p className="about__contact-value">{about.contact.address}</p>
            </div>

            <div className="about__contact-cell">
              <p className="about__contact-label">Folgen</p>
              <ul className="about__socials">
                {about.contact.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      data-cursor="hover"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <div className="about__section" id="studio">
        <h2 className="about__h2">{about.studio.heading}</h2>
        <div className="about__section-grid">
          <div className="about__body" lang="de">
            {about.studio.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <ul className="about__capabilities">
            {about.capabilities.map((cap) => (
              <li key={cap}>{cap}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about__section" id="founders">
        <h2 className="about__h2">{about.founders.heading}</h2>
        <ul className="about__founders">
          {about.founders.people.map((person) => (
            <li key={person.name} className="about__founder">
              <p className="about__founder-name">{person.name}</p>
              <p className="about__founder-role">{person.role}</p>
              <p className="about__founder-bio" lang="de">
                {person.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="about__section" id="clients">
        <h2 className="about__h2">{about.clients.heading}</h2>
        <div className="about__section-grid">
          <p className="about__clients-intro" lang="de">
            {about.clients.intro}
          </p>
          <ul className="about__clients-list">
            {about.clients.list.map((client) => (
              <li key={client}>{client}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="about__section" id="faq">
        <h2 className="about__h2">Häufige Fragen</h2>
        <div className="about__section-grid">
          <dl className="about__faq-list" lang="de">
            {faq.map(({ q, a }) => (
              <div className="about__faq-item" key={q}>
                <dt className="about__faq-q">{q}</dt>
                <dd className="about__faq-a">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
