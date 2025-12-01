"""
Search Engine Service
Gathers sources from web searches and scrapes relevant information
"""

import os
import time
import logging
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
from googlesearch import search as google_search
# Alternative: Use SerpAPI, Bing Search API, or DuckDuckGo API

logger = logging.getLogger(__name__)


class SearchEngine:
    def __init__(self):
        self.serp_api_key = os.getenv("SERP_API_KEY")  # Optional: for better search results
        self.last_search_time = 0
        self.min_search_interval = 2.0  # Minimum seconds between searches to avoid rate limiting
    
    async def gather_sources(
        self,
        query: str,
        category: str,
        max_results: int = 10,
        request_id: Optional[str] = None
    ) -> List[Dict]:
        """
        Search the web and gather relevant sources
        Returns list of sources with title, URL, snippet, and credibility score
        """
        sources = []
        
        # Build search query
        search_query = f"{query} {category}"
        log_extra = {"request_id": request_id} if request_id else {}
        
        # Rate limiting: Add delay between searches to avoid 429 errors
        import asyncio
        time_since_last_search = time.time() - self.last_search_time
        if time_since_last_search < self.min_search_interval:
            delay = self.min_search_interval - time_since_last_search
            logger.debug(
                f"⏳ Rate limiting: Waiting {delay:.2f}s before search to avoid rate limits",
                extra=log_extra
            )
            await asyncio.sleep(delay)
        
        try:
            # Option 1: Use Google Search (free but rate-limited)
            # Note: Google may rate limit free searches. Consider using SerpAPI for production.
            logger.info(
                f"🔎 External: Google Search API | Query: '{search_query}' | Max results: {max_results}",
                extra=log_extra
            )
            
            search_start = time.time()
            self.last_search_time = search_start
            try:
                search_results = await asyncio.wait_for(
                    asyncio.to_thread(lambda: list(google_search(search_query, num_results=max_results))),
                    timeout=10.0  # 10 second timeout
                )
                search_time = time.time() - search_start
                logger.info(
                    f"✓ Google Search API: Found {len(search_results)} URLs in {search_time:.3f}s",
                    extra=log_extra
                )
            except asyncio.TimeoutError:
                search_time = time.time() - search_start
                logger.warning(
                    f"⚠ Google Search API: Timeout after {search_time:.3f}s, using fallback sources",
                    extra=log_extra
                )
                sources = self._get_fallback_sources(query, category)
                return sources[:max_results]
            except Exception as search_error:
                search_time = time.time() - search_start
                # Check if it's a rate limit error (429) or HTTP error
                error_str = str(search_error)
                error_type = type(search_error).__name__
                
                # Check for HTTPError or rate limiting
                is_rate_limit = (
                    "429" in error_str or 
                    "Too Many Requests" in error_str or
                    (hasattr(search_error, 'response') and 
                     hasattr(search_error.response, 'status_code') and 
                     search_error.response.status_code == 429)
                )
                
                if is_rate_limit:
                    logger.warning(
                        f"⚠ Google Search API: Rate limited (429) after {search_time:.3f}s, using fallback sources. "
                        f"Consider using SerpAPI or increasing min_search_interval.",
                        extra=log_extra
                    )
                else:
                    logger.warning(
                        f"⚠ Google Search API: {error_type} after {search_time:.3f}s: {error_str[:150]}, using fallback sources",
                        extra=log_extra
                    )
                sources = self._get_fallback_sources(query, category)
                return sources[:max_results]
            
            # Option 2: Use SerpAPI (paid but more reliable)
            # search_results = self._serp_search(search_query, max_results)
            
            # Fetch and parse each result
            logger.info(
                f"📥 Fetching {len(search_results[:max_results])} source pages...",
                extra=log_extra
            )
            
            for idx, url in enumerate(search_results[:max_results], 1):
                try:
                    source = await self._fetch_source_info(url, query, request_id=request_id)
                    if source:
                        sources.append(source)
                        logger.debug(
                            f"  [{idx}/{len(search_results[:max_results])}] ✓ {url[:60]}...",
                            extra=log_extra
                        )
                except Exception as e:
                    logger.warning(
                        f"  [{idx}/{len(search_results[:max_results])}] ✗ Failed to fetch {url[:60]}...: {str(e)}",
                        extra=log_extra
                    )
                    continue
                    
        except Exception as e:
            logger.error(
                f"✗ Search error: {str(e)}",
                extra=log_extra,
                exc_info=True
            )
            # Fallback to mock sources
            sources = self._get_fallback_sources(query, category)
        
        # Sort by credibility
        sources.sort(key=lambda x: x.get("credibility", 0), reverse=True)
        
        return sources[:max_results]
    
    async def _fetch_source_info(self, url: str, query: str, request_id: Optional[str] = None) -> Dict | None:
        """Fetch and parse a single source"""
        log_extra = {"request_id": request_id} if request_id else {}
        fetch_start = time.time()
        
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (compatible; SearchBot/1.0)"
            }
            
            logger.debug(
                f"  → HTTP GET {url[:60]}...",
                extra=log_extra
            )
            
            response = requests.get(url, headers=headers, timeout=5)
            fetch_time = time.time() - fetch_start
            
            response.raise_for_status()
            
            logger.debug(
                f"  ← HTTP {response.status_code} | Size: {len(response.content)} bytes | Time: {fetch_time:.3f}s",
                extra=log_extra
            )
            
            soup = BeautifulSoup(response.content, "html.parser")
            
            # Extract title
            title = soup.find("title")
            title_text = title.string if title else url
            
            # Extract meta description or first paragraph
            meta_desc = soup.find("meta", attrs={"name": "description"})
            snippet = meta_desc.get("content", "") if meta_desc else ""
            
            if not snippet:
                # Fallback to first paragraph
                first_p = soup.find("p")
                snippet = first_p.get_text()[:200] if first_p else ""
            
            # Calculate credibility (simplified - could use ML model)
            credibility = self._calculate_credibility(url, title_text)
            
            return {
                "title": title_text,
                "url": url,
                "snippet": snippet[:300],  # Limit snippet length
                "credibility": credibility
            }
            
        except requests.exceptions.RequestException as e:
            fetch_time = time.time() - fetch_start
            logger.debug(
                f"  ✗ HTTP Error: {type(e).__name__} | Time: {fetch_time:.3f}s",
                extra=log_extra
            )
            return None
        except Exception as e:
            fetch_time = time.time() - fetch_start
            logger.debug(
                f"  ✗ Parsing error: {str(e)} | Time: {fetch_time:.3f}s",
                extra=log_extra
            )
            return None
    
    def _calculate_credibility(self, url: str, title: str) -> int:
        """
        Calculate credibility score (0-100)
        Simple heuristic - could be improved with ML
        """
        score = 50  # Base score
        
        # Boost for known domains
        trusted_domains = [
            "nytimes.com", "washingtonpost.com", "wsj.com",
            "wikipedia.org", "github.com", "stackoverflow.com",
            "reddit.com", "medium.com", "techcrunch.com"
        ]
        
        for domain in trusted_domains:
            if domain in url.lower():
                score += 20
                break
        
        # Boost for .edu, .gov
        if ".edu" in url or ".gov" in url:
            score += 15
        
        # Penalize suspicious domains
        if any(x in url for x in [".xyz", ".tk", ".ml"]):
            score -= 20
        
        return min(100, max(0, score))
    
    def _get_fallback_sources(self, query: str, category: str) -> List[Dict]:
        """Return fallback sources when search fails (rate limited or error)"""
        # Provide more useful fallback sources based on category
        fallback_urls = [
            f"https://www.google.com/search?q={query.replace(' ', '+')}+{category}",
            f"https://www.wikipedia.org/wiki/{query.replace(' ', '_')}",
        ]
        
        sources = []
        for url in fallback_urls:
            sources.append({
                "title": f"Search: {query} ({category})",
                "url": url,
                "snippet": f"Search results and information about {query} in the {category} category. "
                          f"Note: Direct web search was rate-limited. Please use the provided search links.",
                "credibility": 50
            })
        
        return sources
    
    def _serp_search(self, query: str, max_results: int) -> List[str]:
        """Use SerpAPI for better search results (requires API key)"""
        if not self.serp_api_key:
            return []
        
        import serpapi
        
        search = serpapi.GoogleSearch({
            "q": query,
            "api_key": self.serp_api_key,
            "num": max_results
        })
        
        results = search.get_dict()
        return [r.get("link", "") for r in results.get("organic_results", [])]

