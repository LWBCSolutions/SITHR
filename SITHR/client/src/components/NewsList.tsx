import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageFooter from './PageFooter';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  pinned: boolean;
  important: boolean;
  created_at: string;
}

function readingTime(summary: string): string {
  const words = summary.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words * 4 / 200))} min read`;
}

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => setArticles(data.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isSearching = debouncedSearch.length > 0;
  const searchLower = debouncedSearch.toLowerCase();

  const filtered = articles.filter(a => {
    if (isSearching) {
      return a.title.toLowerCase().includes(searchLower) ||
             a.summary.toLowerCase().includes(searchLower) ||
             a.category.toLowerCase().includes(searchLower);
    }
    return activeCategory === 'all' || a.category === activeCategory;
  });

  // Only show categories that have articles
  const availableCategories = ['all', ...new Set(articles.map(a => a.category))];

  // Format date as "10 April 2026"
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="news-page">
      <Link to="/" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="10,2 4,8 10,14" />
        </svg>
        Back to SIT-HR
      </Link>

      <Helmet>
        <title>News and Updates | SIT-HR Advisory</title>
        <meta name="description" content="UK employment law changes, tribunal decisions, HR guidance, and compliance reminders for employers." />
        <link rel="canonical" href="https://sithr.lwbc.ltd/news" />
        <meta property="og:title" content="Employment Law News and Updates" />
        <meta property="og:description" content="UK employment law changes, tribunal decisions, HR guidance, and compliance reminders for employers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sithr.lwbc.ltd/news" />
      </Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="news-page__title">News & Updates</h1>
        <p className="news-page__subtitle">Employment law changes, reminders, and guidance updates</p>
        <div className="news-page__divider" />

        <div className="search-bar">
          <svg className="search-bar__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="7" cy="7" r="5" />
            <line x1="11" y1="11" x2="14" y2="14" />
          </svg>
          <input
            className="search-bar__input"
            type="text"
            placeholder="Search articles..."
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
          <div className="news-page__tabs">
            {availableCategories.map(cat => (
              <button key={cat} className={`news-page__tab ${activeCategory === cat ? 'news-page__tab--active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {{ all: 'All', legislation: 'Legislation', tribunal: 'Tribunal', policy: 'Policy', guidance: 'Guidance', reminder: 'Reminder', teamtalk: 'Team Talk' }[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="news-page__loading">Loading...</div>}

        {!loading && filtered.length === 0 && (
          <p className="news-page__empty">
            {isSearching ? `No articles found for "${debouncedSearch}"` : 'No articles published yet.'}
          </p>
        )}

        <div className="news-page__list">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Link to={`/news/${article.slug}`} className="news-card">
                <div className="news-card__top">
                  <span className={`news-card__badge news-card__badge--${article.category}`}>
                    {article.category}
                  </span>
                  {article.pinned && <span className="news-card__badge news-card__badge--pinned">Pinned</span>}
                  {article.important && <span className="news-card__badge news-card__badge--important">Important</span>}
                  <span className="news-card__date">{formatDate(article.created_at)}</span>
                </div>
                <h2 className="news-card__title">{article.title}</h2>
                <p className="news-card__summary">{article.summary}</p>
                <span className="news-card__reading-time">{readingTime(article.summary)}</span>
                <span className="news-card__link">Read more</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <PageFooter />
    </div>
  );
}
