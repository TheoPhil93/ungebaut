import { motion } from 'framer-motion';

// Aristide's `o6` (expo-out) approximated as cubic-bezier — see HomeView.
const ease = [0.16, 1, 0.3, 1];

// Footer block beneath the strip — independence credit + A/B/C/D meta grid +
// View Site CTA + SEO description. Pure presentation, no side effects.
export function ProjectFooterMeta({ project }) {
  return (
    <motion.footer
      className="proj-foot"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ duration: 0.95, ease, delay: 0.24 }}
    >
      <div className="proj-foot__left">
        <span>Independent Studio</span>
        <span className="proj-foot__muted">Available {new Date().getFullYear()}</span>
      </div>

      <dl className="proj-foot__meta-grid">
        <div className="proj-foot__meta-row">
          <dt>A</dt>
          <dd className="proj-foot__meta-key">Completed</dd>
          <dd className="proj-foot__meta-val">{project.year}</dd>
        </div>
        <div className="proj-foot__meta-row">
          <dt>B</dt>
          <dd className="proj-foot__meta-key">Type</dd>
          <dd className="proj-foot__meta-val">{project.tags[0] || '—'}</dd>
        </div>
        <div className="proj-foot__meta-row">
          <dt>C</dt>
          <dd className="proj-foot__meta-key">Role</dd>
          <dd className="proj-foot__meta-val">Visualisation &amp; Direction</dd>
        </div>
        <div className="proj-foot__meta-row">
          <dt>D</dt>
          <dd className="proj-foot__meta-key">Client</dd>
          <dd className="proj-foot__meta-val">{project.client}</dd>
        </div>
      </dl>

      <div className="proj-foot__cta">
        <span aria-hidden="true" className="proj-foot__arrow">
          ↗
        </span>
        <span className="proj-foot__cta-label">View Site</span>
      </div>

      <p className="proj-foot__seo">
        {project.description}
        {project.location ? ` Located in ${project.location}.` : ''}
      </p>
    </motion.footer>
  );
}
