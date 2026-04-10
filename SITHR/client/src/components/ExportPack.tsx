import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateExportPack } from '../lib/exportPack';
import type { Message } from '../lib/api';

interface ExportPackProps {
  messages: Message[];
  conversationTitle: string;
  caseRef: string;
  disabled: boolean;
  packCount?: number;
}

export default function ExportPack({
  messages,
  conversationTitle,
  caseRef,
  disabled,
  packCount = 0,
}: ExportPackProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  // Close info popover on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowInfo(false);
      }
    }
    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showInfo]);

  const handleExport = async () => {
    if (exporting || disabled || messages.length === 0) return;

    setExporting(true);
    setError('');
    setProgress('Starting export...');

    try {
      await generateExportPack(messages, conversationTitle, caseRef, setProgress);
      setProgress('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      setError(msg);
      setProgress('');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-pack-container">
      <button
        className="export-pack-btn"
        onClick={handleExport}
        disabled={exporting || disabled || messages.length === 0}
        title="Export document pack"
      >
        {exporting ? (
          <>
            <div className="export-spinner" />
            <span className="export-btn-text">{progress || 'Exporting...'}</span>
          </>
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 1v10M4 7l4 4 4-4" />
              <path d="M2 12v2h12v-2" />
            </svg>
            <span className="export-btn-text">Export Pack{packCount > 0 ? ` (${packCount})` : ''}</span>
          </>
        )}
      </button>

      <div className="info-btn-wrapper" ref={infoRef}>
        <button
          className="info-btn"
          onClick={() => setShowInfo(!showInfo)}
          title="What's in the export pack?"
        >
          i
        </button>

        {showInfo && (
          <div className="info-popover">
            <h4 className="info-popover-title">Document Pack Contents</h4>
            <div className="info-popover-body">
              <p>
                The export pack is a ZIP file containing:
              </p>
              <p><strong>binder.pdf</strong></p>
              <ul>
                <li>Cover page with case reference and date</li>
                <li>Full conversation thread</li>
                <li>Action checklist with next steps</li>
                <li>List of all generated documents</li>
              </ul>
              <p><strong>documents/ folder</strong></p>
              <ul>
                <li>Word (.docx) files generated from the conversation</li>
                <li>Templates filled with details from your discussion</li>
                <li>All documents are fully editable in Microsoft Word</li>
                <li>Variable fields marked [INSERT: description] for completion</li>
              </ul>
              <p className="info-popover-note">
                A separate guidance request analyses the conversation to determine
                which documents are relevant. This request is not stored in the
                conversation history.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="export-error">
          {error}
          <button className="export-error-dismiss" onClick={() => setError('')}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
