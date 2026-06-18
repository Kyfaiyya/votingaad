"use client"

import { Vote } from "lucide-react"
import { useVoting } from "@/lib/voting-provider"
import { EXPECTED_NETWORK_NAME } from "@/lib/voting-types"
import { WalletButton } from "@/components/wallet-button"

export function SiteHeader() {
  const { account, isCorrectNetwork } = useVoting()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Vote className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight text-foreground">ChainVote</p>
            <p className="text-xs text-muted-foreground">Decentralized Voting</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {account && (
            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 md:flex">
              <span
                className={`size-2 rounded-full ${
                  isCorrectNetwork ? "bg-primary" : "bg-warning"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {isCorrectNetwork ? EXPECTED_NETWORK_NAME : "Wrong network"}
              </span>
            </div>
          )}
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
