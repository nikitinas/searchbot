import { createServer } from 'net';

export function waitForPort(port: number, timeout: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkPort = () => {
      const server = createServer();
      
      server.once('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          // Port is in use, which means server is running
          server.close();
          resolve();
        } else {
          server.close();
          if (Date.now() - startTime > timeout) {
            reject(new Error(`Timeout waiting for port ${port}`));
          } else {
            setTimeout(checkPort, 500);
          }
        }
      });
      
      server.once('listening', () => {
        server.close();
        // Port is free, wait a bit and check again
        setTimeout(checkPort, 500);
      });
      
      server.listen(port);
    };
    
    checkPort();
    
    // Also try HTTP check for better reliability
    const httpCheck = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${port}/health`).catch(() => null);
        if (response?.ok) {
          clearInterval(httpCheck);
          resolve();
        }
      } catch {
        // Port not ready yet
      }
      
      if (Date.now() - startTime > timeout) {
        clearInterval(httpCheck);
        reject(new Error(`Timeout waiting for port ${port} to respond`));
      }
    }, 1000);
  });
}

