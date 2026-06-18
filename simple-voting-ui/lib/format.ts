export function shortenAddress(addr: string, chars = 4) {
  if (!addr) return ""
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`
}

export function formatTimeLeft(deadline: number) {
  const diff = deadline - Date.now()
  if (diff <= 0) return { ended: true, label: "Ended", parts: [0, 0, 0, 0] as const }
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { ended: false, label: "", parts: [days, hours, minutes, seconds] as const }
}

export function pct(value: number, total: number) {
  if (total <= 0) return 0
  return Math.round((value / total) * 1000) / 10
}
