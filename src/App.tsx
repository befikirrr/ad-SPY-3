// src/App.tsx
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { TrendsPage } from './pages/TrendsPage';
import type { Session } from '@supabase/supabase-js';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// A simple layout component to share the header across pages
const AppLayout = ({ session }: { session: Session }) => {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }
    return (
        <div>
            <header className="w-full max-w-7xl mx-auto px-4 py-4 flex justify-between items-center border-b border-border mb-8">
                <Link to="/" className="text-xl font-bold">AdIntel</Link>
                <div className="flex items-center gap-6">
                    <nav className="flex gap-4 text-sm text-gray-400">
                        <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/collections" className="hover:text-white transition-colors">Collections</Link>
                        <Link to="/trends" className="hover:text-white transition-colors">Trends</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 hidden md:block">{session.user.email}</span>
                        <button 
                            onClick={handleSignOut}
                            className="bg-accent/10 text-accent text-sm font-bold py-2 px-4 rounded-md hover:bg-accent/20 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<DashboardPage session={session} />} />
                    <Route path="/collections" element={<CollectionsPage session={session} />} />
                    <Route path="/trends" element={<TrendsPage />} />
                </Routes>
            </main>
        </div>
    );
};


function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="bg-background min-h-screen"></div> // Blank screen while loading session
  }

  return (
    <BrowserRouter>
      {!session ? <AuthPage /> : <AppLayout session={session} />}
    </BrowserRouter>
  );
}

export default App;
