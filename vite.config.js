import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
  // root: './src',
  // root: "./dist",
    root: "./src",
    build: {
      outDir: '../static',
      rollupOptions: {
        input: "./src/index.html", // Entry point
      },
    },
    // publicDir: 'public', // Folder for static files
    server: {
      proxy: {
        "/info": {
          target: "http://homeassistant.local:8123", // Backend server
          changeOrigin: true,
          secure: false,
        },
      },
      host: '0.0.0.0', // Allow external connections
      port: 5173       // Default Vite port
    },
    resolve: {
      alias: {
        "@": "/src", // Alias to simplify imports
      },
    },
    publicDir: 'static'
  }
})
