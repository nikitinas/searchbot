#!/usr/bin/env python3
"""
Simple script to test the backend API locally
"""

import requests
import json
import sys

API_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        print(f"✓ Health check: {response.status_code}")
        print(f"  Response: {json.dumps(response.json(), indent=2)}")
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server. Is it running?")
        print("  Start server with: uvicorn main:app --reload --port 8000")
        return False
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return False

def test_search():
    """Test search endpoint"""
    print("\nTesting search endpoint...")
    payload = {
        "id": "test-123",
        "description": "How to learn Python programming",
        "category": "education",
        "priority": "normal",
        "createdAt": "2024-01-01T00:00:00Z"
    }
    
    try:
        print(f"  Sending request: {payload['description']}")
        response = requests.post(
            f"{API_URL}/v1/search",
            json=payload,
            timeout=60  # AI generation can take time
        )
        
        if response.status_code == 200:
            print(f"✓ Search successful: {response.status_code}")
            result = response.json()
            print(f"  Summary: {result.get('summary', '')[:100]}...")
            print(f"  Steps: {len(result.get('steps', []))}")
            print(f"  Sources: {len(result.get('sources', []))}")
            return True
        else:
            print(f"✗ Search failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("✗ Request timed out (this can happen with slow AI responses)")
        return False
    except Exception as e:
        print(f"✗ Search failed: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Backend API Local Test")
    print("=" * 50)
    
    if not test_health():
        sys.exit(1)
    
    if not test_search():
        print("\n⚠ Search test failed. Check:")
        print("  1. Is OPENAI_API_KEY set in .env?")
        print("  2. Check server logs for errors")
        print("  3. Try the interactive docs at http://localhost:8000/docs")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✓ All tests passed!")
    print("=" * 50)
    print("\nTry the interactive API docs at: http://localhost:8000/docs")

