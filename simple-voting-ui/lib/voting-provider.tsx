"use client"

/**
 * MOCK Web3 layer for the ChainVote dApp.
 *
 * This provider simulates the on-chain `SimpleVoting` smart contract so the
 * UI/UX is fully interactive without a wallet. It is intentionally shaped to
 * mirror the contract's functions (createElection, addCandidate, commitVote,
 * revealVote, getWinner). The teammate handling Web3 integration can replace
 * the mocked async bodies with real ethers.js calls without touching the UI.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import {
  EXPECTED_CHAIN_ID,
  type Candidate,
  type Election,
  type Winner,
} from "./voting-types"

const OWNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
const VOTER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Mock keccak-style hash. Deterministic, but NOT real keccak256. */
export function mockCommitHash(candidateId: number, secret: string) {
  let h = 0
  const input = `${candidateId}:${secret}`
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  return "0x" + (h >>> 0).toString(16).padStart(8, "0").repeat(8)
}

function now() {
  return Date.now()
}

function seedElections(): Election[] {
  return [
    {
      id: 1,
      title: "Ketua Himpunan Informatika 2026",
      deadline: now() + 1000 * 60 * 45,
      active: true,
      totalVotes: 142,
      candidates: [
        { id: 1, name: "Alice Pradana", voteCount: 64 },
        { id: 2, name: "Bob Wijaya", voteCount: 51 },
        { id: 3, name: "Citra Lestari", voteCount: 27 },
      ],
      commits: {},
      revealed: {},
    },
    {
      id: 2,
      title: "Proposal: Migrasi Treasury ke Multisig",
      deadline: now() + 1000 * 60 * 60 * 3,
      active: true,
      totalVotes: 88,
      candidates: [
        { id: 1, name: "Setuju", voteCount: 59 },
        { id: 2, name: "Tolak", voteCount: 29 },
      ],
      commits: {},
      revealed: {},
    },
    {
      id: 3,
      title: "Best Demo — Web3 Class Project",
      deadline: now() - 1000 * 60 * 30,
      active: false,
      totalVotes: 73,
      candidates: [
        { id: 1, name: "Team ChainVote", voteCount: 31 },
        { id: 2, name: "Team BlockTodo", voteCount: 31 },
        { id: 3, name: "Team Escrowly", voteCount: 11 },
      ],
      commits: {},
      revealed: {},
    },
  ]
}

function computeWinner(e: Election): Winner {
  let highestVote = 0
  let winnerId = 0
  let isTie = false
  for (const c of e.candidates) {
    if (c.voteCount > highestVote) {
      highestVote = c.voteCount
      winnerId = c.id
      isTie = false
    } else if (c.voteCount === highestVote && highestVote > 0) {
      isTie = true
    }
  }
  return {
    winnerName: winnerId !== 0 ? e.candidates[winnerId - 1].name : "No votes yet",
    highestVote,
    isTie,
  }
}

type VotingContextValue = {
  account: string | null
  chainId: number | null
  isOwner: boolean
  isConnecting: boolean
  isCorrectNetwork: boolean
  elections: Election[]
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => void
  createElection: (title: string, durationMinutes: number) => Promise<void>
  addCandidate: (electionId: number, name: string) => Promise<void>
  commitVote: (electionId: number, hash: string) => Promise<void>
  revealVote: (
    electionId: number,
    candidateId: number,
    secret: string,
  ) => Promise<void>
  getWinner: (electionId: number) => Winner
}

const VotingContext = createContext<VotingContextValue | null>(null)

export function VotingProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [elections, setElections] = useState<Election[]>(seedElections)

  const isOwner = account?.toLowerCase() === OWNER_ADDRESS.toLowerCase()
  const isCorrectNetwork = chainId === EXPECTED_CHAIN_ID

  const requireAccount = useCallback(() => {
    if (!account) {
      toast.error("Wallet not connected", {
        description: "Connect MetaMask before performing this action.",
      })
      return false
    }
    return true
  }, [account])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    try {
      // Simulate window.ethereum.request({ method: "eth_requestAccounts" })
      await delay(900)
      setAccount(OWNER_ADDRESS)
      setChainId(EXPECTED_CHAIN_ID)
      toast.success("Wallet connected", {
        description: "Connected as contract owner account.",
      })
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    toast("Wallet disconnected")
  }, [])

  const switchNetwork = useCallback(() => {
    setChainId(EXPECTED_CHAIN_ID)
    toast.success("Network switched", {
      description: "Now on Hardhat Local (chainId 31337).",
    })
  }, [])

  const createElection = useCallback(
    async (title: string, durationMinutes: number) => {
      if (!requireAccount()) return
      const tx = toast.loading("Creating election…", {
        description: "Waiting for transaction confirmation.",
      })
      await delay(1400)
      setElections((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title,
          deadline: now() + durationMinutes * 60 * 1000,
          active: true,
          totalVotes: 0,
          candidates: [],
          commits: {},
          revealed: {},
        },
      ])
      toast.success("Election created", { id: tx, description: title })
    },
    [requireAccount],
  )

  const addCandidate = useCallback(
    async (electionId: number, name: string) => {
      if (!requireAccount()) return
      const tx = toast.loading("Adding candidate…")
      await delay(1200)
      setElections((prev) =>
        prev.map((e) => {
          if (e.id !== electionId) return e
          const newCandidate: Candidate = {
            id: e.candidates.length + 1,
            name,
            voteCount: 0,
          }
          return { ...e, candidates: [...e.candidates, newCandidate] }
        }),
      )
      toast.success("Candidate added", { id: tx, description: name })
    },
    [requireAccount],
  )

  const commitVote = useCallback(
    async (electionId: number, hash: string) => {
      if (!requireAccount() || !account) return
      const election = elections.find((e) => e.id === electionId)
      if (election && election.commits[account]) {
        toast.error("Already committed", {
          description: "This address has already committed a vote.",
        })
        return
      }
      const tx = toast.loading("Committing vote…", {
        description: "Your choice stays hidden until you reveal.",
      })
      await delay(1500)
      setElections((prev) =>
        prev.map((e) =>
          e.id === electionId
            ? { ...e, commits: { ...e.commits, [account]: hash } }
            : e,
        ),
      )
      toast.success("Vote committed", {
        id: tx,
        description: "Reveal before the deadline to count your vote.",
      })
    },
    [requireAccount, account, elections],
  )

  const revealVote = useCallback(
    async (electionId: number, candidateId: number, secret: string) => {
      if (!requireAccount() || !account) return
      const election = elections.find((e) => e.id === electionId)
      if (!election) return
      if (election.revealed[account]) {
        toast.error("Already revealed", {
          description: "This address has already revealed its vote.",
        })
        return
      }
      const committed = election.commits[account]
      const generated = mockCommitHash(candidateId, secret)
      if (!committed || generated !== committed) {
        toast.error("Invalid reveal", {
          description: "Candidate or secret does not match your commitment.",
        })
        return
      }
      const tx = toast.loading("Revealing vote…")
      await delay(1500)
      setElections((prev) =>
        prev.map((e) => {
          if (e.id !== electionId) return e
          return {
            ...e,
            totalVotes: e.totalVotes + 1,
            revealed: { ...e.revealed, [account]: true },
            candidates: e.candidates.map((c) =>
              c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c,
            ),
          }
        }),
      )
      toast.success("Vote revealed", {
        id: tx,
        description: "Your vote is now on-chain and counted.",
      })
    },
    [requireAccount, account, elections],
  )

  const getWinner = useCallback(
    (electionId: number): Winner => {
      const e = elections.find((x) => x.id === electionId)
      if (!e) return { winnerName: "No votes yet", highestVote: 0, isTie: false }
      return computeWinner(e)
    },
    [elections],
  )

  const value = useMemo<VotingContextValue>(
    () => ({
      account,
      chainId,
      isOwner,
      isConnecting,
      isCorrectNetwork,
      elections,
      connect,
      disconnect,
      switchNetwork,
      createElection,
      addCandidate,
      commitVote,
      revealVote,
      getWinner,
    }),
    [
      account,
      chainId,
      isOwner,
      isConnecting,
      isCorrectNetwork,
      elections,
      connect,
      disconnect,
      switchNetwork,
      createElection,
      addCandidate,
      commitVote,
      revealVote,
      getWinner,
    ],
  )

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
}

export function useVoting() {
  const ctx = useContext(VotingContext)
  if (!ctx) throw new Error("useVoting must be used within a VotingProvider")
  return ctx
}

export { OWNER_ADDRESS, VOTER_ADDRESS }
