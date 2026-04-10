import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthHeaders } from '../lib/api';

interface AppNotification {
  id: string;
  type: 'info' | 'alert' | 'urgent' | 'reminder' | 'banner';
  title: string;
  message: string;
  cta_text: string | null;
  cta_link: string | null;
  dismissible: boolean;
}

const STORAGE_KEY = 'sithr_dismissed_notifications';

function getDismissed(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function addDismissed(id: string) {
  const current = getDismissed();
  if (!current.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  }
}

// Type icons as SVG
function TypeIcon({ type }: { type: string }) {
  if (type === 'info') return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#2D7DD2" strokeWidth="1.5"/><text x="9" y="13" textAnchor="middle" fill="#2D7DD2" fontSize="12" fontWeight="700" fontFamily="Georgia,serif" fontStyle="italic">i</text></svg>
  );
  if (type === 'alert') return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L17 16H1L9 1Z" stroke="#854F0B" strokeWidth="1.5" fill="none"/><line x1="9" y1="7" x2="9" y2="11" stroke="#854F0B" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="13.5" r="0.75" fill="#854F0B"/></svg>
  );
  if (type === 'urgent') return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#A32D2D" strokeWidth="1.5"/><line x1="9" y1="5" x2="9" y2="10" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="13" r="1" fill="#A32D2D"/></svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 14 6 14 10C14 14 9 16 9 16C9 16 4 14 4 10C4 6 9 2 9 2Z" stroke="#666" strokeWidth="1.5" fill="none"/></svg>
  );
}

// Border color by type
function borderColor(type: string): string {
  switch (type) {
    case 'info': return '#2D7DD2';
    case 'alert': return '#854F0B';
    case 'urgent': return '#A32D2D';
    default: return '#666';
  }
}

// --- Banner component for type='banner' ---
export function BannerNotification({ notification, onDismiss }: { notification: AppNotification; onDismiss: () => void }) {
  return (
    <motion.div
      className="banner-notification"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="banner-notification__inner">
        <TypeIcon type="info" />
        <span className="banner-notification__text">{notification.message}</span>
        {notification.cta_text && notification.cta_link && (
          <a href={notification.cta_link} className="banner-notification__cta">{notification.cta_text}</a>
        )}
        {notification.dismissible && (
          <button className="banner-notification__dismiss" onClick={onDismiss} aria-label="Dismiss">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>
          </button>
        )}
      </div>
    </motion.div>
  );
}

// --- Modal notification component ---
function ModalNotification({ notification, onDismiss }: { notification: AppNotification; onDismiss: () => void }) {
  return (
    <motion.div
      className="modal-notification"
      initial={{ x: 20, y: 20, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: 20, y: 20, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ borderLeftColor: borderColor(notification.type) }}
    >
      <div className="modal-notification__header">
        <TypeIcon type={notification.type} />
        <span className="modal-notification__title">{notification.title}</span>
        {notification.dismissible && (
          <button className="modal-notification__close" onClick={onDismiss}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="3" x2="11" y2="11"/><line x1="11" y1="3" x2="3" y2="11"/></svg>
          </button>
        )}
      </div>
      <p className="modal-notification__message">{notification.message}</p>
      {notification.cta_text && notification.cta_link && (
        <a href={notification.cta_link} className="modal-notification__cta">{notification.cta_text}</a>
      )}
    </motion.div>
  );
}

// --- Main hook + container ---
export default function AppNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>(getDismissed());

  useEffect(() => {
    getAuthHeaders().then(headers => {
      fetch('/api/notifications', { headers })
        .then(r => r.json())
        .then(data => setNotifications(data.notifications || []))
        .catch(() => {});
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    addDismissed(id);
    setDismissed(prev => [...prev, id]);
  }, []);

  // Filter out dismissed and separate by type
  const active = notifications.filter(n => !dismissed.includes(n.id));
  const modals = active.filter(n => n.type !== 'banner');
  const currentModal = modals[0] || null;

  return (
    <AnimatePresence>
      {currentModal && (
        <ModalNotification
          key={currentModal.id}
          notification={currentModal}
          onDismiss={() => dismiss(currentModal.id)}
        />
      )}
    </AnimatePresence>
  );
}

// Export a hook for banners (used in ChatLayout)
export function useActiveNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>(getDismissed());

  useEffect(() => {
    getAuthHeaders().then(headers => {
      fetch('/api/notifications', { headers })
        .then(r => r.json())
        .then(data => setNotifications(data.notifications || []))
        .catch(() => {});
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    addDismissed(id);
    setDismissed(prev => [...prev, id]);
  }, []);

  const banners = notifications.filter(n => n.type === 'banner' && !dismissed.includes(n.id));
  const hasUnread = notifications.filter(n => !dismissed.includes(n.id)).length > 0;

  return { banners, dismiss, hasUnread };
}
