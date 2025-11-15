import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { swVersionPlugin } from './vite-plugin-sw-version.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), swVersionPlugin()],
})
