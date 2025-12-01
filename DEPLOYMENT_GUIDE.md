# SearchBot App - Cloud Deployment Guide

This guide explains how to deploy your SearchBot app to the cloud and test it on your phone using Expo Application Services (EAS).

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev) (free)
2. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)
3. **EAS CLI**: Already installed globally

## Initial Setup

### 1. Login to EAS

```bash
cd SearchBotApp
eas login
```

### 2. Configure Your Project

```bash
eas build:configure
```

This will:
- Create an EAS project (if not exists)
- Update `app.json` with your project ID
- Set up build credentials

### 3. Update Project ID

After running `eas build:configure`, your `app.json` will be updated with a project ID. Make sure to commit this change.

## Building Preview Builds

### Build for Testing (Uses Mock Data)

```bash
# Build for both iOS and Android
npm run build:preview

# Or build for specific platform
npm run build:preview:ios
npm run build:preview:android
```

This creates a preview build that:
- Can be installed on physical devices
- Uses mock data (no backend required)
- Can be shared via QR code or download link

### Build for Production Testing (Uses Live Backend)

```bash
# First, set your backend URL in eas.json or via environment variables
eas build --profile preview-production --platform all
```

## Testing on Your Phone

### Option 1: Download via QR Code (Recommended)

1. After the build completes, EAS will provide a QR code
2. Scan the QR code with your phone's camera (iOS) or a QR scanner app
3. Download and install the app

### Option 2: Download via Link

1. EAS provides a download link after build completes
2. Open the link on your phone
3. Download and install the app

### Option 3: Expo Go (Development Only)

For quick testing during development:

```bash
npm start
# Scan QR code with Expo Go app
```

**Note**: Expo Go has limitations and may not support all native modules.

## Branch-Based Deployment

### Setup GitHub Actions (Optional)

Create `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build
on:
  push:
    branches: [main, develop, preview]
  pull_request:
    branches: [main]

jobs:
  build:
    name: Build and Preview
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18.x
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: cd SearchBotApp && npm ci
      - run: eas build --profile preview --platform android --non-interactive
      - run: eas build --profile preview --platform ios --non-interactive
```

### Manual Branch-Based Builds

```bash
# Switch to your feature branch
git checkout feature/my-feature

# Build from this branch
eas build --profile preview --platform all --non-interactive
```

## Over-the-Air (OTA) Updates

After building once, you can push updates without rebuilding:

```bash
# Make your code changes
git commit -am "Update feature"

# Push OTA update
npm run update
# or
eas update --branch preview
```

Users with the app installed will receive the update automatically.

## Environment Variables

### For Preview Builds

Set in `eas.json` (already configured) or via EAS secrets:

```bash
# Set secrets for preview builds
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-api.com/v1
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_LIVE_SEARCH --value true
```

### For Different Build Profiles

Update `eas.json` to include environment variables per profile:

```json
{
  "build": {
    "preview-production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.searchbot.com/v1",
        "EXPO_PUBLIC_ENABLE_LIVE_SEARCH": "true"
      }
    }
  }
}
```

## Workflow Examples

### Daily Development Workflow

1. **Local Development**:
   ```bash
   npm start
   # Test in Expo Go or simulator
   ```

2. **Preview Build for Testing**:
   ```bash
   git checkout feature-branch
   npm run build:preview:android
   # Share QR code with testers
   ```

3. **Push Updates** (after initial build):
   ```bash
   npm run update
   # Users get update automatically
   ```

### Release Workflow

1. **Test on Preview Build**:
   ```bash
   npm run build:preview
   # Test on physical devices
   ```

2. **Production Build**:
   ```bash
   npm run build:production
   ```

3. **Submit to Stores** (when ready):
   ```bash
   npm run submit:ios
   npm run submit:android
   ```

## Troubleshooting

### Build Fails

1. Check build logs: `eas build:list`
2. View specific build: `eas build:view [BUILD_ID]`
3. Common issues:
   - Missing credentials: Run `eas build:configure` again
   - Environment variables: Check `eas.json` and secrets
   - Dependencies: Ensure all packages are in `package.json`

### App Won't Install on Phone

- **iOS**: Make sure you're using a development build, not Expo Go
- **Android**: Enable "Install from unknown sources" in settings
- Check device compatibility in `app.json`

### Updates Not Working

- Ensure users have the latest build installed
- Check branch name matches: `eas update --branch preview`
- Verify update was published: `eas update:list`

## Cost

- **Free Tier**: 
  - Unlimited preview builds
  - 30 builds/month for production
  - Unlimited OTA updates
- **Paid Plans**: Start at $29/month for more builds and features

## Next Steps

1. Run `eas login` and `eas build:configure`
2. Build your first preview: `npm run build:preview:android`
3. Test on your phone via QR code
4. Set up GitHub Actions for automatic builds (optional)

## Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Update Docs](https://docs.expo.dev/eas-update/introduction/)
- [Expo Discord](https://chat.expo.dev/) for support

