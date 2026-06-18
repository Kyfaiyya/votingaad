"use client"

import { useState } from "react"
import { Loader2, LogOut, Wallet, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoting } from "@/lib/voting-provider"
import { shortenAddress } from "@/lib/format"

export function WalletButton() {
  const { account, isConnecting, isOwner, connect, disconnect } = useVoting()
  const [copied, setCopied] = useState(false)

  if (!account) {
    return (
      <Button onClick={connect} disabled={isConnecting} className="gap-2">
        {isConnecting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wallet className="size-4" />
        )}
        {isConnecting ? "Connecting…" : "Connect Wallet"}
      </Button>
    )
  }

  const copy = async () => {
    await navigator.clipboard.writeText(account)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-sm text-foreground">
          {shortenAddress(account)}
        </span>
        {isOwner && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Owner
          </span>
        )}
        <button
          onClick={copy}
          aria-label="Copy address"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={disconnect}
        aria-label="Disconnect wallet"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
