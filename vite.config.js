import { resolve, path } from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env,
      'process.env.HA_URL': JSON.stringify('http://192.168.178.91:8123'),
      'process.env.HA_LONG_LIVED_TOKEN': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MjM3ZTZlYzY3MmY0MGU1YjFmMzk5ZGU2Y2E5NWI4MyIsImlhdCI6MTczNDk5MTk3OCwiZXhwIjoyMDUwMzUxOTc4fQ.JxkZf9yFmODwZgpQNIHF7II48fmtQ1GayVbNLOzukWk'),
      __STATIC_PATH__: JSON.stringify('/static/'),
    },
  // root: './src',
  // root: "./dist",
    root: "./src",
    build: {
      outDir: '../static',
      emptyOutDir: true,
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
        "@ha": "../homeassistant-frontend/src", // Alias to simplify imports
      },
    },
    publicDir: 'static'
  }
})
