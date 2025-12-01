# Deploying SearchBot Web App to Vercel

This guide explains how to deploy your React Native (Expo) app as a web application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your backend API URL (if deployed separately)
3. Git repository connected to your project

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `SearchBotApp`
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add environment variables (see below)
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to SearchBotApp directory
cd SearchBotApp

# Deploy
vercel

# For production deployment
vercel --prod
```

## Environment Variables

In your Vercel project settings, add the following environment variables:

### Required

- `EXPO_PUBLIC_API_URL` - Your backend API URL **including `/v1` suffix**
  - Example: `https://your-backend.up.railway.app/v1`
  - **Important**: Must include `/v1` since your backend API uses `/v1` prefix

### Optional (Recommended)

- `EXPO_PUBLIC_ENABLE_LIVE_SEARCH` - Set to `true` to use real backend API

  - If not set or `false`, the app uses mock data instead of calling backend
  - Set to `true` for production to connect to your backend

- `EXPO_PUBLIC_ENVIRONMENT` - Set to `production` for production builds

## Backend Connection

⚠️ **Important**: Your backend must be configured to allow requests from your Vercel domain.

### Backend CORS Configuration

Update your backend's `CORS_ORIGINS` environment variable to include your Vercel domain:

```env
CORS_ORIGINS=http://localhost:8081,https://your-app.vercel.app,https://your-app-git-main.vercel.app
```

Replace `your-app` with your actual Vercel project name.

See `BACKEND_FRONTEND_CONNECTION.md` in the root directory for detailed connection setup.

## Configuration Files

The following files are already configured:

- **`vercel.json`**: Vercel deployment configuration
- **`.vercelignore`**: Files to exclude from deployment
- **`package.json`**: Contains `build:web` script for static export

## Build Process

When you deploy, Vercel will:

1. Install dependencies (`npm install`)
2. Run the build command (`npm run build:web`)
   - This uses `expo export --platform web` to generate static files
3. Serve the files from the `dist` directory
4. Apply rewrites for client-side routing (SPA support)

## Testing Locally

Before deploying, test the web build locally:

```bash
cd SearchBotApp

# Build for web
npm run build:web

# Serve the built files (requires a static server)
# Option 1: Using serve
npx serve dist

# Option 2: Using Python
cd dist
python3 -m http.server 8080

# Option 3: Using Node.js http-server
npx http-server dist -p 8080
```

Then open `http://localhost:8080` in your browser.

## Custom Domain

After deployment, you can add a custom domain:

1. Go to your Vercel project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. For other branches, it creates preview deployments.

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure `expo` CLI is available (should be installed via dependencies)
- Check build logs in Vercel dashboard

### API Calls Fail

- Verify `EXPO_PUBLIC_API_URL` is set correctly in Vercel environment variables
- Check CORS settings on your backend API
- Ensure backend allows requests from your Vercel domain

### Routing Issues

- The `vercel.json` includes rewrites for SPA routing
- If routes don't work, check that rewrites are configured correctly

### Mobile-Specific Features

Some React Native features may not work on web:

- **Voice Input**: Already handled - the `useVoiceInput` hook checks for web platform and disables voice input gracefully
- **Image Picker**: `react-native-image-picker` should work on web, but may need testing. If issues occur, consider:
  - Using a web-compatible alternative like `react-native-image-picker-web`
  - Adding platform checks: `if (Platform.OS === 'web') { /* web file input */ }`
- Platform-specific code should use `Platform.OS === 'web'` checks
- Consider using `react-native-web` compatible alternatives

### Testing Web Compatibility

Before deploying, test these features on web:

1. Image upload/picker functionality
2. Voice input (should be disabled gracefully)
3. Navigation between screens
4. API calls to backend
5. Responsive layout on different screen sizes

## Notes

- The web build uses React Native Web, which translates React Native components to web-compatible HTML/CSS
- Some mobile-specific features (like native image picker, voice input) may need web alternatives or conditional rendering
- The app will be fully responsive and work on desktop browsers
