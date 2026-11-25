import { type sessionID, type SessionData } from "@/lib/types";
import Image from 'next/image';

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
                                        <Image src={player.photoURL} width="50" height="50" alt={player.name}></Image>
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

            <div>
                <h2>Game video</h2>
                <iframe width="560" height="315" src={ matchData.videoURL } title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
        </div>
    );
}