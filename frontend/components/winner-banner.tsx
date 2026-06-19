"use client"

import { Trophy, Scale } from "lucide-react"
import type { Winner } from "@/lib/voting-types"

export function WinnerBanner({ winner }: { winner: Winner }) {
  if (winner.highestVote === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
        No votes cast yet — be the first to vote.
      </div>
    )
  }

  if (winner.isTie) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
        <Scale className="size-5 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-semibold text-warning">It&apos;s a tie</p>
          <p className="text-xs text-muted-foreground">
            Top candidates are tied at {winner.highestVote} votes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
      <Trophy className="size-5 shrink-0 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wide text-primary/80">
          Leading candidate
        </p>
        <p className="text-sm font-semibold text-foreground">
          {winner.winnerName}{" "}
          <span className="font-mono text-muted-foreground">
            · {winner.highestVote} votes
          </span>
        </p>
      </div>
    </div>
  )
}
