/**
 * Contract ABI and address configuration for the SimpleVoting smart contract.
 *
 * The ABI is extracted from Hardhat compilation artifacts.
 * Update CONTRACT_ADDRESS after each deploy.
 */

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "candidateId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
    ],
    name: "CandidateAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
    ],
    name: "ElectionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "address", name: "voter", type: "address" },
    ],
    name: "VoteCommitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "electionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "candidateId", type: "uint256" },
    ],
    name: "VoteRevealed",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
    ],
    name: "addCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "bytes32", name: "_hash", type: "bytes32" },
    ],
    name: "commitVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "uint256", name: "_durationMinutes", type: "uint256" },
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "electionCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "elections",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "uint256", name: "candidateCount", type: "uint256" },
      { internalType: "uint256", name: "totalVotes", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "uint256", name: "_candidateId", type: "uint256" },
    ],
    name: "getCandidate",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_electionId", type: "uint256" }],
    name: "getElection",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bool", name: "", type: "bool" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_electionId", type: "uint256" }],
    name: "getWinner",
    outputs: [
      { internalType: "string", name: "winnerName", type: "string" },
      { internalType: "uint256", name: "highestVote", type: "uint256" },
      { internalType: "bool", name: "isTie", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "uint256", name: "_candidateId", type: "uint256" },
      { internalType: "string", name: "_secret", type: "string" },
    ],
    name: "revealVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "address", name: "_voter", type: "address" },
    ],
    name: "hasCommitted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_electionId", type: "uint256" },
      { internalType: "address", name: "_voter", type: "address" },
    ],
    name: "hasRevealed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const
