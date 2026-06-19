# Simple Voting Smart Contract

## Deskripsi
Simple Voting adalah smart contract berbasis Solidity untuk membuat beberapa sesi voting. Owner dapat membuat election dan menambahkan kandidat, sedangkan voter memberikan suara dengan mekanisme direct live voting yang memungkinkan hasil dapat langsung terlihat secara real-time.

## Anggota Kelompok
| No | Nama | NRP | Kontribusi |
|---|---|---|---|
| 1 | Rafi' Afnaan Fathurrahman | 5027231040 | Smart Contract |
| 2 | Dzaky Faiq Fayyadhi | 5027231047 | Frontend UI/UX |
| 3 | Amoes Noland | 5027231028 | Integrasi Web3 |

## Tech Stack
- **Smart Contract**: Solidity `^0.8.20`, Hardhat
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Web3 Library**: ethers.js v6
- **Wallet**: MetaMask
- **UI Components**: shadcn/ui

## Fitur

### Smart Contract
- Owner dapat membuat election
- Owner dapat menambahkan kandidat ke election tertentu
- Contract menolak judul election kosong dan nama kandidat kosong
- Voter melakukan voting langsung terhadap kandidat pilihan
- Contract mencegah double vote (satu address hanya bisa vote satu kali per election)
- Contract memiliki deadline commit vote per election
- Contract dapat menampilkan detail election, kandidat, jumlah suara, pemenang sementara, dan status seri
- Event logging untuk election baru, kandidat baru, dan voting (Voted)

### Frontend (UI/UX)
- Responsive design dengan Tailwind CSS
- Component-based architecture dengan React
- Real-time vote results dengan progress bars
- Countdown timer untuk voting deadline
- Toast notifications untuk transaction feedback
- Network detection dan switching

### Web3 Integration
- MetaMask wallet connection
- Read operations: fetch elections, candidates, winner
- Write operations: create election, add candidate, vote
- Event listening untuk real-time updates
- Transaction lifecycle tracking (pending/success/failed)
- Network detection dan switching
- User-friendly error handling

## Struktur Project
```text
contracts/SimpleVoting.sol          # Smart contract
test/SimpleVoting.test.js           # Unit tests
scripts/deploy.js                   # Deployment script
scripts/interact.js                 # Interaction script
hardhat.config.js                   # Hardhat configuration
frontend/                           # Next.js frontend
├── app/page.tsx                    # Main page
├── components/                     # React components
├── lib/
│   ├── web3/service.ts             # Web3 integration layer
│   ├── voting-provider.tsx         # React Context provider
│   ├── voting-types.ts             # TypeScript types
│   └── contract.ts                 # Contract ABI & address
DEMO.md                             # Demo documentation
README.md
```

## Cara Menjalankan

### Prerequisites
- Node.js v18+
- npm
- MetaMask browser extension

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

Copy the contract address from the output.

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

## Contract Address
```text
0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e
```

## Demo

placeholder

## Screenshot

### 1. Wallet Not Connected
placeholder


### 2. Wallet Connected
placeholder


### 3. Create Election Dialog
placeholder


### 4. Election Created
placeholder


### 5. Add Candidate
placeholder


### 6. Cast Vote
placeholder


### 7. Vote Results
placeholder

