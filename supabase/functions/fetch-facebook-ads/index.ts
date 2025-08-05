// supabase/functions/fetch-facebook-ads/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const appId = Deno.env.get('FACEBOOK_APP_ID')
  const appSecret = Deno.env.get('FACEBOOK_APP_SECRET')

  if (!appId || !appSecret) {
    return new Response(
      JSON.stringify({ error: 'Missing Facebook API credentials.' }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 },
    )
  }

  const data = {
    message: 'Successfully accessed secrets!',
    appId: `...${appId.slice(-4)}`, // Return last 4 chars for confirmation
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
