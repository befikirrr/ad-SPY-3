// src/components/AdGrid.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdCard, AdFromSupabase } from './AdCard';

export const AdGrid = ({ searchTerm }: { searchTerm: string }) => {
  const [ads, setAds] = useState<AdFromSupabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError(null);

      // Construct the query
      let query = supabase.from('ads').select('*');

      // Add search filter if a search term exists
      if (searchTerm) {
        query = query.or(`ad_copy.ilike.%${searchTerm}%,advertiser.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching ads:', error);
        setError('Could not fetch ads. Please try again later.');
      } else {
        setAds(data as AdFromSupabase[]);
      }
      setLoading(false);
    };

    // Use a timeout to debounce the search, reducing API calls while typing
    const timer = setTimeout(() => {
        fetchAds();
    }, 300); // 300ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount or re-render
  }, [searchTerm]);

  if (loading) {
    return (
        <div className="text-center py-16">
            <p className="text-xl font-bold">Loading Ads...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="text-center py-16 bg-red-900/20 border border-red-500/30 rounded-xl">
            <p className="text-xl font-bold mb-2 text-red-400">An Error Occurred</p>
            <p className="text-red-300">{error}</p>
        </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {searchTerm ? `Results for "${searchTerm}"` : 'Top Performing Ads'}
        </h3>
        <p className="text-gray-400 text-sm">{ads.length} ads found</p>
      </div>
      {ads.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ads.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold mb-2">No Ads Found</p>
          <p className="text-gray-400">Try adjusting your search term or check if data has been added.</p>
        </div>
      )}
    </section>
  );
};
