import MatchHistoryTable from "@/lib/components/match-history-table";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div>
      <div className="gap-6 text-center sm:items-start sm:text-left mb-5">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Match History
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Click on each match to view game session data.
        </p>
      </div>
      
      <Suspense>
        <MatchHistoryTable></MatchHistoryTable>
      </Suspense>
    </div>
  );
}
