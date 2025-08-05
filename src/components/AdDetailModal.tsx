// src/components/AdDetailModal.tsx
import { AdFromSupabase } from './AdCard';

type AdDetailModalProps = {
  ad: AdFromSupabase | null;
  onClose: () => void;
};

export const AdDetailModal = ({ ad, onClose }: AdDetailModalProps) => {
  if (!ad) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <div className="p-4 flex justify-end">
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Creative */}
            <div>
                 <img 
                    src={ad.ad_creative_url ?? 'https://via.placeholder.com/400x200?text=No+Creative'} 
                    alt="Ad Creative" 
                    className="w-full rounded-lg object-cover bg-gray-800"
                 />
            </div>
            {/* Right side: Details */}
            <div>
                <div className="flex items-center mb-6">
                  <img 
                    src={ad.advertiser_avatar ?? 'https://i.pravatar.cc/40'} 
                    alt={ad.advertiser} 
                    className="w-12 h-12 rounded-full mr-4 bg-gray-700" 
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{ad.advertiser}</h2>
                    <div className="text-sm text-gray-500">Sponsored Content</div>
                  </div>
                </div>

                <p className="text-gray-300 mb-6">{ad.ad_copy ?? 'No ad copy.'}</p>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold border-b border-border pb-2">Performance Breakdown</h3>
                    {/* Add more detailed stats here */}
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Spend:</span>
                        <span className="font-bold text-lg">${ad.spend?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Revenue:</span>
                        <span className="font-bold text-lg text-green-400">${ad.revenue?.toLocaleString()}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Impressions:</span>
                        <span className="font-bold text-lg">{ad.impressions?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Return on Ad Spend (ROI):</span>
                        <span className="font-bold text-2xl text-green-400">
                            {ad.spend ? (((ad.revenue ?? 0) - ad.spend) / ad.spend * 100).toFixed(0) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
