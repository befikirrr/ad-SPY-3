import 'dotenv/config'
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL as string
const SUPABASE_ANON = process.env.SUPABASE_ANON as string

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON in env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

async function scrape(keyword: string) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    locale: 'en-US',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36',
  })
  const page = await context.newPage()

  const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })

  // Accept cookies prompt if present
  try {
    const accept = page.locator('text=Only allow essential cookies,Allow all cookies').first()
    if (await accept.isVisible({ timeout: 3000 }).catch(()=>false)) {
      await accept.click()
    }
  } catch {}

  // Let content render
  await page.waitForTimeout(5000)

  // Scroll to load more
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 2000)
    await page.waitForTimeout(1200)
  }

  // Card locator (best-effort – Facebook DOM is dynamic)
  const cards = page.locator('[data-ad-preview="1"], div[role="article"]').filter({ has: page.locator('img') })
  const count = await cards.count()

  const seen = new Set<string>()
  const records: Array<{advertiser: string; ad_copy: string | null; ad_creative_url: string | null;}> = []

  for (let i = 0; i < Math.min(count, 40); i++) {
    const card = cards.nth(i)

    // Try to infer advertiser from closest link or strong text
    let advertiser = await card.locator('a[role="link"]:visible').first().innerText().catch(()=>null)
    if (!advertiser || advertiser.length > 80) {
      advertiser = await card.locator('strong:visible, span[dir="auto"]:visible').first().innerText().catch(()=>null)
    }
    advertiser = advertiser?.trim() || 'Unknown'

    // Extract a short ad copy snippet
    let adCopy = await card.locator('div[dir="auto"]:visible').first().innerText().catch(()=>null)
    if (!adCopy) {
      const txt = await card.textContent().catch(()=>null)
      adCopy = txt?.replace(/\s+/g, ' ').trim().slice(0, 400) || null
    }

    // Screenshot the card as a small thumbnail
    let dataUrl: string | null = null
    try {
      const buf = await card.screenshot({ type: 'png' })
      dataUrl = `data:image/png;base64,${Buffer.from(buf).toString('base64')}`
    } catch {
      // fallback: first image src
      dataUrl = await card.locator('img').first().getAttribute('src').catch(()=>null)
    }

    const key = `${(advertiser||'').toLowerCase()}::${(adCopy||'').slice(0,200).toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)

    records.push({ advertiser, ad_copy: adCopy, ad_creative_url: dataUrl })
  }

  await browser.close()

  // Insert into Supabase `ads` (include search_keyword & source)
  for (const r of records) {
    if (!r.advertiser && !r.ad_copy) continue
    const { error } = await supabase.from('ads').insert({
      advertiser: r.advertiser,
      advertiser_avatar: null,
      ad_creative_url: r.ad_creative_url,
      ad_copy: r.ad_copy,
      spend: null,
      revenue: null,
      impressions: null,
      source: 'scraped',
      search_keyword: keyword,
    })
    if (error) console.error('Insert error:', error.message)
  }

  console.log(`Inserted ~${records.length} scraped ads for keyword: ${keyword}`)
}

const keyword = process.argv[2] || 'skincare'

scrape(keyword).catch(err => {
  console.error(err)
  process.exit(1)
})
