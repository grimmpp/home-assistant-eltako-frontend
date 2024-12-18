import { defineConfig } from 'vite';

export default defineConfig({
  // root: './src',
  // root: "./dist",
  root: "./",
  build: {
    outDir: './static',
    rollupOptions: {
      input: "index.html", // Entry point
    },
  },
  // publicDir: 'public', // Folder for static files
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173       // Default Vite port
  },
  resolve: {
    alias: {
      "@": "/src", // Alias to simplify imports
    },
  },
});
