#!/usr/bin/env node

/**
 * Start frontend server for E2E tests
 * Builds the web app and serves it on a specified port
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FRONTEND_DIR = path.join(__dirname, '../../SearchBotApp');
const PORT = process.env.PORT || 19006;

async function checkDistExists() {
  const distPath = path.join(FRONTEND_DIR, 'dist', 'index.html');
  if (!fs.existsSync(distPath)) {
    return false;
  }
  
  // Check if dist is recent (less than 5 minutes old)
  const stats = fs.statSync(distPath);
  const ageMinutes = (Date.now() - stats.mtimeMs) / (1000 * 60);
  return ageMinutes < 5;
}

async function buildWebApp() {
  console.log('📦 Building web app...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:web'], {
      cwd: FRONTEND_DIR,
      shell: true,
      stdio: 'inherit',
      env: {
        ...process.env,
        EXPO_PUBLIC_API_URL: 'http://localhost:8000/v1',
        EXPO_PUBLIC_ENABLE_LIVE_SEARCH: 'true',
      },
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build complete');
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

async function serveDist() {
  console.log(`🌐 Serving on http://localhost:${PORT}`);
  
  const distDir = path.join(FRONTEND_DIR, 'dist');
  
  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found: ${distDir}`);
  }

  // Try python3 first, then python, then npx serve
  const commands = [
    { cmd: 'python3', args: ['-m', 'http.server', PORT.toString()], cwd: distDir },
    { cmd: 'python', args: ['-m', 'http.server', PORT.toString()], cwd: distDir },
    { cmd: 'npx', args: ['--yes', 'serve', '-p', PORT.toString(), '.'], cwd: distDir },
  ];

  for (const { cmd, args, cwd } of commands) {
    try {
      const server = spawn(cmd, args, {
        cwd,
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'], // Pipe output for Playwright to detect
      });

      // Wait a moment for server to start, then return
      // Playwright will detect readiness by checking the port
      return new Promise((resolve) => {
        // Give server a moment to start
        setTimeout(() => {
          console.log(`✅ Server process started with ${cmd}`);
          resolve(server);
        }, 2000);
      });
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Command not found, try next
        continue;
      }
      throw err;
    }
  }

  throw new Error('Could not start server. Please install python3 or serve');
}

async function main() {
  try {
    // Check if dist exists and is recent
    const distExists = await checkDistExists();
    
    if (!distExists) {
      await buildWebApp();
    } else {
      console.log('✅ Using existing dist build');
    }

    // Serve the dist folder
    const server = await serveDist();
    
    // Keep process alive
    process.on('SIGINT', () => {
      if (server) server.kill();
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      if (server) server.kill();
      process.exit(0);
    });
    
    // Keep the process running
    server.on('exit', (code) => {
      console.log(`Server exited with code ${code}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

