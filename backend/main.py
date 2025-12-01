"""
SearchBot Backend API
FastAPI server for processing research requests
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from services.search_engine import SearchEngine
from services.ai_service import AIService
from models.search_models import SearchRequestPayload, SearchResultPayload

load_dotenv()

app = FastAPI(title="SearchBot API", version="1.0.0")

# Create API router with /v1 prefix
api_router = APIRouter(prefix="/v1")

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8081").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
search_engine = SearchEngine()
ai_service = AIService()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "searchbot-api"}


@api_router.post("/search", response_model=SearchResultPayload)
async def search(request: SearchRequestPayload):
    """
    Main search endpoint - processes research requests and returns structured results
    """
    try:
        # Process the search request
        # 1. Gather information from web sources
        sources = await search_engine.gather_sources(
            query=request.description,
            category=request.category
        )
        
        # 2. Use AI to generate structured research results
        result = await ai_service.generate_research_result(
            request=request,
            sources=sources
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search processing failed: {str(e)}"
        )


@api_router.post("/search/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload and process image for visual search
    Returns image URL that can be used in search request
    """
    # TODO: Implement image upload to S3/Cloudinary
    # For now, return placeholder
    return {"imageUri": f"https://storage.searchbot.com/{file.filename}"}


# Include API router
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

