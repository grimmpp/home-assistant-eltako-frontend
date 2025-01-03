import express from "express";
import path from "path";

const app = express();
const PORT = 5173;

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, "../static")));

// API route
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from the server!" });
});

// app.use(createProxyMiddleware({
//   target: 'ws://homeassistant.local:8123/api/websocket', // The backend API you want to forward requests to
//   changeOrigin: true, // Modify the 'Origin' header to match the target
//   ws: true
// }));

// // Serve the frontend for all other routes
// app.get("*", (_req, res) => {
//     res.sendFile(path.join(__dirname, "../static/index.html"));
//   });




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
