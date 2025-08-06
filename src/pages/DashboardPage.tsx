// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { AdGrid } from '../components/AdGrid';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export const DashboardPage = ({ session }: { session: Session }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-xl font-bold">AdIntel</h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, {session.user.email}</span>
            <button 
                onClick={handleSignOut}
                className="bg-accent/10 text-accent text-sm font-bold py-2 px-4 rounded-md hover:bg-accent/20 transition-colors"
            >
                Sign Out
            </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Uncover Winning Ads, Instantly.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Our AI-powered spy tool gives you an inside look at the ad strategies
          that actually work. Stop guessing, start scaling.
        </p>
        <div className="relative w-full max-w-xl mx-auto">
           <input
            type="text"
            placeholder="Search by keyword, brand, or domain..."
            className="bg-card border border-border rounded-full py-3 px-6 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Ad Grid */}
      <main>
        <AdGrid searchTerm={searchTerm} session={session} />
      </main>
    </div>
  )
}
