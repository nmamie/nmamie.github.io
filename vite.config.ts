import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import CONFIG from './gitprofile.config';
import { createHtmlPlugin } from 'vite-plugin-html';
import { seoPlugin } from './seo';

// https://vitejs.dev/config/
export default defineConfig({
  base: CONFIG.base || '/',
  plugins: [
    react(),
    seoPlugin(),
    createHtmlPlugin({
      inject: {
        data: {
          metaTitle: CONFIG.seo.title,
          metaDescription: CONFIG.seo.description,
          metaImageURL: CONFIG.seo.imageURL,
          googleAnalyticsScript: CONFIG.googleAnalytics.id
            ? `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAnalytics.id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${CONFIG.googleAnalytics.id}');
</script>`
            : '',
        },
      },
    }),
    ...(CONFIG.enablePWA
      ? [
          VitePWA({
            registerType: 'autoUpdate',
            workbox: {
              navigateFallback: undefined,
            },
            includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
            manifest: {
              name: 'Noah Mamié',
              short_name: 'Noah Mamié',
              description: 'Generative AI for personalized news recommendation, University of Zurich',
              theme_color: '#ffffff',
              background_color: '#ffffff',
              icons: [
                { src: 'logo192.png', sizes: '192x192', type: 'image/png' },
                { src: 'logo512.png', sizes: '512x512', type: 'image/png' },
                { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
              ],
            },
          }),
        ]
      : []),
  ],
  define: {
    CONFIG: CONFIG,
  },
});
