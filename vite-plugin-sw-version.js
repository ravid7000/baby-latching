import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Vite plugin to automatically update service worker version on build
 * Replaces the version in CACHE_NAME with a timestamp-based version in the dist folder
 */
export function swVersionPlugin() {
  return {
    name: 'sw-version',
    writeBundle() {
      // Generate a unique version based on timestamp
      const version = `v${Date.now()}`;
      
      // Read the service worker file from dist (after build)
      // eslint-disable-next-line no-undef
      const swPath = join(process.cwd(), 'dist', 'sw.js');
      try {
        let swContent = readFileSync(swPath, 'utf-8');
        
        // Replace the version in CACHE_NAME
        // Matches: const CACHE_NAME = 'baby-latching-v1'; or similar
        swContent = swContent.replace(
          /const CACHE_NAME = ['"]baby-latching-v[\w-]+['"];/,
          `const CACHE_NAME = 'baby-latching-${version}';`
        );
        
        // Write the updated content back to dist
        writeFileSync(swPath, swContent, 'utf-8');
      } catch {
        // Service worker file might not exist, which is fine - skip silently
      }
    },
  };
}

