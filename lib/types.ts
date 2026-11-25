export type sessionID = string;
type sessionStatus = "active" | "completed";

interface PlayerData {
  name: string;
  photoURL: string;
}

interface PlayerGameData extends PlayerData {
  gameScore: number;
}

export interface SessionData {
  sessionID: sessionID;
  date: string;
  players: Array<PlayerGameData>;
  status: sessionStatus;
  videoURL?: string;
}

export interface MatchSummaryData {
  sessionID: sessionID;
  playerCount: number;
  averagePlayerScore: number;
  status: sessionStatus;
}