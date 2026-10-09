import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-512.jpg', 'vite.svg'],
      manifest: {
        name: 'HealthSaathi — Mindful Living',
        short_name: 'HealthSaathi',
        description: 'Your personal mind & soul sanctuary. Track moods, meditate, and grow mindfully.',
        theme_color: '#080c14',
        background_color: '#080c14',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['health', 'lifestyle', 'meditation'],
        icons: [
          { src: '/icon-512.jpg', sizes: '192x192', type: 'image/jpeg', purpose: 'any maskable' },
          { src: '/icon-512.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any maskable' },
        ],
        shortcuts: [
          { name: 'Log Mood',     short_name: 'Mood',      url: '/moodtracker',  description: 'Log how you feel right now' },
          { name: 'Meditation',   short_name: 'Meditate',  url: '/meditation',   description: 'Start a breathing session' },
          { name: 'Relax Sounds', short_name: 'Sounds',    url: '/relaxsounds',  description: 'Play calming sounds' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
})
