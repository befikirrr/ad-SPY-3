// src/components/AdGrid.tsx
import { AdCard, AdCardData } from './AdCard';

// Realistic mock data to simulate what we'll get from the API
const mockAds: AdCardData[] = [
  {
    id: 1,
    advertiser: 'GrowthBoost AI',
    advertiserAvatar: 'https://i.pravatar.cc/40?u=growthboost',
    adCreativeUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    adCopy: "Tired of marketing that doesn't deliver? Our new AI platform triples your lead quality in 30 days. Get early access.",
    spend: 15000,
    revenue: 45000,
    impressions: 500000,
  },
  {
    id: 2,
    advertiser: 'SaaSify Pro',
    advertiserAvatar: 'https://i.pravatar.cc/40?u=saasify',
    adCreativeUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1000&auto=format&fit=crop',
    adCopy: "The all-in-one project management tool that your team will actually love. Plans start at just $9/month. Sign up now!",
    spend: 25000,
    revenue: 60000,
    impressions: 1200000,
  },
    {
    id: 3,
    advertiser: 'Ecom Masters',
    advertiserAvatar: 'https://i.pravatar.cc/40?u=ecom',
    adCreativeUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d54?q=80&w=1000&auto=format&fit=crop',
    adCopy: 'Stop guessing what sells. Our course reveals the top 100 trending skincare products for Q4. Limited spots available!',
    spend: 5000,
    revenue: 35000,
    impressions: 250000,
  },
];

export const AdGrid = ({ searchTerm }: { searchTerm: string }) => {
  const filteredAds = mockAds.filter(ad => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      ad.advertiser.toLowerCase().includes(lowerCaseSearchTerm) ||
      ad.adCopy.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">
          {searchTerm ? `Results for "${searchTerm}"` : 'Top Performing Ads'}
        </h3>
        <p className="text-gray-400 text-sm">{filteredAds.length} ads found</p>
      </div>
      {filteredAds.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <p className="text-xl font-bold mb-2">No Ads Found</p>
          <p className="text-gray-400">Try adjusting your search term.</p>
        </div>
      )}
    </section>
  );
};
