"""
AI Service for generating structured research results
Uses OpenAI or Anthropic to generate research summaries
"""

import os
import json
import time
import logging
from typing import List, Dict, Optional
from openai import OpenAI
# Alternative: from anthropic import Anthropic

logger = logging.getLogger(__name__)

from models.search_models import (
    SearchRequestPayload, 
    SearchResultPayload, 
    SolutionStep, 
    DecisionFactor, 
    SourceLink
)


class AIService:
    def __init__(self):
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        base_url = os.getenv("OPENAI_BASE_URL") or os.getenv("OPENAI_API_BASE")
        client_kwargs = {"api_key": api_key}
        if base_url:
            client_kwargs["base_url"] = base_url
        
        self.client = OpenAI(**client_kwargs)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")  # or "gpt-3.5-turbo" for cheaper option
    
    async def generate_research_result(
        self,
        request: SearchRequestPayload,
        sources: List[Dict],
        request_id: Optional[str] = None
    ) -> SearchResultPayload:
        """
        Generate structured research result using AI
        """
        log_extra = {"request_id": request_id} if request_id else {}
        
        # Build prompt with sources and request
        prompt = self._build_research_prompt(request, sources)
        prompt_size = len(prompt)
        
        logger.info(
            f"🤖 External: OpenAI API | Model: {self.model} | Prompt size: {prompt_size} chars | Sources: {len(sources)}",
            extra=log_extra
        )
        
        api_start = time.time()
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a research assistant that provides structured, factual research results. Always cite sources and provide actionable recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                response_format={"type": "json_object"}  # Force JSON response
            )
            
            api_time = time.time() - api_start
            
            # Extract usage information if available
            usage_info = ""
            if hasattr(response, 'usage'):
                usage = response.usage
                usage_info = f" | Tokens: {usage.prompt_tokens} prompt + {usage.completion_tokens} completion = {usage.total_tokens} total"
            
            logger.info(
                f"✓ OpenAI API: Success | Time: {api_time:.3f}s{usage_info}",
                extra=log_extra
            )
            
            # Parse JSON response
            result_data = json.loads(response.choices[0].message.content)
            
            # Transform to SearchResultPayload
            return self._parse_ai_response(result_data, sources)
            
        except Exception as e:
            api_time = time.time() - api_start
            logger.error(
                f"✗ OpenAI API: Failed after {api_time:.3f}s | Error: {str(e)}",
                extra=log_extra,
                exc_info=True
            )
            raise
    
    def _build_research_prompt(self, request: SearchRequestPayload, sources: List[Dict]) -> str:
        """Build the prompt for AI research generation"""
        sources_text = "\n".join([
            f"- {s['title']}: {s['snippet']} ({s['url']})"
            for s in sources[:10]  # Limit to top 10 sources
        ])
        
        prompt = f"""
Research Request: {request.description}
Category: {request.category}
Priority: {request.priority}

Available Sources:
{sources_text}

Generate a comprehensive research result with:
1. A concise summary (2-3 sentences)
2. 3-5 actionable steps with clear titles and descriptions
3. 3-5 key decision factors with details
4. Estimated time to complete (in minutes)
5. Difficulty level (easy/medium/hard)
6. 3-5 recommended next actions

Format your response as JSON matching this structure:
{{
  "summary": "...",
  "steps": [{{"id": "...", "title": "...", "description": "..."}}],
  "decisionFactors": [{{"id": "...", "label": "...", "detail": "..."}}],
  "estimatedTimeMinutes": 10,
  "difficulty": "easy",
  "recommendedActions": ["..."]
}}
"""
        return prompt
    
    def _parse_ai_response(self, data: Dict, sources: List[Dict]) -> SearchResultPayload:
        """Parse AI response and combine with source data"""
        
        # Map sources to SourceLink format
        source_links = [
            SourceLink(
                id=f"src-{i}",
                title=s.get("title", "Source"),
                url=s.get("url", ""),
                credibility=s.get("credibility", 75),
                snippet=s.get("snippet", "")
            )
            for i, s in enumerate(sources[:5])  # Top 5 sources
        ]
        
        # Parse steps
        steps = [
            SolutionStep(
                id=f"step-{i}",
                title=step.get("title", ""),
                description=step.get("description", "")
            )
            for i, step in enumerate(data.get("steps", []))
        ]
        
        # Parse decision factors
        factors = [
            DecisionFactor(
                id=f"factor-{i}",
                label=factor.get("label", ""),
                detail=factor.get("detail", "")
            )
            for i, factor in enumerate(data.get("decisionFactors", []))
        ]
        
        return SearchResultPayload(
            summary=data.get("summary", ""),
            steps=steps,
            decisionFactors=factors,
            sources=source_links,
            estimatedTimeMinutes=data.get("estimatedTimeMinutes", 10),
            difficulty=data.get("difficulty", "medium"),
            recommendedActions=data.get("recommendedActions", [])
        )

