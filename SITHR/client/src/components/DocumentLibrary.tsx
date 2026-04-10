import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import DocumentContentRenderer from './DocumentContentRenderer';
import PageFooter from './PageFooter';

interface DocListItem {
  id: string;
  title: string;
  category: string;
  tier: 1 | 2;
  description: string;
}

interface DocFull {
  id: string;
  title: string;
  category: string;
  tier: 1 | 2;
  description: string;
  content: string;
  reviewNotice: string;
}

const CATEGORIES = ['all', 'absence', 'disciplinary', 'grievance', 'capability', 'general', 'email'];
const TIER_OPTIONS = ['all', '1', '2'];
const TIER_LABELS: Record<string, string> = { all: 'All', '1': 'Administrative', '2': 'Requires Review' };

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  absence: 'doc-lib-badge--absence',
  disciplinary: 'doc-lib-badge--disciplinary',
  grievance: 'doc-lib-badge--grievance',
  capability: 'doc-lib-badge--capability',
  general: 'doc-lib-badge--general',
  email: 'doc-lib-badge--email',
};

// ---------------------------------------------------------------------------
// DOCX generation
// ---------------------------------------------------------------------------

async function generateSingleDocx(doc: DocFull): Promise<void> {
  const { generateAndDownloadDocx } = await import('../lib/docxGenerator');
  await generateAndDownloadDocx({
    content: doc.content,
    title: doc.title,
    tier: doc.tier as 1 | 2,
    category: doc.category,
    reviewNotice: doc.reviewNotice,
    filename: `${doc.id.replace(/_/g, '-')}-template.docx`,
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<DocListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTier, setActiveTier] = useState('all');
  const [previewDoc, setPreviewDoc] = useState<DocFull | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => setDocuments(data.documents || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isSearching = debouncedSearch.length > 0;
  const filtered = documents.filter(d => {
    if (isSearching) {
      const q = debouncedSearch.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || d.category.includes(q);
    }
    const catMatch = activeCategory === 'all' || d.category === activeCategory;
    const tierMatch = activeTier === 'all' || String(d.tier) === activeTier;
    return catMatch && tierMatch;
  });
  const availableCategories = ['all', ...new Set(documents.map(d => d.category))];

  const fetchFullDoc = useCallback(async (id: string): Promise<DocFull | null> => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.document || null;
    } catch {
      return null;
    }
  }, []);

  const handlePreview = useCallback(async (id: string) => {
    const doc = await fetchFullDoc(id);
    if (doc) setPreviewDoc(doc);
  }, [fetchFullDoc]);

  const handleDownload = useCallback(async (id: string) => {
    if (previewDoc && previewDoc.id === id) {
      await generateSingleDocx(previewDoc);
      return;
    }
    const doc = await fetchFullDoc(id);
    if (doc) await generateSingleDocx(doc);
  }, [previewDoc, fetchFullDoc]);

  const closePreview = useCallback(() => setPreviewDoc(null), []);

  // renderContent replaced by DocumentContentRenderer component

  return (
    <div className="doc-lib-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="10,2 4,8 10,14" />
        </svg>
        Back to SIT-HR
      </Link>

      <Helmet>
        <title>HR Document Templates | SIT-HR Advisory</title>
        <meta name="description" content="Professional HR document templates for UK employers. Letters for absence, disciplinary, grievance, capability, and general workplace management." />
        <link rel="canonical" href="https://sithr.lwbc.ltd/documents" />
        <meta property="og:title" content="HR Document Templates" />
        <meta property="og:description" content="Professional HR document templates for UK employers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sithr.lwbc.ltd/documents" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="doc-lib__title">Document Library</h1>
        <p className="doc-lib__subtitle">HR document templates for workplace management</p>
        <div className="doc-lib__divider" />

        <div className="search-bar">
          <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14" y2="14" />
          </svg>
          <input
            className="search-bar__input"
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-bar__clear" onClick={() => setSearchQuery('')}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
              </svg>
            </button>
          )}
        </div>

        {!isSearching && (
          <div className="doc-lib__tabs">
            {availableCategories.map(cat => (
              <button
                key={cat}
                className={`doc-lib__tab ${activeCategory === cat ? 'doc-lib__tab--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        <div className="doc-lib__tier-pills">
          {TIER_OPTIONS.map(opt => (
            <button
              key={opt}
              className={`doc-lib__tier-pill ${activeTier === opt ? 'doc-lib__tier-pill--active' : ''}`}
              onClick={() => setActiveTier(opt)}
            >
              {TIER_LABELS[opt]}
            </button>
          ))}
        </div>

        {loading && <div className="doc-lib__loading">Loading documents...</div>}

        {!loading && filtered.length === 0 && (
          <p className="doc-lib__empty">
            {isSearching ? `No documents found for "${debouncedSearch}"` : 'No documents match the selected filters.'}
          </p>
        )}

        <div className="doc-lib__grid" key={`${activeCategory}-${activeTier}`}>
          {filtered.map((doc, i) => (
            <motion.div
              key={doc.id}
              className="doc-lib-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <div className="doc-lib-card__top">
                <span className={`doc-lib-badge ${CATEGORY_BADGE_CLASSES[doc.category] || ''}`}>
                  {doc.category}
                </span>
                <span className={`doc-lib-badge doc-lib-badge--tier-${doc.tier}`}>
                  Tier {doc.tier}
                </span>
              </div>
              <h3 className="doc-lib-card__title">{doc.title}</h3>
              <p className="doc-lib-card__desc">{doc.description}</p>
              <div className="doc-lib-card__actions">
                <button
                  className="doc-lib-card__preview-btn"
                  onClick={() => handlePreview(doc.id)}
                >
                  Preview
                </button>
                <button
                  className="doc-lib-card__download-btn"
                  onClick={() => handleDownload(doc.id)}
                >
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {previewDoc && (
          <motion.div
            className="doc-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePreview}
          >
            <motion.div
              className="doc-preview-modal"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{ maxHeight: '60vh' }}
            >
              <div className="doc-preview-header">
                <h3 className="doc-preview-title">{previewDoc.title}</h3>
                <button className="doc-preview-close" onClick={closePreview}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
                  </svg>
                </button>
              </div>
              <div className="doc-preview-body">
                {previewDoc.tier === 2 ? (
                  <div className="doc-preview-tier-notice doc-preview-tier-notice--formal">
                    {previewDoc.reviewNotice || 'This is a formal process document (Tier 2). It must be reviewed by a qualified HR professional or employment solicitor before use in any formal process.'}
                  </div>
                ) : (
                  <div className="doc-preview-tier-notice doc-preview-tier-notice--admin">
                    {previewDoc.reviewNotice || 'This document should be reviewed before use to ensure it reflects your organisation\'s specific policies and circumstances.'}
                  </div>
                )}
                <DocumentContentRenderer content={previewDoc.content} />
              </div>
              <div className="doc-preview-footer">
                <button
                  className="doc-lib-card__download-btn"
                  onClick={() => generateSingleDocx(previewDoc)}
                >
                  Download .docx
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageFooter />
    </div>
  );
}
