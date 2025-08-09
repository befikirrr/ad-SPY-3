// src/pages/DashboardPage.tsx
import { useState } from 'react';
import { AdGrid } from '../components/AdGrid';
import type { Session } from '@supabase/supabase-js';

export const DashboardPage = ({ session }: { session: Session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roiMin, setRoiMin] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Uncover Winning Ads, Instantly.</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">Our AI-powered spy tool gives you an inside look at the ad strategies that actually work. Stop guessing, start scaling.</p>
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

      {/* Advanced Filters */}
      <section className="bg-card border border-border rounded-xl p-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date From</label>
            <input type="date" className="bg-black/30 border border-border rounded-md px-3 py-2 w-full text-white" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Date To</label>
            <input type="date" className="bg-black/30 border border-border rounded-md px-3 py-2 w-full text-white" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Minimum ROI (%)</label>
            <input type="number" min={0} step={1} className="bg-black/30 border border-border rounded-md px-3 py-2 w-full text-white" value={roiMin} onChange={(e)=>setRoiMin(Number(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Note: Date range will filter once metrics are available. ROI filter applies immediately.</p>
      </section>

      {/* Ad Grid */}
      <AdGrid searchTerm={searchTerm} session={session} roiMin={roiMin} dateFrom={dateFrom} dateTo={dateTo} />
    </div>
  )
}
