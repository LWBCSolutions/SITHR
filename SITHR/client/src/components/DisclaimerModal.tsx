import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const SESSION_KEY = 'sithr-disclaimer-acknowledged';

interface DisclaimerModalProps {
  children: React.ReactNode;
}

export default function DisclaimerModal({ children }: DisclaimerModalProps) {
  const [acknowledged, setAcknowledged] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (acknowledged) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
  }, [acknowledged]);

  const handleContinue = () => {
    if (!checked) return;
    setAcknowledged(true);
    sessionStorage.setItem(SESSION_KEY, 'true');
  };

  if (acknowledged) {
    return <>{children}</>;
  }

  return (
    <>
      {createPortal(
        <motion.div
          className="disclaimer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="disclaimer-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="disclaimer-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="#2D7DD2" strokeWidth="2.5" fill="none" />
                <text x="24" y="32" textAnchor="middle" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" fill="#2D7DD2">i</text>
              </svg>
            </div>

            <h2 className="disclaimer-title">Before You Begin</h2>

            <div className="disclaimer-body">
              <p>
                SIT-HR provides system-generated HR and employment law guidance for workplace
                management purposes.
              </p>
              <p>Before using this tool, please read and acknowledge the following:</p>
              <div className="disclaimer-warning">
                <p>
                  <strong>DO NOT</strong> enter real employee names, personal identifiers,
                  National Insurance numbers, dates of birth, addresses, or any other personally
                  identifiable information into this system. Use a case reference number instead.
                </p>
              </div>
              <p>
                This tool provides guidance only - not legal advice. Employment law is complex
                and fact-specific. Outputs should be reviewed before acting on them and may not
                account for every circumstance.
              </p>
              <p>
                Always seek qualified legal advice before taking formal action against an
                employee, issuing a dismissal, or where a protected characteristic or protected
                disclosure may be in play.
              </p>
              <p>
                SIT-HR is a management support tool. It does not replace a qualified HR
                professional or employment solicitor.
              </p>
            </div>

            <label className="disclaimer-checkbox-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="disclaimer-checkbox"
              />
              <span>I have read and understood the above</span>
            </label>

            <button
              className="disclaimer-btn"
              onClick={handleContinue}
              disabled={!checked}
            >
              Continue to SIT-HR
            </button>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </>
  );
}
