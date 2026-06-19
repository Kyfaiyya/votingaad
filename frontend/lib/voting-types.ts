export type Candidate = {
  id: number
  name: string
  voteCount: number
}

export type VotePhase = "open" | "reveal" | "closed"

export type Election = {
  id: number
  title: string
  /** Unix epoch in milliseconds */
  deadline: number
  active: boolean
  totalVotes: number
  candidates: Candidate[]
  /** address -> hasVoted flag */
  hasVoted: Record<string, boolean>
}

export type Winner = {
  winnerName: string
  highestVote: number
  isTie: boolean
}

export type TxStatus = "idle" | "pending" | "success" | "failed"

/** Expected local Hardhat chain id (matches hardhat.config.js) */
export const EXPECTED_CHAIN_ID = 31337
export const EXPECTED_NETWORK_NAME = "Hardhat Local"
