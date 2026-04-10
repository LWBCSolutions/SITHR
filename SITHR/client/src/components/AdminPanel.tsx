import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAuthHeaders } from '../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageFooter from './PageFooter';

interface ArticleDraft {
  id: string;
  feed_item_id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  status: 'draft' | 'approved' | 'rejected' | 'published';
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  active: boolean;
  last_fetched: string | null;
  last_error: string | null;
  created_at: string;
}

type Tab = 'drafts' | 'sources' | 'actions';
type DraftFilter = 'draft' | 'published' | 'rejected';

const TAB_LABELS: Record<Tab, string> = {
  drafts: 'Drafts',
  sources: 'Sources',
  actions: 'Actions',
};

const CATEGORY_OPTIONS = ['legislation', 'guidance', 'tribunal'] as const;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('drafts');

  // Drafts state
  const [drafts, setDrafts] = useState<ArticleDraft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);
  const [draftsError, setDraftsError] = useState('');
  const [draftFilter, setDraftFilter] = useState<DraftFilter>('draft');
  const [expandedDraftId, setExpandedDraftId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Sources state
  const [sources, setSources] = useState<RssSource[]>([]);
  const [sourcesLoading, setSourcesLoading] = useState(false);
  const [sourcesError, setSourcesError] = useState('');

  // New source form
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [addingSource, setAddingSource] = useState(false);
  const [addSourceMsg, setAddSourceMsg] = useState('');

  // Actions state
  const [ingestionRunning, setIngestionRunning] = useState(false);
  const [ingestionMsg, setIngestionMsg] = useState('');

  // Fetch drafts
  const fetchDrafts = async () => {
    setDraftsLoading(true);
    setDraftsError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/drafts', { headers });
      if (!res.ok) throw new Error(`Failed to load drafts (${res.status})`);
      const data = await res.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      setDraftsError(err instanceof Error ? err.message : 'Failed to load drafts.');
    } finally {
      setDraftsLoading(false);
    }
  };

  // Fetch sources
  const fetchSources = async () => {
    setSourcesLoading(true);
    setSourcesError('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/rss/sources', { headers });
      if (!res.ok) throw new Error(`Failed to load sources (${res.status})`);
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      setSourcesError(err instanceof Error ? err.message : 'Failed to load sources.');
    } finally {
      setSourcesLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  useEffect(() => {
    if (activeTab === 'sources' && sources.length === 0 && !sourcesLoading) {
      fetchSources();
    }
  }, [activeTab]);

  // Draft actions
  const handlePublish = async (id: string) => {
    setActionLoading(id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/drafts/${id}/publish`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Publish failed');
      await fetchDrafts();
    } catch {
      setDraftsError('Failed to publish draft. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/drafts/${id}/reject`, {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Reject failed');
      await fetchDrafts();
    } catch {
      setDraftsError('Failed to reject draft. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Add source
  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      setAddSourceMsg('Name and URL are required.');
      return;
    }
    setAddingSource(true);
    setAddSourceMsg('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/rss/sources', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newSourceName.trim(),
          url: newSourceUrl.trim(),
          category: newSourceCategory,
        }),
      });
      if (!res.ok) throw new Error('Failed to add source');
      setNewSourceName('');
      setNewSourceUrl('');
      setNewSourceCategory(CATEGORY_OPTIONS[0]);
      setAddSourceMsg('Source added successfully.');
      await fetchSources();
    } catch {
      setAddSourceMsg('Failed to add source. Please try again.');
    } finally {
      setAddingSource(false);
    }
  };

  // Run ingestion
  const handleRunIngestion = async () => {
    setIngestionRunning(true);
    setIngestionMsg('');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/rss/run', {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Ingestion run failed');
      const data = await res.json();
      setIngestionMsg(data.message || 'RSS ingestion completed successfully.');
      await fetchDrafts();
    } catch {
      setIngestionMsg('Ingestion failed. Please check the server logs.');
    } finally {
      setIngestionRunning(false);
    }
  };

  // Filtered drafts and counts
  const filteredDrafts = drafts.filter(d => d.status === draftFilter);
  const draftCount = drafts.filter(d => d.status === 'draft').length;
  const publishedCount = drafts.filter(d => d.status === 'published').length;
  const rejectedCount = drafts.filter(d => d.status === 'rejected').length;

  const filterButtons: { key: DraftFilter; label: string; count: number }[] = [
    { key: 'draft', label: 'Draft', count: draftCount },
    { key: 'published', label: 'Published', count: publishedCount },
    { key: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  return (
    <div className="news-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="10,2 4,8 10,14" />
        </svg>
        Back to SIT-HR
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="news-page__title">Admin Panel</h1>
        <p className="news-page__subtitle">Manage RSS article drafts, sources, and ingestion</p>
        <div className="news-page__divider" />

        {/* Tabs */}
        <div className="settings-tabs">
          {(Object.keys(TAB_LABELS) as Tab[]).map(tab => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Drafts Tab */}
          {activeTab === 'drafts' && (
            <div className="admin-drafts">
              {/* Status filter buttons */}
              <div className="news-page__tabs">
                {filterButtons.map(fb => (
                  <button
                    key={fb.key}
                    className={`news-page__tab ${draftFilter === fb.key ? 'news-page__tab--active' : ''}`}
                    onClick={() => {
                      setDraftFilter(fb.key);
                      setExpandedDraftId(null);
                    }}
                  >
                    {fb.label} ({fb.count})
                  </button>
                ))}
              </div>

              {draftsLoading && <div className="news-page__loading">Loading drafts...</div>}

              {draftsError && (
                <div className="admin-error">{draftsError}</div>
              )}

              {!draftsLoading && !draftsError && filteredDrafts.length === 0 && (
                <p className="news-page__empty">No {draftFilter} articles found.</p>
              )}

              <div className="news-page__list">
                {filteredDrafts.map((draft, i) => (
                  <motion.div
                    key={draft.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <div
                      className={`news-card admin-draft-card ${expandedDraftId === draft.id ? 'admin-draft-card--expanded' : ''}`}
                      onClick={() =>
                        setExpandedDraftId(expandedDraftId === draft.id ? null : draft.id)
                      }
                    >
                      <div className="news-card__top">
                        <span className={`news-card__badge news-card__badge--${draft.category}`}>
                          {draft.category}
                        </span>
                        <span className={`news-card__badge admin-status-badge admin-status-badge--${draft.status}`}>
                          {draft.status}
                        </span>
                        <span className="news-card__date">{formatDate(draft.created_at)}</span>
                      </div>
                      <h2 className="news-card__title">{draft.title}</h2>
                      <p className="news-card__summary">{draft.summary}</p>

                      {expandedDraftId === draft.id && (
                        <div
                          className="admin-draft-content"
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="admin-draft-content__body news-article__body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.content}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {draft.status === 'draft' && (
                        <div
                          className="admin-draft-actions"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className="settings-btn admin-btn--publish"
                            disabled={actionLoading === draft.id}
                            onClick={() => handlePublish(draft.id)}
                          >
                            {actionLoading === draft.id ? 'Publishing...' : 'Publish'}
                          </button>
                          <button
                            className="settings-btn admin-btn--reject"
                            disabled={actionLoading === draft.id}
                            onClick={() => handleReject(draft.id)}
                          >
                            {actionLoading === draft.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      )}

                      {draft.reviewed_at && (
                        <span className="news-card__date" style={{ marginTop: 8, display: 'block' }}>
                          Reviewed: {formatDate(draft.reviewed_at)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Sources Tab */}
          {activeTab === 'sources' && (
            <div className="admin-sources">
              {sourcesLoading && <div className="news-page__loading">Loading sources...</div>}

              {sourcesError && (
                <div className="admin-error">{sourcesError}</div>
              )}

              {!sourcesLoading && !sourcesError && sources.length === 0 && (
                <p className="news-page__empty">No RSS sources configured yet.</p>
              )}

              <div className="news-page__list">
                {sources.map((source, i) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                  >
                    <div className="news-card admin-source-card">
                      <div className="news-card__top">
                        <span className={`news-card__badge news-card__badge--${source.category}`}>
                          {source.category}
                        </span>
                        <span className={`news-card__badge ${source.active ? 'admin-status-badge--active' : 'admin-status-badge--inactive'}`}>
                          {source.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <h2 className="news-card__title">{source.name}</h2>
                      <p className="news-card__summary admin-source-url">{source.url}</p>
                      {source.last_fetched && (
                        <span className="news-card__date">
                          Last fetched: {formatDate(source.last_fetched)}
                        </span>
                      )}
                      {source.last_error && (
                        <div className="admin-error" style={{ marginTop: 8 }}>
                          Last error: {source.last_error}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add source form */}
              <div className="admin-add-source">
                <h3 className="settings-section__title">Add New Source</h3>
                <form onSubmit={handleAddSource} className="admin-add-source__form">
                  <label className="settings-label">
                    Name
                    <input
                      className="settings-input"
                      type="text"
                      placeholder="e.g. GOV.UK Employment Law"
                      value={newSourceName}
                      onChange={e => setNewSourceName(e.target.value)}
                    />
                  </label>
                  <label className="settings-label">
                    Feed URL
                    <input
                      className="settings-input"
                      type="url"
                      placeholder="https://example.com/rss/feed.xml"
                      value={newSourceUrl}
                      onChange={e => setNewSourceUrl(e.target.value)}
                    />
                  </label>
                  <label className="settings-label">
                    Category
                    <select
                      className="settings-input"
                      value={newSourceCategory}
                      onChange={e => setNewSourceCategory(e.target.value)}
                    >
                      {CATEGORY_OPTIONS.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="settings-btn"
                    type="submit"
                    disabled={addingSource}
                  >
                    {addingSource ? 'Adding...' : 'Add Source'}
                  </button>
                  {addSourceMsg && (
                    <p className="settings-msg">{addSourceMsg}</p>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="admin-actions">
              <div className="settings-section">
                <h2 className="settings-section__title">RSS Ingestion</h2>
                <p className="settings-section__desc">
                  Manually trigger an RSS ingestion run. This will fetch all active sources,
                  process new feed items, and create article drafts for review.
                </p>

                <button
                  className="settings-btn admin-btn--run"
                  onClick={handleRunIngestion}
                  disabled={ingestionRunning}
                >
                  {ingestionRunning ? (
                    <>
                      <span className="admin-spinner" />
                      Running Ingestion...
                    </>
                  ) : (
                    'Run RSS Ingestion Now'
                  )}
                </button>

                {ingestionMsg && (
                  <p className="settings-msg" style={{ marginTop: 12 }}>{ingestionMsg}</p>
                )}

                <div className="admin-schedule-note">
                  <strong>Automatic schedule:</strong> RSS ingestion runs automatically at
                  06:00 and 14:00 UK time daily. Use the button above only if you need to
                  trigger an immediate run outside the scheduled times.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <PageFooter />
    </div>
  );
}
