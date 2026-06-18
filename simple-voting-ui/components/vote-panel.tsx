"use client"

import { useState } from "react"
import { Eye, Loader2, Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useVoting, mockCommitHash } from "@/lib/voting-provider"
import type { Election } from "@/lib/voting-types"
import { cn } from "@/lib/utils"

export function VotePanel({ election }: { election: Election }) {
  const { account, commitVote, revealVote } = useVoting()
  const [commitChoice, setCommitChoice] = useState<number | null>(null)
  const [commitSecret, setCommitSecret] = useState("")
  const [revealChoice, setRevealChoice] = useState<number | null>(null)
  const [revealSecret, setRevealSecret] = useState("")
  const [committing, setCommitting] = useState(false)
  const [revealing, setRevealing] = useState(false)

  const ended = election.deadline <= Date.now()
  const hasCommitted = account ? Boolean(election.commits[account]) : false
  const hasRevealed = account ? Boolean(election.revealed[account]) : false

  if (!account) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
        Connect your wallet to cast a vote in this election.
      </div>
    )
  }

  const handleCommit = async () => {
    if (commitChoice === null || !commitSecret) return
    setCommitting(true)
    try {
      await commitVote(election.id, mockCommitHash(commitChoice, commitSecret))
    } finally {
      setCommitting(false)
    }
  }

  const handleReveal = async () => {
    if (revealChoice === null || !revealSecret) return
    setRevealing(true)
    try {
      await revealVote(election.id, revealChoice, revealSecret)
    } finally {
      setRevealing(false)
    }
  }

  return (
    <Tabs defaultValue={hasCommitted ? "reveal" : "commit"} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="commit" className="gap-1.5">
          <Lock className="size-3.5" /> Commit
        </TabsTrigger>
        <TabsTrigger value="reveal" className="gap-1.5">
          <Eye className="size-3.5" /> Reveal
        </TabsTrigger>
      </TabsList>

      {/* COMMIT */}
      <TabsContent value="commit" className="mt-4 space-y-4">
        {hasCommitted ? (
          <StatusNote
            icon={ShieldCheck}
            tone="success"
            title="Vote committed"
            body="Your choice is hidden on-chain. Switch to the Reveal tab to finalize it before the deadline."
          />
        ) : (
          <>
            <CandidatePicker
              election={election}
              value={commitChoice}
              onChange={setCommitChoice}
              disabled={ended}
            />
            <div className="space-y-1.5">
              <Label htmlFor="commit-secret">Secret phrase</Label>
              <Input
                id="commit-secret"
                placeholder="e.g. my-secret-123"
                value={commitSecret}
                onChange={(e) => setCommitSecret(e.target.value)}
                disabled={ended}
              />
              <p className="text-xs text-muted-foreground">
                Remember this secret — you&apos;ll need the exact same value to
                reveal your vote.
              </p>
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleCommit}
              disabled={ended || committing || commitChoice === null || !commitSecret}
            >
              {committing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lock className="size-4" />
              )}
              {ended ? "Voting ended" : "Commit vote"}
            </Button>
          </>
        )}
      </TabsContent>

      {/* REVEAL */}
      <TabsContent value="reveal" className="mt-4 space-y-4">
        {hasRevealed ? (
          <StatusNote
            icon={ShieldCheck}
            tone="success"
            title="Vote revealed"
            body="Your vote has been counted on-chain. Thanks for participating!"
          />
        ) : !hasCommitted ? (
          <StatusNote
            icon={Lock}
            tone="muted"
            title="Nothing to reveal"
            body="You need to commit a vote first before you can reveal it."
          />
        ) : (
          <>
            <CandidatePicker
              election={election}
              value={revealChoice}
              onChange={setRevealChoice}
            />
            <div className="space-y-1.5">
              <Label htmlFor="reveal-secret">Secret phrase</Label>
              <Input
                id="reveal-secret"
                placeholder="Re-enter your secret"
                value={revealSecret}
                onChange={(e) => setRevealSecret(e.target.value)}
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleReveal}
              disabled={revealing || revealChoice === null || !revealSecret}
            >
              {revealing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Eye className="size-4" />
              )}
              Reveal vote
            </Button>
          </>
        )}
      </TabsContent>
    </Tabs>
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
