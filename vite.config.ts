import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Auf GitHub Pages liegt die Seite unter /<repo-name>/ – der Workflow setzt BASE_PATH.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'TagesQuiz',
        short_name: 'TagesQuiz',
        description: 'Tägliche Mini-Spiele zu News, Geschichte und Wissen.',
        lang: 'de',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#16122b',
        theme_color: '#16122b',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,woff2,png,svg}'],
        // Flaggen und Umrisse (ca. 400 Dateien) werden erst bei Bedarf geladen und dann offline gespeichert.
        globIgnores: ['flags/**', 'outlines/**'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /\/(flags|outlines)\/[a-z]{2}\.svg$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'bilder', expiration: { maxEntries: 500 } }
          }
        ]
      }
    })
  ]
});
