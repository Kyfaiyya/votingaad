"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { formatTimeLeft } from "@/lib/format"

const UNITS = ["d", "h", "m", "s"] as const

export function Countdown({ deadline }: { deadline: number }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const { ended, parts } = formatTimeLeft(deadline)

  if (ended) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Clock className="size-3.5" />
        Voting ended
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <Clock className="size-3.5 text-primary" />
      <div className="flex items-center gap-1 font-mono text-sm tabular-nums text-foreground">
        {parts.map((value, i) => (
          <span key={UNITS[i]} className="flex items-baseline">
            <span className="font-semibold">{String(value).padStart(2, "0")}</span>
            <span className="ml-0.5 text-[10px] text-muted-foreground">
              {UNITS[i]}
            </span>
            {i < parts.length - 1 && (
              <span className="mx-1 text-muted-foreground">:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
