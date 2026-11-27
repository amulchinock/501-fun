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
                photoURL: "profile.png"
            },
            {
                name: "John",
                gameScore: 15,
                photoURL: "profile.png"
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
  path: "/live-session",
  maxPayload: 1024 * 1024,
});

wss.on("connection", (socket) => {
  socket.on("error", (error) => {
    console.error("WebSocket connection error:", error);
  });

  // In a real world scenario, we'd be handling multiple clients and need logic to
  // ensure that messages are sent/acted on if they directly apply to the client in question.
  // I haven't done this here, as it's purely for illustrative purposes.
  socket.on("message", (data, isBinary) => {
    if (isBinary) {
        return;
    }
    
    const matchData : SessionData = JSON.parse(data.toString());

    // Simulates gameplay, including adding new players
    // The obviously wouldn't be the place to do this if this were "real",
    // but because the frontend is only ever sending _one_ message to this endpoint,
    // it isn't an issue here.
    setInterval(() => {
        const names = ['Sarah', 'Leisse', 'Dom', 'Alfie', 'Dan', 'Richard', 'Lauren', 'Joe'];
        let count = 0;

        matchData.players[Math.floor(Math.random() * matchData.players.length)].gameScore++;


        // A 4% chance that a new player will join during the game, just for fun...
        // 0, 28, 56, 84
        // But, will stop adding players when the list of "spare" names is exhausted
        if ((Math.floor(Math.random() * 100) % 28 === 0) && count < names.length) {
            matchData.players.push({
                gameScore: 0,
                photoURL: 'profile.png',
                name: (() => {
                    while (true) {
                        const id = Math.floor(Math.random() * names.length);

                        if (!matchData.players.some((player) => player.name === names[id])) {
                            count++;
                            return names[id];
                        }
                    }
                })()
            });
        }

        socket.send(JSON.stringify(matchData));
    }, 2000);
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});