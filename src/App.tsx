import { useState } from 'react';
import { AdGrid } from './components/AdGrid';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-16">
        <h1 className="text-xl font-bold">AdIntel</h1>
        <nav className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="hover:text-white transition-colors">Trends</a>
          <a href="#" className="hover:text-white transition-colors">Settings</a>
        </nav>
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
        <AdGrid searchTerm={searchTerm} />
      </main>
    </div>
  )
}

export default App
