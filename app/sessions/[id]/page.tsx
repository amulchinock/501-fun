import LiveUpdates from "@/lib/components/live-updates";
import { type sessionID, type SessionData } from "@/lib/types";

async function getSessionData(sessionId: sessionID) {
    'use cache';
    const req = await fetch(`http://localhost:3001/sessions/${sessionId}`);

    if (!req.ok) {
        throw new Error('Failed to load session data');
    }

    return await req.json();
}

export default async function GameSessions({
  params,
}: {
  params: Promise<{ id: sessionID }>;
}) {
    const { id } = await params;
    const matchData : SessionData = await getSessionData(id);

    return (
        <div>
            <LiveUpdates key={id} session={matchData}></LiveUpdates>
        </div>
    );
}