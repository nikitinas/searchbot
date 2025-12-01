# Language Detection Feature

The SearchBot app now automatically detects the user's input language and responds in that language.

## How It Works

### Frontend Detection
1. When a user submits a search, the frontend detects the language from the input text
2. Uses pattern matching for common languages (Spanish, French, German, etc.)
3. Falls back to browser language if detection is uncertain
4. Sends the detected language code (ISO 639-1) to the backend

### Backend Detection (Fallback)
1. If the frontend doesn't send a language, the backend detects it using `langdetect`
2. Analyzes the user's query text
3. Falls back to English if detection fails

### AI Response
1. The AI service receives the detected language
2. Updates the system prompt to respond in that language
3. All responses (summary, steps, decision factors, recommended actions) are generated in the user's language

## Supported Languages

- **English** (en) - Default
- **Spanish** (es)
- **French** (fr)
- **German** (de)
- **Italian** (it)
- **Portuguese** (pt)
- **Russian** (ru)
- **Japanese** (ja)
- **Korean** (ko)
- **Chinese** (zh)
- **Arabic** (ar)
- **Hindi** (hi)

And more - the backend uses `langdetect` which supports 55+ languages.

## Implementation Details

### Backend Changes

1. **Added `langdetect` library** to `requirements.txt`
2. **Updated `SearchRequestPayload` model** - Added optional `language` field
3. **Language detection in `/v1/search` endpoint**:
   - Detects language if not provided by frontend
   - Logs detected language
   - Falls back to English if detection fails

4. **Updated AI Service**:
   - System prompt includes language instruction
   - User prompt includes language instruction
   - All responses generated in detected language

### Frontend Changes

1. **Created `languageDetection.ts` utility**:
   - Pattern-based detection for common languages
   - Browser language fallback
   - Language name mapping

2. **Updated `SearchInputScreen`**:
   - Detects language before submitting search
   - Sends language code to backend

3. **Updated TypeScript types**:
   - Added `language` field to `SearchRequestPayload`
   - Added `language` field to `ExecuteSearchInput`

## Testing

### Test with Different Languages

1. **Spanish:**
   ```
   "¿Cómo aprender programación en Python?"
   ```
   Expected: Response in Spanish

2. **French:**
   ```
   "Comment apprendre la programmation Python?"
   ```
   Expected: Response in French

3. **German:**
   ```
   "Wie lernt man Python-Programmierung?"
   ```
   Expected: Response in German

### Verify Language Detection

Check backend logs:
```bash
tail -f /tmp/searchbot-backend.log | grep "Detected language"
```

You should see:
```
🌐 Detected language: es
```

## How to Use

The feature works automatically! Just:
1. Type your question in any supported language
2. Submit the search
3. Receive response in your language

No configuration needed - language is detected automatically.

## Fallback Behavior

- If language detection fails → English
- If text is too short (< 3 chars) → Browser language or English
- If frontend doesn't send language → Backend detects it
- If backend detection fails → English

## Future Enhancements

- User preference to set default language
- Language indicator in UI
- Manual language selection option
- Support for more languages

