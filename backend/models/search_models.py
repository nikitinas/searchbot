"""
Pydantic models matching frontend TypeScript types
"""

from pydantic import BaseModel
from typing import Optional, List


class SolutionStep(BaseModel):
    id: str
    title: str
    description: str


class DecisionFactor(BaseModel):
    id: str
    label: str
    detail: str


class SourceLink(BaseModel):
    id: str
    title: str
    url: str
    credibility: int  # 0-100
    snippet: str


class SearchRequestPayload(BaseModel):
    id: str
    description: str
    category: str
    priority: str  # 'urgent' | 'normal' | 'low'
    imageUri: Optional[str] = None
    voiceTranscript: Optional[str] = None
    createdAt: str


class SearchResultPayload(BaseModel):
    summary: str
    steps: List[SolutionStep]
    decisionFactors: List[DecisionFactor]
    sources: List[SourceLink]
    estimatedTimeMinutes: int
    difficulty: str  # 'easy' | 'medium' | 'hard'
    recommendedActions: List[str]

