import express from "express";
import { WebSocketServer } from "ws";
import { type MatchSummaryData, type SessionData } from "./types";
import { type Response } from "express";


const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/match-summaries", (_req, res : Response<MatchSummaryData[]>) => {
  res.json([
    {
      sessionID: "abc-123",
      status: "active",
      playerCount: 1,
      averagePlayerScore: 0
    },
    {
      sessionID: "abc-124",
      status: "active",
      playerCount: 3,
      averagePlayerScore: 10
    }
  ]);
});

app.get("/sessions/:id", (_req, res : Response<SessionData>) => {
    res.json({
        sessionID: "abc-123",
        date: "2012-01-01",
        status: "active",
        videoURL: "https://www.youtube-nocookie.com/embed/vnCVVL7blZU?si=uuSLl_vcmJyqmI_j",
        players: [
            {
                name: "Alex",
                gameScore: 0,
                photoURL: "https://placehold.net/avatar-5.svg"
            },
            {
                name: "John",
                gameScore: 15,
                photoURL: "https://placehold.net/avatar-3.svg"
            }
        ]
    });
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