// src/components/AdDetailModal.tsx
import { AdFromSupabase } from './AdCard';
import { Line } from 'react-chartjs-2';
import { registerCharts } from '../lib/charts';

registerCharts();

type AdDetailModalProps = {
  ad: AdFromSupabase | null;
  onClose: () => void;
};

export const AdDetailModal = ({ ad, onClose }: AdDetailModalProps) => {
  if (!ad) return null;

  const spend = ad.spend ?? 0;
  const revenue = ad.revenue ?? 0;

  // Placeholder time-series until real metrics are available
  const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  const spendSeries = labels.map((_, i) => Math.max(0, (spend / 7) * (0.8 + (i % 3) * 0.1)));
  const revenueSeries = labels.map((_, i) => Math.max(0, (revenue / 7) * (0.7 + ((i + 1) % 3) * 0.15)));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Spend',
        data: spendSeries,
        borderColor: 'rgba(88, 166, 255, 1)',
        backgroundColor: 'rgba(88, 166, 255, 0.2)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Revenue',
        data: revenueSeries,
        borderColor: 'rgba(80, 255, 160, 1)',
        backgroundColor: 'rgba(80, 255, 160, 0.2)',
        tension: 0.35,
        fill: true,
      },
    ],
  } as const;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#c7d1d9' } },
    },
    scales: {
      x: { ticks: { color: '#9ba7b4' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ba7b4' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  } as const;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-end">
            <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Creative */}
            <div>
                 <img 
                    src={ad.ad_creative_url ?? 'https://via.placeholder.com/400x200?text=No+Creative'} 
                    alt="Ad Creative" 
                    className="w-full rounded-lg object-cover bg-gray-800"
                 />
            </div>
            {/* Right: Details */}
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
                    <h3 className="text-lg font-bold border-b border-border pb-2">Performance (last 7 days)</h3>
                    <div className="bg-black/20 border border-border rounded-xl p-3">
                      <Line data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
