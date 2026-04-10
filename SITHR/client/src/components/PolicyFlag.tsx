import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PolicyFlagProps {
  filename: string;
  overall: string;
  observations: string[];
  disclaimer: string;
}

export default function PolicyFlag({ filename, overall, observations, disclaimer }: PolicyFlagProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isBroadlySound = overall === 'broadly sound';

  if (observations.length === 0 && isBroadlySound) return null;

  return (
    <div className={`policy-flag ${isBroadlySound ? 'policy-flag--sound' : 'policy-flag--observations'}`}>
      <button
        className="policy-flag__header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="policy-flag__header-left">
          <span className="policy-flag__icon">
            {isBroadlySound ? '\u2713' : '!'}
          </span>
          <div>
            <span className="policy-flag__title">
              Policy Review Observations
            </span>
            <span className="policy-flag__subtitle">
              {filename} - {observations.length} observation{observations.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <motion.span
          className="policy-flag__chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {'\u25BE'}
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="policy-flag__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="policy-flag__intro">
              Based on a review of your uploaded policy, the following may be worth
              discussing with your policy writer or HR consultant before relying on
              this document.
            </p>
            <ul className="policy-flag__list">
              {observations.map((obs, i) => (
                <li key={i} className="policy-flag__item">{obs}</li>
              ))}
            </ul>
            <p className="policy-flag__disclaimer">{disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
