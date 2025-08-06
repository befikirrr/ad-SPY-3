// src/components/AdGrid.tsx
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { AdCard, AdFromSupabase } from './AdCard';
import { AdDetailModal } from './AdDetailModal';
import { Session } from '@supabase/supabase-js';

type SortOption = 'created_at' | 'spend' | 'revenue' | 'roi';

export const AdGrid = ({ searchTerm, session }: { searchTerm: string, session: Session }) => {
  const [ads, setAds] = useState<AdFromSupabase[]>([]);
  const [savedAdIds, setSavedAdIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('created_at');
  const [selectedAd, setSelectedAd] = useState<AdFromSupabase | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      // Fetch ads
      const { data: adsData, error: adsError } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      if (adsError) {
        console.error('Error fetching ads:', adsError);
        setError('Could not fetch ads.');
        setLoading(false);
        return;
      }
      setAds(adsData as AdFromSupabase[]);

      // Fetch saved ads for the current user
      const { data: savedAdsData, error: savedAdsError } = await supabase.from('saved_ads').select('ad_id').eq('user_id', session.user.id);
      if (savedAdsError) {
        console.error('Error fetching saved ads:', savedAdsError);
        // Not a fatal error, so we don't set the main error state
      } else {
        setSavedAdIds(new Set(savedAdsData.map(r => r.ad_id)));
      }

      setLoading(false);
    };

    fetchInitialData();
  }, [session.user.id]);

  const handleSaveToggle = async (adId: number, isCurrentlySaved: boolean) => {
    if (isCurrentlySaved) {
      // Unsave the ad
      const { error } = await supabase.from('saved_ads').delete().match({ user_id: session.user.id, ad_id: adId });
      if (error) {
        console.error('Error unsaving ad:', error);
      } else {
        setSavedAdIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(adId);
          return newSet;
        });
      }
    } else {
      // Save the ad
      const { error } = await supabase.from('saved_ads').insert({ user_id: session.user.id, ad_id: adId });
      if (error) {
        console.error('Error saving ad:', error);
      } else {
        setSavedAdIds(prev => new Set(prev).add(adId));
      }
    }
  };
  
  const filteredAndSortedAds = useMemo(() => {
    let processedAds = [...ads];
    // Filtering
    if (searchTerm) {
        processedAds = processedAds.filter(ad => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            return (
              (ad.advertiser?.toLowerCase() ?? '').includes(lowerCaseSearchTerm) ||
              (ad.ad_copy?.toLowerCase() ?? '').includes(lowerCaseSearchTerm)
            );
        });
    }
    // Sorting
    if (sortOption === 'roi') {
      return processedAds.sort((a, b) => {
        const roiA = a.spend ? ((a.revenue ?? 0) - a.spend) / a.spend : 0;
        const roiB = b.spend ? ((b.revenue ?? 0) - b.spend) / b.spend : 0;
        return roiB - roiA;
      });
    } else if (sortOption === 'spend' || sortOption === 'revenue') {
        return processedAds.sort((a, b) => (b[sortOption] ?? 0) - (a[sortOption] ?? 0));
    }
    return processedAds; // Default is 'created_at' which is pre-sorted
  }, [ads, searchTerm, sortOption]);

  return (
    <>
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold">Top Performing Ads</h3>
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm">{filteredAndSortedAds.length} ads found</p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-card border border-border rounded-md py-2 px-3 text-white"
            >
              <option value="created_at">Sort by: Newest</option>
              <option value="spend">Sort by: Spend</option>
              <option value="revenue">Sort by: Revenue</option>
              <option value="roi">Sort by: ROI</option>
            </select>
          </div>
        </div>
        {loading ? (
            <div className="text-center py-16"><p>Loading...</p></div>
        ) : error ? (
            <div className="text-center py-16"><p>{error}</p></div>
        ) : filteredAndSortedAds.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedAds.map(ad => (
              <AdCard 
                key={ad.id} 
                ad={ad}
                isSaved={savedAdIds.has(ad.id)}
                onSaveToggle={handleSaveToggle}
                onCardClick={setSelectedAd}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl"><p>No ads found.</p></div>
        )}
      </section>
      <AdDetailModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
    </>
  );
};
