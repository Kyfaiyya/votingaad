"use client"

import { Crown } from "lucide-react"
import type { Candidate } from "@/lib/voting-types"
import { pct } from "@/lib/format"
import { cn } from "@/lib/utils"

export function CandidateBar({
  candidate,
  totalVotes,
  isLeader,
}: {
  candidate: Candidate
  totalVotes: number
  isLeader: boolean
}) {
  const percentage = pct(candidate.voteCount, totalVotes)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          {isLeader && candidate.voteCount > 0 && (
            <Crown className="size-3.5 text-warning" />
          )}
          {candidate.name}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {candidate.voteCount} · {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isLeader && candidate.voteCount > 0 ? "bg-primary" : "bg-primary/45",
          )}
          style={{ width: `${Math.max(percentage, candidate.voteCount > 0 ? 4 : 0)}%` }}
        />
      </div>
    </div>
  )
}
