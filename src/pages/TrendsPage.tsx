// src/pages/TrendsPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AdFromSupabase } from '../components/AdCard'
import { Bar } from 'react-chartjs-2'
import { registerCharts } from '../lib/charts'

registerCharts()

function getTopSpenders(ads: AdFromSupabase[], topN = 5) {
  const spendByAdvertiser = new Map<string, number>()
  for (const ad of ads) {
    const key = ad.advertiser || 'Unknown'
    const spend = ad.spend ?? 0
    spendByAdvertiser.set(key, (spendByAdvertiser.get(key) ?? 0) + spend)
  }
  const arr = Array.from(spendByAdvertiser.entries()).sort((a, b) => b[1] - a[1])
  return arr.slice(0, topN)
}

function getTopRoiAds(ads: AdFromSupabase[], topN = 5) {
  const withRoi = ads.map(ad => {
    const spend = ad.spend ?? 0
    const revenue = ad.revenue ?? 0
    const roi = spend > 0 ? (revenue - spend) / spend : 0
    return { ad, roi }
  })
  return withRoi.sort((a, b) => b.roi - a.roi).slice(0, topN)
}

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','else','for','to','of','in','on','at','by','with','from','is','are','was','were','be','this','that','it','you','your','our','we','us','as','now','get','new'
])

function getTopKeywords(ads: AdFromSupabase[], topN = 12) {
  const counts = new Map<string, number>()
  for (const ad of ads) {
    const text = (ad.ad_copy ?? '').toLowerCase()
    const words = text.split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !STOPWORDS.has(w))
    for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1)
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, topN)
}

export const TrendsPage = () => {
  const [ads, setAds] = useState<AdFromSupabase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase.from('ads').select('*')
      if (error) {
        setError('Failed to load ads')
      } else {
        setAds((data ?? []) as AdFromSupabase[])
      }
      setLoading(false)
    }
    run()
  }, [])

  const topSpenders = useMemo(() => getTopSpenders(ads), [ads])
  const topRoiAds = useMemo(() => getTopRoiAds(ads), [ads])
  const topKeywords = useMemo(() => getTopKeywords(ads), [ads])

  const spendChart = {
    labels: topSpenders.map(([name]) => name),
    datasets: [
      {
        label: 'Spend',
        data: topSpenders.map(([, amount]) => amount),
        backgroundColor: 'rgba(88, 166, 255, 0.5)',
        borderColor: 'rgba(88, 166, 255, 1)',
        borderWidth: 1,
      },
    ],
  } as const

  const roiChart = {
    labels: topRoiAds.map(({ ad }) => ad.advertiser ?? 'Unknown'),
    datasets: [
      {
        label: 'ROI',
        data: topRoiAds.map(({ roi }) => Math.round(roi * 100) / 100),
        backgroundColor: 'rgba(80, 255, 160, 0.5)',
        borderColor: 'rgba(80, 255, 160, 1)',
        borderWidth: 1,
      },
    ],
  } as const

  const keywordsChart = {
    labels: topKeywords.map(([kw]) => kw),
    datasets: [
      {
        label: 'Frequency',
        data: topKeywords.map(([, c]) => c),
        backgroundColor: 'rgba(200, 160, 255, 0.5)',
        borderColor: 'rgba(200, 160, 255, 1)',
        borderWidth: 1,
      },
    ],
  } as const

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#c7d1d9' } } },
    scales: {
      x: { ticks: { color: '#9ba7b4' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ba7b4' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  } as const

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trends</h1>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-bold mb-3">Top Spenders (by Advertiser)</h2>
            <Bar data={spendChart} options={chartOptions} />
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <h2 className="font-bold mb-3">Top ROI Ads</h2>
            <Bar data={roiChart} options={chartOptions} />
          </div>
          <div className="bg-card border border-border rounded-xl p-4 lg:col-span-2">
            <h2 className="font-bold mb-3">Keyword Frequency (Ad Copy)</h2>
            <Bar data={keywordsChart} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  )
}
