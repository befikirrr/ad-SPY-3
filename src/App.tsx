function App() {
  return (
    <div className="bg-dark-purple min-h-screen text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Ad Spy Dashboard</h1>
      </header>
      <main className="p-4">
        {/* Search bar and filters will go here */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for ads..."
            className="bg-gray-800 border border-gray-600 rounded-md p-2 w-full max-w-md text-white"
          />
        </div>
        {/* Ad results will be displayed here */}
      </main>
    </div>
  )
}

export default App
