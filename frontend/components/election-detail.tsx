"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import type { Election } from "@/lib/voting-types"
import { useVoting } from "@/lib/voting-provider"
import { Countdown } from "@/components/countdown"
import { CandidateBar } from "@/components/candidate-bar"
import { WinnerBanner } from "@/components/winner-banner"
import { VotePanel } from "@/components/vote-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ElectionDetail({ election }: { election: Election }) {
  const { isOwner, addCandidate, getWinner } = useVoting()
  const winner = getWinner(election.id)
  const ended = election.deadline <= Date.now()
  const isLive = election.active && !ended

  const leaderId = election.candidates.reduce(
    (lead, c) => (c.voteCount > (election.candidates[lead - 1]?.voteCount ?? -1) ? c.id : lead),
    election.candidates[0]?.id ?? 0,
  )

  const [newCandidate, setNewCandidate] = useState("")
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!newCandidate.trim()) return
    setAdding(true)
    try {
      await addCandidate(election.id, newCandidate.trim())
      setNewCandidate("")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
              isLive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <span className={cn("size-1.5 rounded-full", isLive ? "bg-primary" : "bg-muted-foreground")} />
            {isLive ? "Live" : "Closed"}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Election #{election.id}
          </span>
        </div>
        <h2 className="mt-3 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {election.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Countdown deadline={election.deadline} />
          <span className="font-mono">{election.totalVotes} {election.totalVotes === 1 ? "vote" : "votes"} cast</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Results */}
        <div className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Live results
            </h3>
            <WinnerBanner winner={winner} />
            <div className="mt-5 space-y-4">
              {election.candidates.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  No candidates yet.
                  {isOwner ? " Add the first one below." : ""}
                </p>
              ) : (
                election.candidates.map((c) => (
                  <CandidateBar
                    key={c.id}
                    candidate={c}
                    totalVotes={election.totalVotes}
                    isLeader={c.id === leaderId && !winner.isTie}
                  />
                ))
              )}
            </div>

            {isOwner && isLive && (
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Owner · add candidate
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Candidate name"
                    value={newCandidate}
                    onChange={(e) => setNewCandidate(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                  <Button
                    onClick={handleAdd}
                    disabled={adding || !newCandidate.trim()}
                    className="gap-1.5"
                  >
                    {adding ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vote panel */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              Cast your vote
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Select a candidate and submit your vote directly.
            </p>
            <VotePanel election={election} />
          </div>
        </div>
      </div>
    </div>
  )
}
