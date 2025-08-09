// src/pages/CollectionsPage.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdCard, AdFromSupabase } from '../components/AdCard';
import { Session } from '@supabase/supabase-js';

export const CollectionsPage = ({ session }: { session: Session }) => {
    const [savedAds, setSavedAds] = useState<AdFromSupabase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSavedAds = async () => {
            setLoading(true);
            setError(null);
            
            // This query now joins the 'ads' table with 'saved_ads'
            const { data, error } = await supabase
                .from('saved_ads')
                .select('ads(*)') // Select all columns from the related 'ads' table
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error fetching saved ads:', error);
                setError('Could not fetch your saved ads.');
            } else {
                // The data is nested, so we extract it.
                const ads = data.map(item => item.ads).filter(Boolean) as AdFromSupabase[];
                setSavedAds(ads);
            }
            setLoading(false);
        };

        fetchSavedAds();
    }, [session.user.id]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">My Saved Ads</h1>
            {loading ? (
                <p>Loading your collections...</p>
            ) : error ? (
                <p className="text-red-400">{error}</p>
            ) : savedAds.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedAds.map(ad => (
                        <AdCard key={ad.id} ad={ad} isSaved={true} /> // No need for handlers here
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-xl">
                    <p className="text-xl font-bold mb-2">No Ads Saved Yet</p>
                    <p className="text-gray-400">Go back to the dashboard and click the 'Save' button on any ad.</p>
                </div>
            )}
        </div>
    );
};
