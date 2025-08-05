// src/components/AdGrid.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdCard, AdFromSupabase } from './AdCard';
import { AdDetailModal } from './AdDetailModal'; // Import the modal

type SortOption = 'created_at' | 'spend' | 'revenue';

export const AdGrid = ({ searchTerm }: { searchTerm: string }) => {
  const [ads, setAds] = useState<AdFromSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('created_at');
  
  // State for the modal
  const [selectedAd, setSelectedAd] = useState<AdFromSupabase | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);
      let query = supabase.from('ads').select('*');
      if (searchTerm) {
        query = query.or(`ad_copy.ilike.%${searchTerm}%,advertiser.ilike.%${searchTerm}%`);
      }
      query = query.order(sortOption, { ascending: false });
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching ads:', error);
        setError('Could not fetch ads. Please try again later.');
      } else {
        setAds(data as AdFromSupabase[]);
      }
      setLoading(false);
    };
    const timer = setTimeout(() => { fetchAds(); }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, sortOption]);

  const handleCardClick = (ad: AdFromSupabase) => {
    setSelectedAd(ad);
  };

  const handleCloseModal = () => {
    setSelectedAd(null);
  };

  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-2xl font-bold">
            {searchTerm ? `Results for "${searchTerm}"` : 'Top Performing Ads'}
            </h3>
            <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">{ads.length} ads found</p>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-card border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                    <option value="created_at">Sort by: Newest</option>
                    <option value="spend">Sort by: Spend</option>
                    <option value="revenue">Sort by: Revenue</option>
                </select>
            </div>
        </div>
        {loading ? (
          <div className="text-center py-16"><p className="text-xl font-bold">Loading Ads...</p></div>
        ) : error ? (
          <div className="text-center py-16 bg-red-900/20 border border-red-500/30 rounded-xl">
              <p className="text-xl font-bold mb-2 text-red-400">An Error Occurred</p>
              <p className="text-red-300">{error}</p>
          </div>
        ) : ads.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ads.map(ad => (
              <div key={ad.id} onClick={() => handleCardClick(ad)}>
                <AdCard ad={ad} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <p className="text-xl font-bold mb-2">No Ads Found</p>
            <p className="text-gray-400">Try adjusting your search term or check if data has been added.</p>
          </div>
        )}
      </section>

      {/* The Modal */}
      <AdDetailModal ad={selectedAd} onClose={handleCloseModal} />
    </>
  );
};
