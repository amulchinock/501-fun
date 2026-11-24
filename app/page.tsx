import Link from "next/link";
import { type SessionData } from "./types";

export default async function Home() {
  const matchData : Array<SessionData> = [
    {
      sessionID: "abc-123",
      date: "2012-01-01",
      status: "active",
      players: [
        {
          name: "Alex",
          gameScore: 0
        }
      ]
    },
    {
      sessionID: "abc-124",
      date: "2012-01-02",
      status: "active",
      players: [
        {
          name: "Aidan",
          gameScore: 10
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="gap-6 text-center sm:items-start sm:text-left mb-5">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Match History
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Click on each match to view game session data.
          </p>
        </div>
        
        <div className="w-full overflow-x-auto bg-white dark:bg-neutral-700">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Session ID
                </th>
                <th scope="col" className="px-6 py-5">
                  Total Players
                </th>
                <th scope="col" className="px-6 py-5">
                  Average Score
                </th>
                <th scope="col" className="px-6 py-5">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {
                matchData.map((match, index) => (
                  <tr key={ match.sessionID } className={ `relative cursor-pointer border-b dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 ${index % 2 !== 0 ? "bg-neutral-50 dark:bg-neutral-800" : "" }` }>
                    <th scope="row" className="px-6 py-5">
                      <Link className="after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-blue-600"
                        href={{
                          pathname: `/sessions/${ match.sessionID }`
                      }}>
                        { match.sessionID }
                      </Link>
                    </th>
                    <td className="px-6 py-5">
                      { match.players.length }
                    </td>
                    <td className="px-6 py-5">
                      { 
                        match.players.length ? 
                          match.players.reduce((total, player) => (
                            total + player.gameScore
                          ), 0) / match.players.length
                        : 0
                      }
                    </td>
                    <td className="px-6 py-5">
                      { match.status }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
