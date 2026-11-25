import { type MatchSummaryData } from "@/lib/types";
import Link from "next/link";

export default async function MatchHistoryTable() {
    const req = await fetch('http://localhost:3001/match-summaries');
    const matchData : Array<MatchSummaryData> = await req.json();

    return (
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
                      { match.playerCount }
                    </td>
                    <td className="px-6 py-5">
                      { 
                        match.averagePlayerScore
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
    )
}