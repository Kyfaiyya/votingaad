"use client"

import { ChevronRight } from "lucide-react"
import type { Election } from "@/lib/voting-types"
import { Countdown } from "@/components/countdown"
import { cn } from "@/lib/utils"

export function ElectionCard({
  election,
  selected,
  onSelect,
}: {
  election: Election
  selected: boolean
  onSelect: () => void
}) {
  const ended = election.deadline <= Date.now()
  const isLive = election.active && !ended

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full rounded-xl border bg-card p-4 text-left transition-all",
        selected
          ? "border-primary ring-1 ring-primary/40"
          : "border-border hover:border-primary/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                isLive
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isLive ? "bg-primary" : "bg-muted-foreground",
                )}
              />
              {isLive ? "Live" : "Closed"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              #{election.id}
            </span>
          </div>
          <h3 className="truncate font-medium leading-snug text-foreground">
            {election.title}
          </h3>
        </div>
        <ChevronRight
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            selected ? "translate-x-0.5 text-primary" : "group-hover:translate-x-0.5",
          )}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <Countdown deadline={election.deadline} />
        <span className="font-mono">
          {election.totalVotes} votes · {election.candidates.length} candidates
        </span>
      </div>
    </button>
  )
}
