// supabase/functions/fetch-facebook-ads/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

serve(async (req) => {
  const accessToken = Deno.env.get('FACEBOOK_USER_ACCESS_TOKEN');
  const adAccountId = Deno.env.get('FACEBOOK_AD_ACCOUNT_ID'); // We'll need this soon

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Missing Facebook Access Token.' }), { status: 500 });
  }

  // For now, we'll search for a hardcoded keyword. We can make this dynamic later.
  const search_terms = 'skincare';
  const fields = 'ad_creative_body,ad_creative_link_caption,ad_creative_link_description,ad_creative_link_title,ad_snapshot_url,spend,impressions,clicks';

  const url = `${BASE_URL}/ads_archive?search_terms='${search_terms}'&ad_type=ALL&ad_reached_countries=['US']&fields=${fields}&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Facebook API Error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to fetch data from Facebook API.', details: errorData }), { status: response.status });
    }

    const data = await response.json();

    // Here is where we would normally process the data and save it to our Supabase table.
    // For now, let's just return the raw data to see if the API call worked.

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error fetching ads:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500 });
  }
})
