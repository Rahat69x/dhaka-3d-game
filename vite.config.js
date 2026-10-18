import { defineConfig } from 'vite';

export default defineConfig({
  base: '/dhaka-3d-game/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        fallback: '404.html'
      }
    }
  }
});
