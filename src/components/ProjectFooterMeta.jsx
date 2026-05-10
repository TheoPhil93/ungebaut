import { motion } from 'framer-motion';

// Aristide's `o6` (expo-out) approximated as cubic-bezier — see HomeView.
const ease = [0.16, 1, 0.3, 1];

// Footer block beneath the strip — independence credit + A/B/C/D meta grid +
// View Site CTA + SEO description. Pure presentation, no side effects.
export function ProjectFooterMeta({ project }) {
  return (
    <motion.footer
      className="detail__footer"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ duration: 0.95, ease, delay: 0.24 }}
    >
      <div className="detail__footer-left">
        <span>Independent Studio</span>
        <span className="detail__footer-muted">Available {new Date().getFullYear()}</span>
      </div>

      <dl className="detail__meta-grid">
        <div className="detail__meta-row">
          <dt>A</dt>
          <dd className="detail__meta-key">Completed</dd>
          <dd className="detail__meta-val">{project.year}</dd>
        </div>
        <div className="detail__meta-row">
          <dt>B</dt>
          <dd className="detail__meta-key">Type</dd>
          <dd className="detail__meta-val">{project.tags[0] || '—'}</dd>
        </div>
        <div className="detail__meta-row">
          <dt>C</dt>
          <dd className="detail__meta-key">Role</dd>
          <dd className="detail__meta-val">Visualisation &amp; Direction</dd>
        </div>
        <div className="detail__meta-row">
          <dt>D</dt>
          <dd className="detail__meta-key">Client</dd>
          <dd className="detail__meta-val">{project.client}</dd>
        </div>
      </dl>

      <div className="detail__footer-cta">
        <span aria-hidden="true" className="detail__footer-arrow">
          ↗
        </span>
        <span className="detail__footer-cta-label">View Site</span>
      </div>

      <p className="detail__seo">
        {project.description}
        {project.location ? ` Located in ${project.location}.` : ''}
      </p>
    </motion.footer>
  );
}
