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

export type AdCardData = {
  id: number;
  advertiser: string;
  advertiserAvatar: string;
  adCreativeUrl: string;
  adCopy: string;
  spend: number;
  revenue: number;
  impressions: number;
};

export const AdCard = ({ ad }: { ad: AdCardData }) => {
  const roi = ((ad.revenue - ad.spend) / ad.spend) * 100;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-md transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5">
      {/* Ad Creative */}
      <img src={ad.adCreativeUrl} alt="Ad Creative" className="w-full h-48 object-cover" />

      <div className="p-4">
        {/* Advertiser Info */}
        <div className="flex items-center mb-4">
          <img src={ad.advertiserAvatar} alt={ad.advertiser} className="w-10 h-10 rounded-full mr-3" />
          <div>
            <div className="font-bold text-white">{ad.advertiser}</div>
            <div className="text-xs text-gray-500">Sponsored</div>
          </div>
        </div>

        {/* Ad Copy */}
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          {ad.adCopy}
        </p>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-t border-border pt-4">
          <AdMetric label="Spend" value={`$${(ad.spend / 1000).toFixed(1)}k`} icon="💸" />
          <AdMetric label="Revenue" value={`$${(ad.revenue / 1000).toFixed(1)}k`} icon="💰" />
          <AdMetric label="ROI" value={`${roi.toFixed(0)}%`} icon={roi > 0 ? '📈' : '📉'} />
        </div>
      </div>
    </div>
  );
};
