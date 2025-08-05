// A simple card component for our dashboard
const Card = ({ title, description, icon }: { title: string, description: string, icon: string }) => (
  <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
    <div className="relative z-10">
      <div className="bg-accent/10 text-accent rounded-lg w-10 h-10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
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
      <section className="text-center mb-24">
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
          />
        </div>
      </section>

      {/* Features Grid */}
      <main className="grid md:grid-cols-3 gap-8">
        <Card 
          icon="🔍"
          title="Analyze"
          description="Deep-dive into competitor ad copy, creatives, and targeting to understand what resonates with your audience."
        />
        <Card 
          icon="🚀"
          title="Deploy"
          description="Identify top-performing trends and deploy campaigns with data-backed confidence, reducing wasted ad spend."
        />
        <Card 
          icon="📈"
          title="Optimize"
          description="Track ad performance over time, get actionable insights, and continuously refine your strategy for maximum ROI."
        />
      </main>
    </div>
  )
}

export default App
