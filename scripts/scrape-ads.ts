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
  })
  const page = await context.newPage()

  const url = `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&q=${encodeURIComponent(keyword)}&search_type=keyword_unordered`;
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Accept cookies prompt if present
  try {
    const accept = page.locator('text=Only allow essential cookies')
    if (await accept.isVisible({ timeout: 2000 }).catch(()=>false)) {
      await accept.click()
    }
  } catch {}

  // Wait for results container
  await page.waitForTimeout(4000)

  // Scroll to load more
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 2000)
    await page.waitForTimeout(1500)
  }

  // Basic extraction: cards contain advertiser name, ad copy snippet, and image thumbs
  const cards = page.locator('[data-ad-preview="1"], div.x1lliihq.x1n2onr6')
  const count = await cards.count()

  const records: Array<{advertiser: string; ad_copy: string | null; ad_creative_url: string | null;}> = []

  for (let i = 0; i < Math.min(count, 30); i++) {
    const card = cards.nth(i)
    const advertiser = (await card.locator('a[role="link"]').first().innerText().catch(()=>null)) || 'Unknown'
    const adCopy = await card.locator('div[dir="auto"]').first().innerText().catch(()=>null)
    const img = await card.locator('img').first().getAttribute('src').catch(()=>null)

    records.push({ advertiser, ad_copy: adCopy, ad_creative_url: img })
  }

  await browser.close()

  // Insert into Supabase `ads` (dedupe naive by advertiser+copy)
  for (const r of records) {
    if (!r.advertiser && !r.ad_copy) continue
    await supabase.from('ads').insert({
      advertiser: r.advertiser,
      advertiser_avatar: null,
      ad_creative_url: r.ad_creative_url,
      ad_copy: r.ad_copy,
      spend: null,
      revenue: null,
      impressions: null,
    }).then(({ error }) => {
      if (error) console.error('Insert error:', error.message)
    })
  }

  console.log(`Inserted ~${records.length} scraped ads for keyword: ${keyword}`)
}

const keyword = process.argv[2] || 'skincare'

scrape(keyword).catch(err => {
  console.error(err)
  process.exit(1)
})
