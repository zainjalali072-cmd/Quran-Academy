// Hostinger & Node.js Universal Production Entry Point (index.js fallback)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distServerPath = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServerPath)) {
  console.log('[Hostinger / Prod] Launching server from dist/server.cjs...');
  import('./dist/server.cjs');
} else {
  console.error('[Hostinger Error] dist/server.cjs not found! Please run "npm run build" first.');
  process.exit(1);
}
