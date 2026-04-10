import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import {
  fetchConversations,
  fetchMessages,
  createConversation,
  deleteConversation,
  type Conversation,
  type Message,
} from '../lib/api';
import ChatView from './ChatView';
import ExportPack from './ExportPack';
import type { IntakeData } from './IntakeForm';
import AppNotifications, { BannerNotification, useActiveNotifications } from './AppNotifications';

interface ChatLayoutProps {
  user: User;
  onSignOut: () => void;
}

export default function ChatLayout({ user, onSignOut }: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [caseRef, setCaseRef] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedDocsCount, setSelectedDocsCount] = useState(0);
  const [intakeCompleted, setIntakeCompleted] = useState(false);
  const { banners, dismiss: dismissBanner, hasUnread: hasUnreadNotifications } = useActiveNotifications();
  const [sessionPolicies, setSessionPolicies] = useState<Array<{ filename: string; content: string }>>([]);
  const [sessionAttachments, setSessionAttachments] = useState<Array<{ filename: string; content: string; mimetype: string }>>([]);
  const [intakeSituationType, setIntakeSituationType] = useState('');
  const [intakeServiceLength, setIntakeServiceLength] = useState('');
  const [intakePreviousAction, setIntakePreviousAction] = useState('');

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, [user.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = async (conversationId: string) => {
    if (conversationId === activeConversationId) {
      setSidebarOpen(false);
      return;
    }

    setActiveConversationId(conversationId);
    setLoadingMessages(true);
    setSidebarOpen(false);

    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }

    // Extract case ref from conversation title if present
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      const match = conv.title.match(/^\[([^\]]+)\]/);
      setCaseRef(match ? match[1] : '');
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setCaseRef('');
    setSidebarOpen(false);
    setIntakeCompleted(false);
    setSessionPolicies([]);
    setSessionAttachments([]);
    setIntakeSituationType('');
    setIntakeServiceLength('');
    setIntakePreviousAction('');
  };

  const handleIntakeSubmit = (data: IntakeData) => {
    setCaseRef(data.caseRef);
    setIntakeSituationType(data.situationType);
    setIntakeServiceLength(data.serviceLength);
    setIntakePreviousAction(data.previousAction);
    setSessionPolicies(data.policies);
    setSessionAttachments(data.attachments.map(a => ({
      filename: a.filename,
      content: a.content,
      mimetype: a.mimetype,
    })));
    setIntakeCompleted(true);
  };

  const handleEditIntake = () => {
    setIntakeCompleted(false);
  };

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await deleteConversation(conversationId);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
        setCaseRef('');
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleConversationCreated = (conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev]);
    setActiveConversationId(conversation.id);
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="chat-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="120" height="36" viewBox="0 0 120 36" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="8" width="14" height="4" rx="1.5" fill="#2D7DD2"/>
              <rect x="0" y="16" width="10" height="4" rx="1.5" fill="#2D7DD2" opacity="0.6"/>
              <rect x="0" y="24" width="12" height="4" rx="1.5" fill="#2D7DD2" opacity="0.35"/>
              <text x="22" y="26" fontFamily="Georgia, serif" fontSize="20" fontWeight="700" fill="#FFFFFF" letterSpacing="-0.3">SIT<tspan fill="#2D7DD2">-HR</tspan></text>
            </svg>
          </div>
        </div>

        <button className="new-conversation-btn" onClick={handleNewConversation}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          New Conversation
        </button>

        <div className="conversation-list">
          <AnimatePresence>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`conversation-item ${
                  conv.id === activeConversationId ? 'conversation-item--active' : ''
                }`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                {(() => {
                  const match = conv.title.match(/^\[([^\]]+)\]\s*/);
                  const ref = match ? match[1] : null;
                  const displayTitle = match ? conv.title.slice(match[0].length) : conv.title;
                  return (
                    <>
                      {ref && <span className="case-ref-badge">{ref}</span>}
                      <span className="conversation-title">{displayTitle}</span>
                    </>
                  );
                })()}
                <button
                  className="conversation-delete"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  title="Delete conversation"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <line x1="3" y1="3" x2="11" y2="11" />
                    <line x1="11" y1="3" x2="3" y2="11" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {conversations.length === 0 && (
            <div className="conversation-empty">No conversations yet</div>
          )}
        </div>

        <div className="sidebar-nav-links">
          <a href="/news" className="sidebar-nav-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/news'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="2" width="14" height="12" rx="2" />
              <line x1="4" y1="6" x2="12" y2="6" />
              <line x1="4" y1="9" x2="10" y2="9" />
              <line x1="4" y1="12" x2="8" y2="12" />
            </svg>
            <span>News & Updates</span>
            {hasUnreadNotifications && <span className="sidebar-news-badge" />}
          </a>
          <a href="/documents" className="sidebar-nav-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/documents'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 14H3a1 1 0 01-1-1V3a1 1 0 011-1h7l4 4v8a1 1 0 01-1 1z" />
              <path d="M10 2v4h4" />
              <line x1="5" y1="9" x2="11" y2="9" />
              <line x1="5" y1="11.5" x2="9" y2="11.5" />
            </svg>
            <span>Document Library</span>
          </a>
          <a href="/tools" className="sidebar-nav-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/tools'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
            <span>HR Tools</span>
          </a>
          <a href="/settings" className="sidebar-nav-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/settings'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="3" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4" />
            </svg>
            <span>Settings</span>
          </a>
          <a href="/admin" className="sidebar-nav-btn" onClick={(e) => { e.preventDefault(); window.location.href = '/admin'; }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#2D7DD2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <line x1="2" y1="6" x2="14" y2="6" />
              <line x1="6" y1="6" x2="6" y2="14" />
            </svg>
            <span>Admin</span>
          </a>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-legal-links">
            <a href="/privacy" target="_blank" rel="noopener">Privacy</a>
            <a href="/terms" target="_blank" rel="noopener">Terms</a>
          </div>
          <div className="sidebar-user-email" title={user.email}>
            {user.email}
          </div>
          <button className="sign-out-btn" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </motion.aside>

      <motion.main
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
        className="chat-main"
      >
        <div className="chat-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="chat-topbar-title">
            {activeConversation?.title || 'New Conversation'}
          </span>
          {activeConversationId && messages.length > 0 && (
            <ExportPack
              messages={messages}
              conversationTitle={activeConversation?.title || 'Conversation'}
              caseRef={caseRef}
              disabled={isStreaming}
              packCount={selectedDocsCount}
            />
          )}
        </div>

        {/* Desktop header bar */}
        <div className="chat-header-bar">
          {caseRef && <span className="case-ref-badge">{caseRef}</span>}
          <span className="chat-header-title">
            {activeConversation?.title || 'New Conversation'}
          </span>
          {activeConversationId && messages.length > 0 && (
            <ExportPack
              messages={messages}
              conversationTitle={activeConversation?.title || 'Conversation'}
              caseRef={caseRef}
              disabled={isStreaming}
              packCount={selectedDocsCount}
            />
          )}
        </div>

        {/* Banner notifications - above chat, below header */}
        <AnimatePresence>
          {banners.map(b => (
            <BannerNotification key={b.id} notification={b} onDismiss={() => dismissBanner(b.id)} />
          ))}
        </AnimatePresence>

        <ChatView
          userId={user.id}
          conversationId={activeConversationId}
          messages={messages}
          setMessages={setMessages}
          loadingMessages={loadingMessages}
          onConversationCreated={handleConversationCreated}
          caseRef={caseRef}
          setCaseRef={setCaseRef}
          onStreamingChange={setIsStreaming}
          onSelectedDocsChange={setSelectedDocsCount}
          sessionPolicies={sessionPolicies}
          sessionAttachments={sessionAttachments}
          intakeSituationType={intakeSituationType}
          intakeServiceLength={intakeServiceLength}
          intakePreviousAction={intakePreviousAction}
          intakeCompleted={intakeCompleted}
          onIntakeSubmit={handleIntakeSubmit}
          onEditIntake={handleEditIntake}
        />

      </motion.main>

      {/* Modal notifications */}
      <AppNotifications />
    </div>
  );
}
