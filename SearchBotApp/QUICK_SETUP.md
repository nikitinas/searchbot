# Quick Setup for Cloud Deployment

## First Time Setup (5 minutes)

### 1. Login to Expo

```bash
cd SearchBotApp
eas login
```

If you don't have an account, sign up at [expo.dev](https://expo.dev) (it's free).

### 2. Configure EAS Project

```bash
eas build:configure
```

This will:
- Create an EAS project
- Generate credentials
- Update `app.json` with your project ID

**Important**: Commit the updated `app.json` with the project ID!

### 3. Build Your First Preview

```bash
# For Android (faster, no Apple Developer account needed)
npm run build:preview:android

# Or for iOS (requires Apple Developer account for physical devices)
npm run build:preview:ios
```

### 4. Test on Your Phone

After the build completes (takes 10-20 minutes):
1. EAS will show a QR code in the terminal
2. Scan it with your phone
3. Download and install the app

## GitHub Actions Setup (Optional)

For automatic builds on push:

1. **Get Expo Token**:
   ```bash
   eas token:create
   ```

2. **Add to GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add new secret: `EXPO_TOKEN` with the token from step 1

3. **Push to trigger build**:
   ```bash
   git push origin main
   ```

Builds will start automatically on push to `main`, `develop`, or `feature/*` branches.

## Daily Workflow

### Quick Testing (Local)
```bash
npm start
# Scan QR with Expo Go app
```

### Preview Build (Share with Testers)
```bash
npm run build:preview:android
# Share QR code or download link
```

### Push Updates (No Rebuild Needed)
```bash
# Make code changes
git commit -am "New feature"

# Push OTA update
npm run update
# Users get update automatically!
```

## Troubleshooting

**"Project not found"**: Run `eas build:configure` again

**"Credentials missing"**: Run `eas build:configure` to regenerate

**Build fails**: Check logs with `eas build:list` and view specific build

**Can't install on phone**: 
- Android: Enable "Install from unknown sources"
- iOS: Use development build, not Expo Go

## Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed docs
- Expo Discord: https://chat.expo.dev
- EAS Docs: https://docs.expo.dev/build/introduction/

