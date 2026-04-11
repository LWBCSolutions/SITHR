import { useState, useEffect, type ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { lazy, Suspense } from 'react';
import LoginPage from './components/LoginPage';
import ChatLayout from './components/ChatLayout';
import DisclaimerModal from './components/DisclaimerModal';

const LegalPage = lazy(() => import('./components/LegalPage'));
const NewsList = lazy(() => import('./components/NewsList'));
const NewsArticle = lazy(() => import('./components/NewsArticle'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const DocumentLibrary = lazy(() => import('./components/DocumentLibrary'));
const ToolsPage = lazy(() => import('./components/ToolsPage'));
const CalendarPage = lazy(() => import('./components/CalendarPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
const PlanSelectionPage = lazy(() => import('./components/PlanSelectionPage'));

function PlanGate({ children }: { children: ReactNode }) {
  const { requiresPlanSelection, loading, refreshSubscription } = useSubscription();
  if (loading) {
    return <div className="loading-screen"><div className="loading-spinner" /></div>;
  }
  if (requiresPlanSelection) {
    return <PlanSelectionPage onActivated={refreshSubscription} />;
  }
  return <>{children}</>;
}

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
    <Suspense fallback={<div className="loading-screen"><div className="loading-spinner" /></div>}>
          <Routes>
      <Route path="/privacy" element={<LegalPage page="privacy" />} />
      <Route path="/terms" element={<LegalPage page="terms" />} />
      <Route path="/acceptable-use" element={<LegalPage page="acceptable-use" />} />
      <Route path="/news" element={<NewsList />} />
      <Route path="/news/:slug" element={<NewsArticle />} />
      <Route path="/documents" element={<DocumentLibrary />} />
      <Route path="/tools" element={<ToolsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/admin" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <PlanGate>
              <AdminPanel />
            </PlanGate>
          </SubscriptionProvider>
        )
      } />
      <Route path="/settings/*" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <PlanGate>
              <SettingsPage />
            </PlanGate>
          </SubscriptionProvider>
        )
      } />
      <Route path="*" element={
        !user ? <LoginPage /> : (
          <SubscriptionProvider>
            <PlanGate>
              <DisclaimerModal>
                <ChatLayout user={user} onSignOut={handleSignOut} />
              </DisclaimerModal>
            </PlanGate>
          </SubscriptionProvider>
        )
      } />
    </Routes>
          </Suspense>
  );
}
