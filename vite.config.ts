
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', emptyOutDir: true, sourcemap: false,
    lib: { entry: 'frontend/src/index.tsx', name: 'RainbowWaveGlowPlus', formats: ['es'] },
    rollupOptions: { output: { entryFileNames: 'index.js' } }
  }
})
