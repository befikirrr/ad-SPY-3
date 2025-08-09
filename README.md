# Ad SPY 3

## Scraper (Playwright)

Create a `.env` file in project root with:

```
SUPABASE_URL=https://wcukpvcefvuewgktcqzg.supabase.co
SUPABASE_ANON=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdWtwdmNlZnZ1ZXdna3RjcXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTk5NTgsImV4cCI6MjA2OTk5NTk1OH0.rVbhC2A7YnH2tUakWOn_-MRM8ZLxjj7Gbf09ncP0Z74
```

Install browsers (once):

```
npx playwright install chromium --with-deps
```

Run scraper (default keyword skincare):

```
npm run scrape
```

Or with a custom keyword:

```
npm run scrape -- "protein powder"
```
