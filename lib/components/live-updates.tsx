"use client";

import { useEffect, useState } from "react";
import { SessionData } from "@/lib/types";
import Image from 'next/image';

// This component exists to emulate the functionality of real-time updates,
// as per the specification. As it is only intended to mock up behaviour, there
// are several things that are missing which would need to be considered at a larger
// scale. For example: reconnection, incremental back-offs, data validation/sanitisation .etc

// The session object is sent up the pipe to be manipulated and sent back to give the appearance
// of the values being updated during a running game.
export default function LiveUpdates({session}: {session: SessionData}) {
    const [matchData, setMatchData] = useState<SessionData>(session);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3001/live-session');

        socket.onopen = () => {
            setConnected(true);

            socket.send(JSON.stringify(matchData));
        };

        socket.onmessage = (event) => {
            if (typeof event.data !== "string") return;

            try {
                const updatedSession = JSON.parse(event.data) as SessionData;
                setMatchData(updatedSession);
            } catch (error) {
                console.error("Invalid WebSocket message:", error);
            }
        };

        socket.onerror = (event) => {
            console.error("WebSocket error:", event);
        };

        socket.onclose = () => {
            setConnected(false);
        };

        return () => {
            socket.onopen = null;
            socket.onmessage = null;
            socket.onerror = null;
            socket.onclose = null;
            socket.close();
        };
    }, [session]);

    return (
        <div>
            <div className="gap-6 text-center sm:items-start sm:text-left mb-5">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    { matchData.sessionID }
                    <small className={ `${matchData.status === 'active' ? 'bg-green-300' : 'bg-gray-300' } text- mx-2 py-1 px-2 rounded-full` }>
                        { matchData.status }
                    </small>
                </h1>

                <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                    View / edit game session data.
                </p>
            </div>

            <div className="w-full overflow-x-auto bg-white dark:bg-neutral-700 mb-7">
                <h2>Players</h2>
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                            <th scope="col" className="px-6 py-5">
                                Photo
                            </th>
                            <th scope="col" className="px-6 py-5">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-5">
                                Score
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            matchData.players.map((player, index) => (
                                <tr key={ player.name + index } className={ `border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 ${index % 2 !== 0 ? "bg-neutral-50 dark:bg-neutral-800" : "" }` }>
                                    <td className="px-6 py-2">
                                        <Image src={`/${player.photoURL}`} width="50" height="50" alt={player.name}></Image>
                                    </td>
                                    <td className="px-6 py-5">
                                        { player.name }
                                    </td>
                                    <td className="px-6 py-5">
                                        { player.gameScore }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className="mb-3">
                <h2>Game video</h2>
                <iframe width="560" height="315" src={ matchData.videoURL } title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>

            <aside className={`p-3 ${connected ? 'bg-amber-200' : 'bg-red-200'}`}>
                Websocket { connected ? "Connected" : "Disconnected" }
            </aside>
        </div>
    )
}