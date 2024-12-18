import "./components/my-panel";

console.log("Custom panel loaded!");

// Render some content into the app div
document.getElementById("app")!.innerHTML = `
  <h2>My Custom Panel</h2>
  <p>TypeScript and Vite are working!</p>
`;
