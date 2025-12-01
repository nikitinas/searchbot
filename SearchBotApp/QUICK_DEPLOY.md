# Quick Deploy to Vercel

## One-Command Deploy

```bash
cd SearchBotApp
vercel --prod
```

## First Time Setup

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Set Environment Variable**:
   ```bash
   # In Vercel dashboard: Project Settings → Environment Variables
   # Add: EXPO_PUBLIC_API_URL = https://your-backend-url.com
   ```

4. **Deploy**:
   ```bash
   cd SearchBotApp
   vercel
   ```

## Verify Deployment

After deployment, Vercel will provide a URL like:
- `https://your-project.vercel.app`

Open it in your browser to test!

## What Gets Deployed

- ✅ React Native Web build (static files)
- ✅ All your React components
- ✅ Redux store and state management
- ✅ Navigation (React Navigation)
- ✅ API client configured with your backend URL

## Troubleshooting

**Build fails?**
- Make sure you're in the `SearchBotApp` directory
- Check that `node_modules` are installed: `npm install`
- Verify Expo is installed: `npx expo --version`

**API calls fail?**
- Check `EXPO_PUBLIC_API_URL` is set in Vercel environment variables
- Verify your backend CORS settings allow your Vercel domain

**Voice/Image features don't work?**
- These are mobile-specific and may need web alternatives
- Voice input is already disabled on web (by design)
- Image picker should work but may need testing

