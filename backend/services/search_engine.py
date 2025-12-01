"""
Search Engine Service
Gathers sources from web searches and scrapes relevant information
"""

import os
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
from googlesearch import search as google_search
# Alternative: Use SerpAPI, Bing Search API, or DuckDuckGo API


class SearchEngine:
    def __init__(self):
        self.serp_api_key = os.getenv("SERP_API_KEY")  # Optional: for better search results
    
    async def gather_sources(
        self,
        query: str,
        category: str,
        max_results: int = 10
    ) -> List[Dict]:
        """
        Search the web and gather relevant sources
        Returns list of sources with title, URL, snippet, and credibility score
        """
        sources = []
        
        # Build search query
        search_query = f"{query} {category}"
        
        try:
            # Option 1: Use Google Search (free but rate-limited)
            search_results = list(google_search(search_query, num_results=max_results))
            
            # Option 2: Use SerpAPI (paid but more reliable)
            # search_results = self._serp_search(search_query, max_results)
            
            # Fetch and parse each result
            for url in search_results[:max_results]:
                try:
                    source = await self._fetch_source_info(url, query)
                    if source:
                        sources.append(source)
                except Exception as e:
                    print(f"Error fetching {url}: {e}")
                    continue
                    
        except Exception as e:
            print(f"Search error: {e}")
            # Fallback to mock sources
            sources = self._get_fallback_sources(query, category)
        
        # Sort by credibility
        sources.sort(key=lambda x: x.get("credibility", 0), reverse=True)
        
        return sources[:max_results]
    
    async def _fetch_source_info(self, url: str, query: str) -> Dict | None:
        """Fetch and parse a single source"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (compatible; SearchBot/1.0)"
            }
            response = requests.get(url, headers=headers, timeout=5)
            response.raise_for_status()
            
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
            
        except Exception as e:
            print(f"Error parsing {url}: {e}")
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
        """Return fallback sources when search fails"""
        return [
            {
                "title": f"Search results for {query}",
                "url": f"https://www.google.com/search?q={query}",
                "snippet": f"Search results related to {query} in {category}",
                "credibility": 60
            }
        ]
    
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

