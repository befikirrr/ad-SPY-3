// src/components/AdCard.tsx

type AdMetricProps = {
  label: string;
  value: string;
  icon: string;
};

const AdMetric = ({ label, value, icon }: AdMetricProps) => (
  <div className="flex items-center gap-2">
    <span className="text-lg">{icon}</span>
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-bold text-white">{value}</div>
    </div>
  </div>
);

export type AdFromSupabase = {
  id: number;
  advertiser: string;
  advertiser_avatar: string | null;
  ad_creative_url: string | null;
  ad_copy: string | null;
  spend: number | null;
  revenue: number | null;
  impressions: number | null;
  // optional fields from scraping/ingestion
  source?: string | null;
  search_keyword?: string | null;
  scraped_at?: string | null;
};

type AdCardProps = {
    ad: AdFromSupabase;
    isSaved?: boolean;
    onSaveToggle?: (adId: number, isCurrentlySaved: boolean) => void;
    onCardClick?: (ad: AdFromSupabase) => void;
}

export const AdCard = ({ ad, isSaved, onSaveToggle, onCardClick }: AdCardProps) => {
  const spend = ad.spend ?? 0;
  const revenue = ad.revenue ?? 0;
  const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveToggle) {
        onSaveToggle(ad.id, !!isSaved);
    }
  };
  
  const cardProps = onCardClick ? { onClick: () => onCardClick(ad), className: "cursor-pointer" } : {};

  const scrapedLabel = ad.source === 'scraped' ? (ad.search_keyword ? `scraped: ${ad.search_keyword}` : 'scraped') : undefined;

  return (
    <div 
        className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
        {...cardProps}
    >
      <div className="relative">
        <img 
          src={ad.ad_creative_url ?? 'https://via.placeholder.com/400x200?text=No+Creative'} 
          alt="Ad Creative" 
          className="w-full h-48 object-cover bg-gray-800" 
        />
        {onSaveToggle && (
            <button 
                onClick={handleSaveClick}
                className={`absolute top-3 right-3 text-sm py-1 px-3 rounded-full transition-colors
                    ${isSaved 
                        ? 'bg-accent/80 text-white' 
                        : 'bg-black/50 text-gray-300 hover:bg-accent/80 hover:text-white'
                    }`
                }
            >
                {isSaved ? '★ Saved' : '☆ Save'}
            </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          <img 
            src={ad.advertiser_avatar ?? 'https://i.pravatar.cc/40'} 
            alt={ad.advertiser} 
            className="w-10 h-10 rounded-full mr-3 bg-gray-700" 
          />
          <div>
            <div className="font-bold text-white">{ad.advertiser}</div>
            <div className="text-xs text-gray-500">Sponsored</div>
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
          {ad.ad_copy ?? 'No ad copy available.'}
        </p>
        {scrapedLabel && (
          <div className="text-xs text-gray-400 mb-4">{scrapedLabel}</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-t border-border pt-4">
          <AdMetric label="Spend" value={`$${(spend / 1000).toFixed(1)}k`} icon="💸" />
          <AdMetric label="Revenue" value={`$${(revenue / 1000).toFixed(1)}k`} icon="💰" />
          <AdMetric label="ROI" value={`${roi.toFixed(0)}%`} icon={roi > 0 ? '📈' : '📉'} />
        </div>
      </div>
    </div>
  );
};
