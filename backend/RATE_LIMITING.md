# Rate Limiting Guide

## Issue: Google Search Rate Limiting (429 Errors)

The free `googlesearch-python` library is subject to Google's rate limits. You may see `429 Too Many Requests` errors when making multiple searches.

## Current Mitigations

### 1. **Automatic Rate Limiting**
- Added 2-second minimum delay between searches
- Prevents rapid-fire requests that trigger rate limits

### 2. **Graceful Fallback**
- When rate limited, the system automatically uses fallback sources
- Search continues to work, just with limited source data
- Logs clearly indicate when fallback is used

### 3. **Better Error Handling**
- 429 errors are caught and handled gracefully
- Clear warning messages in logs
- System continues to function

## Solutions

### Option 1: Use SerpAPI (Recommended for Production)

**Pros:**
- Reliable, no rate limiting issues
- Better search results
- Official API

**Setup:**
1. Get API key from https://serpapi.com/
2. Add to `.env`:
   ```
   SERP_API_KEY=your-serp-api-key
   ```
3. Uncomment SerpAPI code in `search_engine.py`:
   ```python
   # Change line ~85 from:
   # search_results = self._serp_search(search_query, max_results)
   # To:
   search_results = self._serp_search(search_query, max_results)
   ```

**Cost:** ~$50/month for 5,000 searches

### Option 2: Increase Rate Limit Delay

Edit `search_engine.py`:
```python
self.min_search_interval = 5.0  # Increase from 2.0 to 5.0 seconds
```

**Pros:** Free
**Cons:** Slower searches, may still hit limits

### Option 3: Use Alternative Search APIs

- **DuckDuckGo API** - Free, no rate limits
- **Bing Search API** - Microsoft Azure (paid)
- **Brave Search API** - Paid but privacy-focused

### Option 4: Cache Search Results

Implement caching to avoid repeated searches:
- Cache results by query for 1-24 hours
- Use Redis or in-memory cache
- Reduces API calls significantly

## Monitoring

Check logs for rate limit warnings:
```
⚠ Google Search API: Rate limited (429) after X.XXXs, using fallback sources
```

If you see this frequently, consider upgrading to SerpAPI.

## Current Behavior

When rate limited:
1. System logs warning with request ID
2. Falls back to generic search sources
3. AI generation continues with available sources
4. User still gets results (may be less detailed)

The system is designed to **degrade gracefully** rather than fail completely.

