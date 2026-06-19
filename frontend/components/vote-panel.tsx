"use client"

import { useState } from "react"
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useVoting } from "@/lib/voting-provider"
import type { Election } from "@/lib/voting-types"
import { cn } from "@/lib/utils"

export function VotePanel({ election }: { election: Election }) {
  const { account, vote } = useVoting()
  const [choice, setChoice] = useState<number | null>(null)
  const [voting, setVoting] = useState(false)

  const ended = election.deadline <= Date.now()
  const hasVoted = account ? Boolean(election.hasVoted[account]) : false

  if (!account) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
        Connect your wallet to cast a vote in this election.
      </div>
    )
  }

  const handleVote = async () => {
    if (choice === null) return
    setVoting(true)
    try {
      await vote(election.id, choice)
    } finally {
      setVoting(false)
    }
  }

  if (hasVoted) {
    return (
      <div className="mt-4">
        <StatusNote
          icon={ShieldCheck}
          tone="success"
          title="Vote submitted"
          body="Your vote has been recorded on-chain and counted towards the live result."
        />
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <CandidatePicker
        election={election}
        value={choice}
        onChange={setChoice}
        disabled={ended}
      />
      <Button
        className="w-full gap-2"
        onClick={handleVote}
        disabled={ended || voting || choice === null}
      >
        {voting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CheckCircle2 className="size-4" />
        )}
        {ended ? "Voting ended" : "Submit Vote"}
      </Button>
    </div>
  )
}

function CandidatePicker({
  election,
  value,
  onChange,
  disabled,
}: {
  election: Election
  value: number | null
  onChange: (id: number) => void
  disabled?: boolean
}) {
  if (election.candidates.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
        No candidates have been added yet.
      </p>
    )
  }
  return (
    <div className="space-y-1.5">
      <Label>Select candidate</Label>
      <div className="grid gap-2">
        {election.candidates.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(c.id)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50",
              value === c.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <span className="font-medium">{c.name}</span>
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full border",
                value === c.id ? "border-primary bg-primary" : "border-muted-foreground/40",
              )}
            >
              {value === c.id && (
                <span className="size-1.5 rounded-full bg-primary-foreground" />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StatusNote({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: React.ElementType
  title: string
  body: string
  tone: "success" | "muted"
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        tone === "success"
          ? "border-primary/30 bg-primary/10"
          : "border-border bg-muted/30",
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          tone === "success" ? "text-primary" : "text-muted-foreground",
        )}
      />
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}
