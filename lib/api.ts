import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`WebSocket listening on ws://localhost:${port}`);
});

const wss = new WebSocketServer({
  server,
  path: "/",
  maxPayload: 1024 * 1024,
});

wss.on("connection", (socket) => {
  socket.on("error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  socket.on("message", (data, isBinary) => {
    socket.send(data, { binary: isBinary });
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});