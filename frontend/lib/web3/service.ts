import type { Candidate, Election } from "../voting-types"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract"

/* ---------- ethers.js dynamic import helper ---------- */

let ethersModule: typeof import("ethers") | null = null

export async function getEthers() {
  if (!ethersModule) {
    ethersModule = await import("ethers")
  }
  return ethersModule
}

/* ---------- Utility: real keccak256 for commit hash ---------- */

export async function realCommitHash(candidateId: number, secret: string) {
  const { ethers } = await getEthers()
  return ethers.keccak256(
    ethers.solidityPacked(["uint256", "string"], [candidateId, secret]),
  )
}

/* ---------- Contract helpers ---------- */

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

/* ---------- Fetch all elections from chain ---------- */

export async function fetchAllElections(): Promise<Election[]> {
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

    results.push({
      id: i,
      title,
      // Contract stores deadline in seconds → convert to milliseconds for JS
      deadline: Number(deadline) * 1000,
      active,
      totalVotes: Number(totalVotes),
      candidates,
      commits: {},
      revealed: {},
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
  const tx = await contract.createElection(title, durationMinutes)
  await tx.wait()
  return tx
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
