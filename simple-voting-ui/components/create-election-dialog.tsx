"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useVoting } from "@/lib/voting-provider"

const DURATIONS = [
  { label: "15 min", value: 15 },
  { label: "1 hour", value: 60 },
  { label: "1 day", value: 1440 },
]

export function CreateElectionDialog() {
  const { createElection } = useVoting()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(60)
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    try {
      await createElection(title.trim(), duration)
      setTitle("")
      setDuration(60)
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="size-4" />
        New election
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create election</DialogTitle>
          <DialogDescription>
            Only the contract owner can create elections. Voting closes when the
            deadline passes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="election-title">Title</Label>
            <Input
              id="election-title"
              placeholder="e.g. Ketua Kelas 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Voting duration</Label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    duration === d.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full gap-2 sm:w-auto"
            onClick={handleCreate}
            disabled={submitting || !title.trim()}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Create election
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
