export interface PlayerData {
  name: string;
  photoURL: string;
}

export interface PlayerGameData extends PlayerData {
  gameScore: number;
}

export interface SessionData {
  sessionID: string;
  date: string;
  players: Array<PlayerGameData>;
  status: "active" | "completed";
  videoURL?: string;
}