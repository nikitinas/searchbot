"""
SearchBot Backend API
FastAPI server for processing research requests
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
import os
import time
import logging
import uuid
from dotenv import load_dotenv

from services.search_engine import SearchEngine
from services.ai_service import AIService
from models.search_models import SearchRequestPayload, SearchResultPayload

load_dotenv()

# Custom filter to add request ID to logs
class RequestIDFilter(logging.Filter):
    def filter(self, record):
        # Always ensure request_id exists, default to 'system' for non-request logs
        if not hasattr(record, 'request_id'):
            record.request_id = 'system'
        return True

# Configure logging with filter applied to root logger
root_logger = logging.getLogger()
root_logger.addFilter(RequestIDFilter())

# Use a custom formatter that handles missing request_id gracefully
class SafeFormatter(logging.Formatter):
    def format(self, record):
        # Ensure request_id exists before formatting (double-check in case filter didn't run)
        if not hasattr(record, 'request_id'):
            record.request_id = 'system'
        try:
            return super().format(record)
        except (KeyError, ValueError) as e:
            # Fallback format if request_id still causes issues
            record.request_id = 'system'
            return f"{self.formatTime(record, self.datefmt)} - {record.name} - {record.levelname} - [system] - {record.getMessage()}"

# Configure logging - only if not already configured
if not root_logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(SafeFormatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    ))
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
else:
    # If handlers exist (from uvicorn), update their formatters
    for handler in root_logger.handlers:
        if isinstance(handler, logging.StreamHandler):
            handler.setFormatter(SafeFormatter(
                fmt='%(asctime)s - %(name)s - %(levelname)s - [%(request_id)s] - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            ))

# Create logger for request tracing
logger = logging.getLogger(__name__)

# Suppress verbose httpx/httpcore logging (it's too noisy and causes format errors)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)  # Also suppress OpenAI's verbose logs

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

# Middleware to add request ID and trace requests
@app.middleware("http")
async def trace_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    start_time = time.time()
    
    # Add request ID to request state
    request.state.request_id = request_id
    
    # Log incoming request
    logger.info(
        f"→ Incoming request: {request.method} {request.url.path}",
        extra={"request_id": request_id}
    )
    
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"← Response: {response.status_code} | Time: {process_time:.3f}s",
            extra={"request_id": request_id}
        )
        
        return response
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"✗ Request failed: {str(e)} | Time: {process_time:.3f}s",
            extra={"request_id": request_id},
            exc_info=True
        )
        raise

# Initialize services lazily to handle missing API keys gracefully
search_engine = None
ai_service = None

def get_search_engine():
    global search_engine
    if search_engine is None:
        search_engine = SearchEngine()
    return search_engine

def get_ai_service():
    global ai_service
    if ai_service is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OPENAI_API_KEY environment variable not set. Please configure it in .env file."
            )
        ai_service = AIService()
    return ai_service


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "searchbot-api"}


@api_router.post("/search", response_model=SearchResultPayload)
async def search(request: SearchRequestPayload, http_request: Request):
    """
    Main search endpoint - processes research requests and returns structured results
    """
    request_id = getattr(http_request.state, 'request_id', 'unknown')
    logger.info(
        f"🔍 Starting search: query='{request.description[:50]}...' category={request.category} priority={request.priority}",
        extra={"request_id": request_id}
    )
    
    try:
        # Process the search request
        # 1. Gather information from web sources
        logger.info(
            f"📡 Step 1/2: Gathering web sources...",
            extra={"request_id": request_id}
        )
        search_start = time.time()
        
        search_engine = get_search_engine()
        sources = await search_engine.gather_sources(
            query=request.description,
            category=request.category,
            request_id=request_id
        )
        
        search_time = time.time() - search_start
        logger.info(
            f"✓ Found {len(sources)} sources in {search_time:.3f}s",
            extra={"request_id": request_id}
        )
        
        # 2. Use AI to generate structured research results
        logger.info(
            f"🤖 Step 2/2: Generating AI research result...",
            extra={"request_id": request_id}
        )
        ai_start = time.time()
        
        ai_service = get_ai_service()
        result = await ai_service.generate_research_result(
            request=request,
            sources=sources,
            request_id=request_id
        )
        
        ai_time = time.time() - ai_start
        total_time = time.time() - search_start
        
        logger.info(
            f"✓ Search completed: {len(result.steps)} steps, {len(result.sources)} sources | "
            f"AI: {ai_time:.3f}s | Total: {total_time:.3f}s",
            extra={"request_id": request_id}
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_details = str(e)
        logger.error(
            f"✗ Search processing failed: {error_details}",
            extra={"request_id": request_id},
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Search processing failed: {error_details}"
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
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

