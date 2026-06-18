"use client"

import { BarChart3, CheckCircle2, Layers, Users } from "lucide-react"
import { useVoting } from "@/lib/voting-provider"

export function StatsBar() {
  const { elections } = useVoting()

  const totalElections = elections.length
  const activeElections = elections.filter(
    (e) => e.active && e.deadline > Date.now(),
  ).length
  const totalVotes = elections.reduce((sum, e) => sum + e.totalVotes, 0)
  const totalCandidates = elections.reduce(
    (sum, e) => sum + e.candidates.length,
    0,
  )

  const stats = [
    { label: "Elections", value: totalElections, icon: Layers },
    { label: "Active now", value: activeElections, icon: CheckCircle2 },
    { label: "Votes cast", value: totalVotes.toLocaleString(), icon: BarChart3 },
    { label: "Candidates", value: totalCandidates, icon: Users },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <s.icon className="size-4" />
            <span className="text-xs font-medium">{s.label}</span>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-foreground">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}
