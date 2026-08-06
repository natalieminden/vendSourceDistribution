import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    /*
     * Served from the domain root by default, which is what Firebase Hosting wants.
     *
     * GitHub Pages is the exception: a project site lives under
     * /<repo>/, so every asset URL has to carry that prefix. The Pages workflow
     * sets BUILD_BASE=/vendSourceDistribution/ for its build only — do not
     * hardcode it here, or the Firebase build ships broken asset paths.
     */
    base: process.env.BUILD_BASE || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Honour an injected PORT so tooling can place the dev server.
      port: Number(process.env.PORT) || 5173,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
