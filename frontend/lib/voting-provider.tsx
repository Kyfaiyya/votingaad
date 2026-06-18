"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import {
  EXPECTED_CHAIN_ID,
  type Election,
  type Winner,
} from "./voting-types"
import {
  fetchAllElections,
  fetchContractOwner,
  createElectionOnChain,
  addCandidateOnChain,
  commitVoteOnChain,
  revealVoteOnChain,
  realCommitHash,
  subscribeToEvents,
  getCurrentChainId,
  switchToNetwork,
  parseContractError,
  type VotingEvent,
} from "./web3/service"

export const mockCommitHash = realCommitHash

/* ---------- Compute winner client-side (mirrors contract logic) ---------- */
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
    winnerName:
      winnerId !== 0 ? e.candidates[winnerId - 1].name : "No votes yet",
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
  lastEvent: VotingEvent | null
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
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
  const [elections, setElections] = useState<Election[]>([])
  const [contractOwner, setContractOwner] = useState<string | null>(null)
  const [lastEvent, setLastEvent] = useState<VotingEvent | null>(null)
  const eventUnsubRef = useRef<(() => void) | null>(null)

  const isOwner =
    !!account &&
    !!contractOwner &&
    account.toLowerCase() === contractOwner.toLowerCase()
  const isCorrectNetwork = chainId === EXPECTED_CHAIN_ID

  const refreshData = useCallback(async () => {
    try {
      const [data, owner] = await Promise.all([
        fetchAllElections(account ?? undefined),
        fetchContractOwner()
      ])
      setElections(data)
      setContractOwner(owner)
    } catch (err) {
      console.error("Failed to refresh data from chain:", err)
    }
  }, [account])

  useEffect(() => {
    const handleEvent = (event: VotingEvent) => {
      setLastEvent(event)
      refreshData()
    }

    eventUnsubRef.current = subscribeToEvents(handleEvent)

    return () => {
      eventUnsubRef.current?.()
    }
  }, [refreshData])

  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined" || !window.ethereum) return
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[]
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0])
          const chain = await getCurrentChainId()
          setChainId(chain)
        }
      } catch {
        // Ignored
      }
      await refreshData()
    }
    init()
  }, [refreshData])

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[]
      if (accs.length === 0) {
        setAccount(null)
        toast("Wallet disconnected")
      } else {
        setAccount(accs[0])
      }
    }

    const handleChainChanged = (chainIdHex: unknown) => {
      setChainId(parseInt(chainIdHex as string, 16))
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

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
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask browser extension.",
      })
      return
    }

    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[]
      setAccount(accounts[0])

      const chain = await getCurrentChainId()
      setChainId(chain)

      await refreshData()

      toast.success("Wallet connected", {
        description: `Connected as ${accounts[0].slice(0, 6)}…${accounts[0].slice(-4)}`,
      })
    } catch (error: unknown) {
      const msg = parseContractError(error)
      toast.error("Connection failed", { description: msg })
    } finally {
      setIsConnecting(false)
    }
  }, [refreshData])

  const disconnect = useCallback(() => {
    setAccount(null)
    setChainId(null)
    toast("Wallet disconnected")
  }, [])

  const switchNetwork = useCallback(async () => {
    const success = await switchToNetwork(EXPECTED_CHAIN_ID)
    if (success) {
      toast.success("Network switched", {
        description: "Now on Hardhat Local (chainId 31337).",
      })
    } else {
      toast.error("Network switch failed")
    }
  }, [])

  const createElectionFn = useCallback(
    async (title: string, durationMinutes: number) => {
      if (!requireAccount()) return
      const txToast = toast.loading("Creating election…", {
        description: "Waiting for transaction confirmation.",
      })
      try {
        await createElectionOnChain(title, durationMinutes)
        await refreshData()
        toast.success("Election created", { id: txToast, description: title })
      } catch (error: unknown) {
        const msg = parseContractError(error)
        toast.error("Failed to create election", { id: txToast, description: msg })
      }
    },
    [requireAccount, refreshData],
  )

  const addCandidateFn = useCallback(
    async (electionId: number, name: string) => {
      if (!requireAccount()) return
      const txToast = toast.loading("Adding candidate…")
      try {
        await addCandidateOnChain(electionId, name)
        await refreshData()
        toast.success("Candidate added", { id: txToast, description: name })
      } catch (error: unknown) {
        const msg = parseContractError(error)
        toast.error("Failed to add candidate", { id: txToast, description: msg })
      }
    },
    [requireAccount, refreshData],
  )

  const commitVoteFn = useCallback(
    async (electionId: number, hash: string) => {
      if (!requireAccount()) return
      const txToast = toast.loading("Committing vote…", {
        description: "Your choice stays hidden until you reveal.",
      })
      try {
        await commitVoteOnChain(electionId, hash)

        setElections((prev) =>
          prev.map((e) =>
            e.id === electionId && account
              ? { ...e, commits: { ...e.commits, [account]: hash } }
              : e,
          ),
        )

        toast.success("Vote committed", {
          id: txToast,
          description: "Reveal before the deadline to count your vote.",
        })
      } catch (error: unknown) {
        const msg = parseContractError(error)
        toast.error("Failed to commit vote", { id: txToast, description: msg })
      }
    },
    [requireAccount, account],
  )

  const revealVoteFn = useCallback(
    async (electionId: number, candidateId: number, secret: string) => {
      if (!requireAccount()) return
      const txToast = toast.loading("Revealing vote…")
      try {
        await revealVoteOnChain(electionId, candidateId, secret)

        setElections((prev) =>
          prev.map((e) =>
            e.id === electionId && account
              ? { ...e, revealed: { ...e.revealed, [account]: true } }
              : e,
          ),
        )

        await refreshData()
        toast.success("Vote revealed", {
          id: txToast,
          description: "Your vote is now on-chain and counted.",
        })
      } catch (error: unknown) {
        const msg = parseContractError(error)
        toast.error("Failed to reveal vote", { id: txToast, description: msg })
      }
    },
    [requireAccount, account, refreshData],
  )

  const getWinnerFn = useCallback(
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
      lastEvent,
      connect,
      disconnect,
      switchNetwork,
      createElection: createElectionFn,
      addCandidate: addCandidateFn,
      commitVote: commitVoteFn,
      revealVote: revealVoteFn,
      getWinner: getWinnerFn,
    }),
    [
      account,
      chainId,
      isOwner,
      isConnecting,
      isCorrectNetwork,
      elections,
      lastEvent,
      connect,
      disconnect,
      switchNetwork,
      createElectionFn,
      addCandidateFn,
      commitVoteFn,
      revealVoteFn,
      getWinnerFn,
    ],
  )

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
}

export function useVoting() {
  const ctx = useContext(VotingContext)
  if (!ctx) throw new Error("useVoting must be used within a VotingProvider")
  return ctx
}
