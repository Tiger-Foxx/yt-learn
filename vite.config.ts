import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'
// import basicSsl from '@vitejs/plugin-basic-ssl';
// import { readFileSync } from 'fs'
// import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.jpg', 'offline.html', 'robots.txt'],
      manifest: {
        name: 'Mood Music',
        short_name: 'MoodMusic',
        description: 'Découvrez la musique qui correspond à votre humeur',
        theme_color: '#302b63',
        background_color: '#0f0c29',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },

        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.spotify\.com\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'spotify-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 heure
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-libraries',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
              },
            },
          },
        ],
      },
    }),
    tailwindcss(),
    // basicSsl(),
  ],

  build: {
    // Ignorer les avertissements comme variables non utilisées
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer certains types d'avertissements
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        // Transmettre les autres avertissements au gestionnaire par défaut
        warn(warning);
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    // Changez ces paramètres
    host: true, // au lieu de true
    port: 8000,
    hmr: {
      protocol: 'ws',
      host: 'localhost',

    },
    // strictPort: true, // Assure que le port 3000 est utilisé
    // https: {
    //   key: readFileSync(resolve(__dirname, 'localhost+2-key.pem')),
    //   cert: readFileSync(resolve(__dirname, 'localhost+2.pem')),
    // },

  },
  preview: {
    port: 8000,
  },
});