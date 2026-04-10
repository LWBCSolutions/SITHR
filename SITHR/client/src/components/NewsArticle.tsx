import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PageFooter from './PageFooter';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  pinned: boolean;
  important: boolean;
  created_at: string;
}

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/news/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setArticle(data.article))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) return <div className="news-article-page"><p>Loading...</p></div>;
  if (error || !article) return (
    <div className="news-article-page">
      <Link to="/news" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="10,2 4,8 10,14" /></svg>
        News & Updates
      </Link>
      <p>Article not found.</p>
    </div>
  );

  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Strip trailing disclaimer paragraphs from content
  let cleanContent = article.content;
  cleanContent = cleanContent.replace(/\n---\n\nThis (article|guidance) provides general guidance[^\n]*/g, '');
  cleanContent = cleanContent.replace(/This (article|guidance) provides general guidance[^\n]*$/g, '');

  return (
    <motion.div className="news-article-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {article && (
        <Helmet>
          <title>{article.title} | SIT-HR Advisory</title>
          <meta name="description" content={article.summary?.substring(0, 160) || `${article.title} - UK employment law guidance.`} />
          <link rel="canonical" href={`https://sithr.lwbc.ltd/news/${article.slug}`} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.summary || article.title} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://sithr.lwbc.ltd/news/${article.slug}`} />
          <meta property="og:image" content="https://sithr.lwbc.ltd/og-default.svg" />
          <meta property="og:site_name" content="SIT-HR Advisory" />
          <meta property="og:locale" content="en_GB" />
          <meta property="article:published_time" content={article.created_at} />
          <meta property="article:section" content={article.category || 'Employment Law'} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={article.title} />
          <meta name="twitter:description" content={article.summary?.substring(0, 160) || article.title} />
          <meta name="twitter:image" content="https://sithr.lwbc.ltd/og-default.svg" />
        </Helmet>
      )}

      <Link to="/news" className="legal-back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="10,2 4,8 10,14" /></svg>
        News & Updates
      </Link>

      <div className="news-article">
        <div className="news-article__meta">
          <span className={`news-card__badge news-card__badge--${article.category}`}>{article.category}</span>
          <span className="news-card__date">{formatDate(article.created_at)}</span>
          <span className="news-article__read-time">{readTime} min read</span>
        </div>
        {article.important && (
          <div className="news-article__important-banner">Important Update</div>
        )}
        <h1 className="news-article__title">{article.title}</h1>
        {article.category === 'teamtalk' && (
          <button
            className="team-talk-print-btn"
            onClick={() => window.print()}
            aria-label="Print this briefing"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="8" height="4" />
              <path d="M4 10V2h8v8" />
              <rect x="2" y="6" width="12" height="6" rx="1" />
            </svg>
            Print for team meeting
          </button>
        )}
        <div className="news-article__divider" />
        <div className="news-article__body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
        </div>
        <div className="news-article__disclaimer">
          This article provides general guidance based on the law as at the date
          of publication. Employment law changes frequently. Verify current
          requirements and seek qualified legal advice for your specific
          circumstances.
        </div>
      </div>

      <PageFooter />
    </motion.div>
  );
}
