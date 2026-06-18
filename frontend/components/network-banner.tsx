"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoting } from "@/lib/voting-provider"
import { EXPECTED_NETWORK_NAME } from "@/lib/voting-types"

export function NetworkBanner() {
  const { account, isCorrectNetwork, switchNetwork } = useVoting()
  const [switching, setSwitching] = useState(false)

  if (!account || isCorrectNetwork) return null

  const handleSwitch = async () => {
    setSwitching(true)
    try {
      await switchNetwork()
    } finally {
      setSwitching(false)
    }
  }

  return (
    <div className="border-b border-warning/30 bg-warning/10">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 text-sm text-warning">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            You&apos;re connected to the wrong network. Switch to{" "}
            {EXPECTED_NETWORK_NAME} (chainId 31337) to interact.
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSwitch}
          disabled={switching}
          className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
        >
          {switching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Switch network"
          )}
        </Button>
      </div>
    </div>
  )
}
