import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import ChatLayout from './components/ChatLayout';
import DisclaimerModal from './components/DisclaimerModal';
import LegalPage from './components/LegalPage';
import NewsList from './components/NewsList';
import NewsArticle from './components/NewsArticle';
import SettingsPage from './components/SettingsPage';
import DocumentLibrary from './components/DocumentLibrary';
import ToolsPage from './components/ToolsPage';
import AdminPanel from './components/AdminPanel';
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>;
  }

  return (
    <Routes>
      <Route path="/privacy" element={<LegalPage page="privacy" />} />
      <Route path="/terms" element={<LegalPage page="terms" />} />
      <Route path="/acceptable-use" element={<LegalPage page="acceptable-use" />} />
      <Route path="/news" element={<NewsList />} />
      <Route path="/news/:slug" element={<NewsArticle />} />
      <Route path="/documents" element={<DocumentLibrary />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/admin" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <AdminPanel />
          </SubscriptionProvider>
        )
      } />
      <Route path="/settings/*" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <SettingsPage />
          </SubscriptionProvider>
        )
      } />
      <Route path="*" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <DisclaimerModal>
              <ChatLayout user={user} onSignOut={handleSignOut} />
            </DisclaimerModal>
          </SubscriptionProvider>
        )
      } />
    </Routes>
  );
}
