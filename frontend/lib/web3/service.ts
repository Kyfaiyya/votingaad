import type { Candidate, Election, TxStatus } from "../voting-types"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract"

/* ---------- ethers.js dynamic import helper ---------- */

let ethersModule: typeof import("ethers") | null = null

export async function getEthers() {
  if (!ethersModule) {
    ethersModule = await import("ethers")
  }
  return ethersModule
}

/* ---------- Transaction Status Tracking ---------- */

export type TxState = {
  hash: string | null
  status: TxStatus
  error: string | null
}

export type TxCallback = (state: TxState) => void

/* ---------- Event Listener Types ---------- */

export type VotingEvent = {
  type: "ElectionCreated" | "CandidateAdded" | "VoteCommitted" | "VoteRevealed"
  electionId: number
  data: Record<string, unknown>
}

export type EventCallback = (event: VotingEvent) => void

export async function realCommitHash(candidateId: number, secret: string) {
  const { ethers } = await getEthers()
  return ethers.keccak256(
    ethers.solidityPacked(["uint256", "string"], [candidateId, secret]),
  )
}

export async function getProvider() {
  if (typeof window === "undefined" || !window.ethereum) return null
  const { ethers } = await getEthers()
  return new ethers.BrowserProvider(window.ethereum as any)
}

export async function getReadContract() {
  const provider = await getProvider()
  if (!provider) return null
  const { ethers } = await getEthers()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
}

export async function getWriteContract() {
  const provider = await getProvider()
  if (!provider) return null
  const { ethers } = await getEthers()
  const signer = await provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
}

/* ---------- Network Detection ---------- */

export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window === "undefined" || !window.ethereum) return null
  try {
    const chainHex = await window.ethereum.request({ method: "eth_chainId" }) as string
    return parseInt(chainHex, 16)
  } catch {
    return null
  }
}

export async function switchToNetwork(chainId: number): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + chainId.toString(16) }],
    })
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      return await addNetwork(chainId)
    }
    return false
  }
}

async function addNetwork(chainId: number): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + chainId.toString(16),
          chainName: "Hardhat Local",
          rpcUrls: ["http://127.0.0.1:8545"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        },
      ],
    })
    return true
  } catch {
    return false
  }
}

/* ---------- Error Handling ---------- */

export function parseContractError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message

    if (msg.includes("Not owner")) return "Only the contract owner can perform this action"
    if (msg.includes("Election not found")) return "Election does not exist"
    if (msg.includes("Election closed")) return "This election is no longer active"
    if (msg.includes("Title empty")) return "Election title cannot be empty"
    if (msg.includes("Candidate name cannot be empty")) return "Candidate name cannot be empty"
    if (msg.includes("Voting ended")) return "Voting deadline has passed"
    if (msg.includes("Already committed")) return "You have already committed a vote"
    if (msg.includes("Already revealed")) return "You have already revealed your vote"
    if (msg.includes("Invalid candidate")) return "Selected candidate is invalid"
    if (msg.includes("Invalid reveal")) return "Secret does not match your commit"
    if (msg.includes("user rejected")) return "Transaction was rejected by user"
    if (msg.includes("insufficient funds")) return "Insufficient funds for transaction"
    if (msg.includes("Internal JSON-RPC error")) return "Transaction failed - check if you're using the correct account (owner)"

    return msg.slice(0, 100)
  }
  return "An unknown error occurred"
}

/* ---------- Transaction Tracking ---------- */

export async function executeTransaction(
  contractCall: () => Promise<any>,
  onStatus?: TxCallback,
): Promise<string> {
  onStatus?.({ hash: null, status: "pending", error: null })

  try {
    const tx = await contractCall()
    onStatus?.({ hash: tx.hash, status: "pending", error: null })

    await tx.wait()
    onStatus?.({ hash: tx.hash, status: "success", error: null })

    return tx.hash
  } catch (error) {
    const errorMsg = parseContractError(error)
    onStatus?.({ hash: null, status: "failed", error: errorMsg })
    throw new Error(errorMsg)
  }
}

/* ---------- Event Listening ---------- */

let contractInstance: any = null
let eventListeners: EventCallback[] = []

function getEventName(log: any): string | null {
  if (log.fragment?.name) return log.fragment.name
  return null
}

export function subscribeToEvents(onEvent: EventCallback): () => void {
  eventListeners.push(onEvent)

  const setupListener = async () => {
    const contract = await getReadContract()
    if (!contract) return

    contractInstance = contract

    contract.on("ElectionCreated", (electionId: any, title: string) => {
      eventListeners.forEach((cb) =>
        cb({
          type: "ElectionCreated",
          electionId: Number(electionId),
          data: { title },
        })
      )
    })

    contract.on("CandidateAdded", (electionId: any, candidateId: any, name: string) => {
      eventListeners.forEach((cb) =>
        cb({
          type: "CandidateAdded",
          electionId: Number(electionId),
          data: { candidateId: Number(candidateId), name },
        })
      )
    })

    contract.on("VoteCommitted", (electionId: any, voter: string) => {
      eventListeners.forEach((cb) =>
        cb({
          type: "VoteCommitted",
          electionId: Number(electionId),
          data: { voter },
        })
      )
    })

    contract.on("VoteRevealed", (electionId: any, candidateId: any) => {
      eventListeners.forEach((cb) =>
        cb({
          type: "VoteRevealed",
          electionId: Number(electionId),
          data: { candidateId: Number(candidateId) },
        })
      )
    })
  }

  setupListener()

  return () => {
    eventListeners = eventListeners.filter((cb) => cb !== onEvent)
    if (eventListeners.length === 0 && contractInstance) {
      contractInstance.removeAllListeners()
      contractInstance = null
    }
  }
}

export async function fetchPastEvents(): Promise<VotingEvent[]> {
  const contract = await getReadContract()
  if (!contract) return []

  const events: VotingEvent[] = []

  const electionCreatedFilter = contract.filters.ElectionCreated()
  const electionCreatedLogs = await contract.queryFilter(electionCreatedFilter)

  for (const log of electionCreatedLogs) {
    const args = (log as any).args
    if (args) {
      events.push({
        type: "ElectionCreated",
        electionId: Number(args.electionId),
        data: { title: args.title },
      })
    }
  }

  return events
}

/* ---------- Fetch all elections from chain ---------- */

export async function fetchAllElections(walletAddress?: string): Promise<Election[]> {
  const contract = await getReadContract()
  if (!contract) return []

  const count = await contract.electionCount()
  const electionCount = Number(count)
  const results: Election[] = []

  for (let i = 1; i <= electionCount; i++) {
    const [title, deadline, active, candidateCount, totalVotes] =
      await contract.getElection(i)

    const candidates: Candidate[] = []
    const numCandidates = Number(candidateCount)

    for (let j = 1; j <= numCandidates; j++) {
      const [id, name, voteCount] = await contract.getCandidate(i, j)
      candidates.push({
        id: Number(id),
        name,
        voteCount: Number(voteCount),
      })
    }

    const commits: Record<string, string> = {}
    const revealed: Record<string, boolean> = {}

    if (walletAddress) {
      try {
        const [committed, revealedStatus] = await Promise.all([
          contract.hasCommitted(i, walletAddress),
          contract.hasRevealed(i, walletAddress),
        ])
        commits[walletAddress] = committed ? "committed" : ""
        revealed[walletAddress] = revealedStatus
      } catch {
        // Contract lama tanpa hasCommitted/hasRevealed - skip
      }
    }

    results.push({
      id: i,
      title,
      deadline: Number(deadline) * 1000,
      active,
      totalVotes: Number(totalVotes),
      candidates,
      commits,
      revealed,
    })
  }

  return results
}

/* ---------- Fetch contract owner ---------- */

export async function fetchContractOwner(): Promise<string | null> {
  const contract = await getReadContract()
  if (!contract) return null
  return await contract.owner()
}

/* ---------- Write Operations ---------- */

export async function createElectionOnChain(title: string, durationMinutes: number) {
  const contract = await getWriteContract()
  if (!contract) throw new Error("Contract not available")
  try {
    const tx = await contract.createElection(title, durationMinutes)
    await tx.wait()
    return tx
  } catch (error) {
    console.error("createElection error:", error)
    throw error
  }
}

export async function addCandidateOnChain(electionId: number, name: string) {
  const contract = await getWriteContract()
  if (!contract) throw new Error("Contract not available")
  const tx = await contract.addCandidate(electionId, name)
  await tx.wait()
  return tx
}

export async function commitVoteOnChain(electionId: number, hash: string) {
  const contract = await getWriteContract()
  if (!contract) throw new Error("Contract not available")
  const tx = await contract.commitVote(electionId, hash)
  await tx.wait()
  return tx
}

export async function revealVoteOnChain(electionId: number, candidateId: number, secret: string) {
  const contract = await getWriteContract()
  if (!contract) throw new Error("Contract not available")
  const tx = await contract.revealVote(electionId, candidateId, secret)
  await tx.wait()
  return tx
}
