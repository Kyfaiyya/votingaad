"use client"

import { useEffect, useState } from "react"
import { Vote } from "lucide-react"
import { useVoting } from "@/lib/voting-provider"
import { SiteHeader } from "@/components/site-header"
import { NetworkBanner } from "@/components/network-banner"
import { StatsBar } from "@/components/stats-bar"
import { ElectionCard } from "@/components/election-card"
import { ElectionDetail } from "@/components/election-detail"
import { CreateElectionDialog } from "@/components/create-election-dialog"

export function VotingApp() {
  const { elections, isOwner, account } = useVoting()
  const [selectedId, setSelectedId] = useState<number | null>(
    elections[0]?.id ?? null,
  )

  // Keep a valid selection as elections are created.
  useEffect(() => {
    if (selectedId === null && elections.length > 0) {
      setSelectedId(elections[0].id)
    }
  }, [elections, selectedId])

  const selected = elections.find((e) => e.id === selectedId) ?? null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <NetworkBanner />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            On-chain voting, privately cast.
          </h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Vote with a commit-reveal scheme so no one sees your choice until you
            reveal it. Results are tallied transparently on the blockchain.
          </p>
        </section>

        <div className="mb-8">
          <StatsBar />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Election list */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Elections
              </h2>
              {isOwner && <CreateElectionDialog />}
            </div>
            <div className="mt-3 space-y-3">
              {elections.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No elections yet.
                </p>
              ) : (
                elections.map((e) => (
                  <ElectionCard
                    key={e.id}
                    election={e}
                    selected={e.id === selectedId}
                    onSelect={() => setSelectedId(e.id)}
                  />
                ))
              )}
            </div>
            {!account && (
              <p className="mt-4 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
                Tip: connect your wallet to vote. The demo connects you as the
                contract owner so you can also create elections and add
                candidates.
              </p>
            )}
          </aside>

          {/* Detail */}
          <section className="lg:col-span-8 xl:col-span-9">
            {selected ? (
              <ElectionDetail election={selected} />
            ) : (
              <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <Vote className="size-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Select an election to view results and vote.
                </p>
              </div>
            )}
          </section>
        </div>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          ChainVote · SimpleVoting smart contract · commit-reveal voting · built
          for the Web3 class dApp project.
        </footer>
      </main>
    </div>
  )
}
