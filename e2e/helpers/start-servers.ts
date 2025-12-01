import { spawn, ChildProcess } from 'child_process';
import { waitForPort } from './wait-for-port';

let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

export async function startBackend(): Promise<void> {
  console.log('Starting backend server...');
  
  backendProcess = spawn('uvicorn', ['main:app', '--port', '8000'], {
    cwd: '../backend',
    shell: true,
    env: {
      ...process.env,
      CORS_ORIGINS: 'http://localhost:8081,http://localhost:19006',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'test-key',
    },
  });

  backendProcess.stdout?.on('data', (data) => {
    console.log(`[Backend] ${data}`);
  });

  backendProcess.stderr?.on('data', (data) => {
    console.error(`[Backend Error] ${data}`);
  });

  // Wait for backend to be ready
  await waitForPort(8000, 60000);
  console.log('✅ Backend server ready');
}

export async function startFrontend(): Promise<void> {
  console.log('Starting frontend server...');
  
  frontendProcess = spawn('npx', ['expo', 'start', '--web', '--port', '19006'], {
    cwd: '../SearchBotApp',
    shell: true,
    env: {
      ...process.env,
      EXPO_PUBLIC_API_URL: 'http://localhost:8000/v1',
      EXPO_PUBLIC_ENABLE_LIVE_SEARCH: 'true',
    },
  });

  frontendProcess.stdout?.on('data', (data) => {
    const output = data.toString();
    // Only log important messages
    if (output.includes('Web is waiting') || output.includes('error')) {
      console.log(`[Frontend] ${output}`);
    }
  });

  frontendProcess.stderr?.on('data', (data) => {
    console.error(`[Frontend Error] ${data}`);
  });

  // Wait for frontend to be ready
  await waitForPort(19006, 120000);
  console.log('✅ Frontend server ready');
}

export function stopServers(): void {
  console.log('Stopping servers...');
  
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  
  if (frontendProcess) {
    frontendProcess.kill();
    frontendProcess = null;
  }
}

process.on('exit', stopServers);
process.on('SIGINT', () => {
  stopServers();
  process.exit();
});

