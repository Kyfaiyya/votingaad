# ChainVote - Demo Documentation

## Overview

ChainVote is a decentralized voting application using a direct live voting scheme. This document provides step-by-step instructions for demonstrating the dApp.

---

## Prerequisites

1. Node.js v18+
2. MetaMask browser extension
3. Git

---

## Quick Start

### 1. Install Dependencies

```bash
# Root folder (smart contract)
npm install

# Frontend folder
cd frontend
pnpm install
cd ..
```

### 2. Start Local Blockchain

```bash
npm run node
```

Keep this terminal running. You'll see account addresses and private keys.

### 3. Deploy Smart Contract

Open a new terminal:

```bash
npm run deploy:local
```

Copy the contract address from the output (default: `0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e`).

### 4. Update Frontend Configuration

The contract address is already configured in `frontend/lib/contract.ts`. If you deployed to a different address, update it there.

### 5. Import Account to MetaMask

1. Open MetaMask
2. Click account icon → Import Account
3. Paste private key from Hardhat node output
4. Add Hardhat Local network:
   - Network Name: Hardhat Local
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

### 6. Start Frontend

```bash
cd frontend
pnpm dev
```

### 7. Open Browser

Navigate to `http://localhost:3000`

---

## Demo Flow

### Phase 1: Connect Wallet

1. Open the application
2. 📸 **Screenshot 1**: Capture the initial state with "Connect Wallet" button visible
3. Click "Connect Wallet" button
4. Approve connection in MetaMask popup
5. 📸 **Screenshot 2**: Capture the header showing connected address + "Owner" badge
6. Verify address is displayed in header
7. If connected as owner, see "Owner" badge

**Expected Result:**
- Wallet connected indicator with green dot
- Address shown: `0x1234...abcd`
- Owner badge visible (if using deployer account)

---

### Phase 2: Create Election (Owner Only)

1. Click "New Election" button (only visible for owner)
2. 📸 **Screenshot 3**: Capture the "Create election" dialog with form filled
3. Enter election title: `Ketua Kelas 2026`
4. Select duration: `1 hour`
5. Click "Create election"
6. Approve transaction in MetaMask
7. 📸 **Screenshot 4**: Capture success toast + new election in sidebar

**Expected Result:**
- Toast notification: "Creating election…"
- Transaction pending state
- Success toast: "Election created"
- New election appears in sidebar

---

### Phase 3: Add Candidates (Owner Only)

1. Select the newly created election
2. In the "Live results" section, find "Add candidate" input
3. Enter candidate name: `Alice`
4. Click "Add" button
5. Approve transaction in MetaMask
6. 📸 **Screenshot 5**: Capture toast "Candidate added" + candidate bar appears
7. Repeat for second candidate: `Bob`

**Expected Result:**
- Toast: "Adding candidate…"
- Success toast: "Candidate added"
- Candidate bars appear in results section

---

### Phase 4: Cast Vote (Voter)

1. Import a different account to MetaMask (voter account)
2. Connect wallet with voter account
3. Select the election
4. In "Cast your vote" panel, select a candidate
5. 📸 **Screenshot 6**: Capture the vote form with candidate selected
6. Click "Submit Vote"
7. Approve transaction in MetaMask

**Expected Result:**
- Toast: "Casting vote..."
- Success toast: "Vote counted"
- Panel updates to show "Vote submitted" status
- Vote count increases in results
- Progress bar updates

---

### Phase 5: View Results

1. Check "Live results" section
2. 📸 **Screenshot 8**: Capture the full results with candidate bars + winner banner
3. See candidate vote counts
4. See progress bars indicating vote share
5. Winner banner shows leading candidate

**Expected Result:**
- Candidate bars show vote counts
- Progress bars reflect percentages
- Winner banner displays: "Alice leads with 1 vote"

---

## Technical Architecture

### Web3 Integration Layer

```
┌─────────────────────────────────────────────┐
│            voting-provider.tsx               │
│  (React Context - State Management)         │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│            lib/web3/service.ts               │
│  (ethers.js - Blockchain Interaction)       │
├─────────────────────────────────────────────┤
│ • getProvider()     - BrowserProvider       │
│ • getReadContract() - Read-only instance    │
│ • getWriteContract() - Signer instance      │
│ • fetchAllElections() - Batch read          │
│ • subscribeToEvents() - Real-time updates   │
│ • parseContractError() - Error handling     │
│ • executeTransaction() - Tx lifecycle       │
│ • switchToNetwork() - Network management    │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│            MetaMask Wallet                   │
│  (User signs transactions)                  │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│         SimpleVoting.sol                     │
│  (Hardhat Local - Chain ID 31337)           │
└─────────────────────────────────────────────┘
```

### Key Features Implemented

1. **Wallet Connection**
   - MetaMask detection
   - Account request
   - Chain ID tracking
   - Auto-reconnect on page load

2. **Read Operations**
   - Fetch all elections with candidates
   - Get contract owner
   - Get election details
   - Get candidate vote counts

3. **Write Operations**
   - Create election (owner only)
   - Add candidate (owner only)
   - Vote directly

4. **Event Listening**
   - ElectionCreated
   - CandidateAdded
   - Voted

5. **Error Handling**
   - Contract error parsing
   - User-friendly messages
   - Transaction status tracking

6. **Network Management**
   - Chain ID detection
   - Network switching
   - Auto-add Hardhat network

---

## Troubleshooting

### MetaMask Not Detected

- Ensure MetaMask extension is installed
- Refresh the page
- Check browser console for errors

### Transaction Reverted

- Check account has sufficient ETH
- Verify correct network (Hardhat Local)
- Ensure not double-voting
- Check election is still active

### Contract Not Found

- Verify contract is deployed: `npm run deploy:local`
- Check contract address in `frontend/lib/contract.ts`
- Ensure Hardhat node is running

### Frontend Not Loading

- Check `npm run dev` is running
- Verify port 3000 is not in use
- Clear browser cache

---

## Performance Notes

- Elections are fetched in batch (sequential reads)
- Event listeners are cleaned up on unmount
- Optimistic UI updates for better UX
- Toast notifications for transaction feedback

---

## Security Considerations

1. **Direct Voting Scheme**: Votes are processed directly on-chain and counted immediately
2. **Owner-Only Functions**: Election creation restricted to contract owner
3. **Double Voting Prevention**: Contract rejects duplicate votes from the same address
4. **Deadline Enforcement**: Voting stops after deadline

---

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile MetaMask: Supported

---

## Additional Resources

- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Hardhat Documentation](https://hardhat.org/docs)
