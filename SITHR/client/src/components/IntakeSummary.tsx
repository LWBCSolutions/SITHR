import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntakeSummaryProps {
  caseRef: string;
  situationType: string;
  serviceLength: string;
  previousAction: string;
  policies: Array<{ filename: string }>;
  attachments: Array<{ filename: string }>;
  locked: boolean;
  onEdit?: () => void;
}

export default function IntakeSummary({
  caseRef,
  situationType,
  serviceLength,
  previousAction,
  policies,
  attachments,
  locked,
  onEdit,
}: IntakeSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="intake-summary">
      <button
        className="intake-summary__header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="intake-summary__header-left">
          <span className="intake-summary__label">Situation Context</span>
          {situationType && (
            <span className="intake-summary__type-badge">{situationType}</span>
          )}
          {caseRef && (
            <span className="intake-summary__case-badge">{caseRef}</span>
          )}
        </div>
        <div className="intake-summary__header-right">
          {!locked && onEdit && (
            <span
              className="intake-summary__edit-btn"
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              role="button"
              tabIndex={0}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z" />
              </svg>
              Edit
            </span>
          )}
          {locked && (
            <span className="intake-summary__locked">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="#999" strokeWidth="1.2" strokeLinecap="round">
                <rect x="1" y="5" width="8" height="6" rx="1" />
                <path d="M3 5V3a2 2 0 014 0v2" />
              </svg>
              Context sent
            </span>
          )}
          <motion.span
            className="intake-summary__chevron"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {'\u25BE'}
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="intake-summary__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            style={{ overflow: 'hidden' }}
          >
            <div className="intake-summary__grid">
              <div className="intake-summary__field">
                <span className="intake-summary__field-label">Situation</span>
                <span className="intake-summary__field-value">{situationType || '-'}</span>
              </div>
              <div className="intake-summary__field">
                <span className="intake-summary__field-label">Service length</span>
                <span className="intake-summary__field-value">{serviceLength || '-'}</span>
              </div>
              <div className="intake-summary__field">
                <span className="intake-summary__field-label">Previous action</span>
                <span className="intake-summary__field-value">{previousAction || '-'}</span>
              </div>
              <div className="intake-summary__field">
                <span className="intake-summary__field-label">Policies uploaded</span>
                <span className="intake-summary__field-value">
                  {policies.length > 0
                    ? policies.map((p, i) => (
                        <span key={i} className="intake-summary__file-pill">{p.filename}</span>
                      ))
                    : 'None'}
                </span>
              </div>
              {attachments.length > 0 && (
                <div className="intake-summary__field">
                  <span className="intake-summary__field-label">Documents attached</span>
                  <span className="intake-summary__field-value">
                    {attachments.map((a, i) => (
                      <span key={i} className="intake-summary__file-pill">{a.filename}</span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
