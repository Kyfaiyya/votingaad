import { VotingProvider } from "@/lib/voting-provider"
import { VotingApp } from "@/components/voting-app"

export default function Page() {
  return (
    <VotingProvider>
      <VotingApp />
    </VotingProvider>
  )
}
