import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      // Define process.env globally to prevent browser ReferenceError and inject build-time variables
      'process.env': JSON.stringify({
        NEXT_PUBLIC_API_URL: env.VITE_API_URL || env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/app/',
        NEXT_PUBLIC_ID_SYSTEM_URL: env.VITE_ID_SYSTEM_URL || env.NEXT_PUBLIC_ID_SYSTEM_URL || 'https://id.ezisolutions.tech/oauth/login',
        NEXT_PUBLIC_AUTH_REDIRECT_URI: env.VITE_AUTH_REDIRECT_URI || env.NEXT_PUBLIC_AUTH_REDIRECT_URI || 'http://localhost:3000/auth/callback',
        NEXT_PUBLIC_WS_URL: env.VITE_WS_URL || env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000/bz',
        NEXT_PUBLIC_WS_PATH: env.VITE_WS_PATH || env.NEXT_PUBLIC_WS_PATH || '/ws',
      })
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'logo.png'],
        manifest: {
          name: 'EziOps - Operations Management',
          short_name: 'EziOps',
          description: 'Ezi Company Operations Management',
          theme_color: '#4f46e5',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          icons: [
            {
              src: 'favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon'
            },
            {
              src: 'logo.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      host: true,
    }
  };
});
