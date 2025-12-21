import { resolve } from 'node:path'
import { constants } from 'node:zlib'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import viteAudioTransform from 'vite-audio-transform'
import { compression, defineAlgorithm } from 'vite-plugin-compression2'
import htmlMinifier from 'vite-plugin-html-minifier'

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms: [
        defineAlgorithm('gzip', { level: 9 }),
        defineAlgorithm('brotliCompress', {
          params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
        }),
      ],
      deleteOriginalAssets: false, // keep originals for fallback
    }),
    tailwindcss(),
    AutoImport({
      imports: ['react', 'react-dom'],
      dts: 'src/auto-imports.d.ts',
    }),
    htmlMinifier({
      minify: true,
    }),
    viteAudioTransform({
      type: 'ogg',
      quality: 6,
    }),
  ],
  build: { sourcemap: 'hidden' },
  server: { port: 3000 },
  base: '/npc-ai/',
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },
})
