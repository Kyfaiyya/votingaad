# Project 3: Decentralized Application (dApp)

## Informasi Umum

| Item                   | Detail                              |
| ---------------------- | ----------------------------------- |
| **Nama Project**       | dApp Development                    |
| **Modul Terkait**      | Module 12-15                        |
| **Jumlah Anggota**     | 3 orang per kelompok                |
| **Minggu Demo**        | Minggu 16 (16 Juni 2025)            |

## Deskripsi

Pada project ini, mahasiswa akan mengembangkan **Decentralized Application (dApp)** yang mengintegrasikan **smart contract** dengan **frontend web**. dApp harus dapat terhubung ke wallet (MetaMask), membaca data dari blockchain, dan melakukan transaksi write.

Project ini **tidak harus melanjutkan Project 2**. Mahasiswa bebas membuat smart contract baru sesuai tema yang dipilih.

## Pembagian Tugas Kelompok

Berikut rekomendasi pembagian tugas untuk kelompok 3 orang:

| Anggota   | Tanggung Jawab Utama                          |
| --------- | --------------------------------------------- |
| Anggota 1 | Smart Contract (Solidity, Testing, Deploy)    |
| Anggota 2 | Frontend UI/UX (React, Components, Styling)   |
| Anggota 3 | Integrasi Web3 (ethers.js, Wallet, Read/Write)|

**Catatan:**
- Pembagian di atas adalah rekomendasi, bisa disesuaikan dengan kemampuan tim
- Semua anggota **wajib memahami** keseluruhan sistem (tidak hanya bagiannya)
- Debugging dan testing dilakukan bersama-sama
- Setiap anggota harus bisa menjelaskan bagian anggota lain saat presentasi

## Tujuan Pembelajaran

Setelah menyelesaikan project ini, mahasiswa mampu:

1. Memahami arsitektur Web3 dan perbedaannya dengan Web2
2. Mengintegrasikan frontend dengan smart contract menggunakan ethers.js
3. Menghubungkan aplikasi dengan MetaMask wallet
4. Membedakan dan mengimplementasikan operasi read dan write
5. Menangani transaction lifecycle (pending, confirmed, failed)
6. Men-deploy dApp yang dapat diakses publik

## Pilihan Tema Project

Pilih **salah satu** tema berikut atau ajukan tema sendiri (dengan persetujuan dosen):

### Tema 1: Course Reward dApp

**Deskripsi:** Aplikasi web untuk sistem reward mahasiswa (lanjutan dari Project 2).

**Fitur Wajib:**

- Connect wallet (MetaMask)
- Mahasiswa bisa melihat reward amount
- Mahasiswa bisa claim reward
- Menampilkan status claim (sudah/belum)
- Loading state saat transaksi pending

**Fitur Bonus:**

- Notifikasi real-time via events
- Riwayat transaksi
- Admin panel untuk dosen

### Tema 2: Voting dApp

**Deskripsi:** Aplikasi voting on-chain dengan tampilan hasil real-time.

**Fitur Wajib:**

- Connect wallet
- Menampilkan daftar kandidat/proposal
- User bisa vote
- Menampilkan hasil voting (chart/progress bar)
- Mencegah double voting (UI feedback)

**Fitur Bonus:**

- Countdown deadline
- Live update saat ada vote baru
- Statistik voter

### Tema 3: Todo List dApp

**Deskripsi:** Aplikasi todo list yang tersimpan permanen di blockchain.

**Fitur Wajib:**

- Connect wallet
- Tambah todo baru
- Tandai todo selesai
- Hapus todo
- Tampilkan list todo user

**Fitur Bonus:**

- Filter (all/active/completed)
- Drag and drop reorder
- Deadline reminder

### Tema 4: Simple Escrow dApp

**Deskripsi:** Aplikasi escrow untuk transaksi aman peer-to-peer.

**Fitur Wajib:**

- Connect wallet
- Buyer bisa deposit
- Tampilkan status escrow
- Buyer bisa release/dispute
- Seller bisa lihat status

**Fitur Bonus:**

- Multi-step form
- Transaction history
- Email/notification

### Tema 5: Token Wallet dApp

**Deskripsi:** Aplikasi wallet sederhana untuk token custom.

**Fitur Wajib:**

- Connect wallet
- Tampilkan balance
- Transfer ke address lain
- Riwayat transfer (via events)
- Validasi input address

**Fitur Bonus:**

- QR code untuk address
- Multiple token support
- Price chart (mock data)

### Tema 6: Crowdfunding dApp

**Deskripsi:** Platform crowdfunding dengan progress bar dan countdown.

**Fitur Wajib:**

- Connect wallet
- Tampilkan campaign details
- Progress bar menuju target
- User bisa donate
- Tampilkan list donatur

**Fitur Bonus:**

- Multiple campaigns
- Share ke social media
- Leaderboard donatur

---

## Spesifikasi Teknis

### Arsitektur dApp

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │    Pages    │  │ Components  │  │   State Management  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  LIBRARY WEB3 (ethers.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Provider   │  │   Signer    │  │   Contract Instance │  │
│  │  (read)     │  │   (write)   │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      METAMASK WALLET                        │
│         (Sign transactions, Manage accounts)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN (Local/Testnet)                 │
│                      Smart Contract                         │
└─────────────────────────────────────────────────────────────┘
```

### Struktur Project

```
project-dapp/
├── contracts/                    # Smart contract (dari Project 2 atau baru)
│   └── NamaContract.sol
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ConnectWallet.jsx
│   │   │   ├── ReadData.jsx
│   │   │   └── WriteAction.jsx
│   │   ├── hooks/                # Custom hooks (opsional)
│   │   │   └── useContract.js
│   │   ├── utils/
│   │   │   ├── contract.js       # Contract address & ABI
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── test/                         # Smart contract tests
├── scripts/
│   └── deploy.js
├── hardhat.config.js
├── package.json
└── README.md
```

### Requirement Frontend

| Komponen               | Minimum | Keterangan                                    |
| ---------------------- | ------- | --------------------------------------------- |
| **Pages/Views**        | 1       | Bisa single page application                  |
| **Components**         | 4       | ConnectWallet, minimal 3 komponen lain        |
| **Read Operations**    | 2       | Membaca data dari smart contract              |
| **Write Operations**   | 2       | Transaksi yang mengubah state                 |
| **Loading States**     | Ya      | Indicator saat transaksi pending              |
| **Error Handling**     | Ya      | Tampilkan pesan error yang user-friendly      |
| **Responsive Design**  | Ya      | Minimal mobile-friendly                       |

### Requirement Smart Contract

Sama seperti Project 2, atau lebih kompleks jika membuat baru:

| Komponen            | Minimum |
| ------------------- | ------- |
| **State Variables** | 3       |
| **Functions**       | 4       |
| **Modifiers**       | 1       |
| **Events**          | 2       |
| **Mappings**        | 1       |

### Requirement Integrasi

| Fitur                        | Wajib | Keterangan                                 |
| ---------------------------- | ----- | ------------------------------------------ |
| **Wallet Connection**        | Ya    | Detect MetaMask, request connection        |
| **Network Detection**        | Ya    | Tampilkan warning jika network salah       |
| **Account Display**          | Ya    | Tampilkan address yang terkoneksi          |
| **Transaction Feedback**     | Ya    | Pending, success, failed states            |
| **Event Listening**          | Tidak | Bonus: real-time update via events         |
| **Testnet Deployment**       | Tidak | Bonus: deploy ke Sepolia                   |
| **Frontend Hosting**         | Tidak | Bonus: deploy ke Vercel/Netlify            |

---

## Deliverables

### 1. Source Code (GitHub Repository)

Repository harus berisi:

- [ ] `contracts/` - Smart contract Solidity
- [ ] `frontend/` - Kode frontend React
- [ ] `test/` - Unit test smart contract
- [ ] `scripts/` - Deployment script
- [ ] `README.md` - Dokumentasi lengkap
- [ ] `.gitignore` - Exclude node_modules, artifacts, cache, .env

### 2. README.md

README harus mencakup:

```markdown
# Nama dApp

## Deskripsi
[Penjelasan singkat dApp dan use case-nya]

## Anggota Kelompok
| Nama | NRP | Kontribusi |
|------|-----|------------|
| Nama 1 | NRP | Smart Contract |
| Nama 2 | NRP | Frontend UI/UX |
| Nama 3 | NRP | Integrasi Web3 |

## Tech Stack
- Frontend: React + Vite
- Smart Contract: Solidity + Hardhat
- Web3 Library: ethers.js
- Wallet: MetaMask

## Fitur
- [ ] Connect Wallet
- [ ] Fitur 1 (Read)
- [ ] Fitur 2 (Read)
- [ ] Fitur 3 (Write)
- [ ] Fitur 4 (Write)

## Cara Menjalankan

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Git

### 1. Clone Repository
git clone [url-repo]
cd [nama-folder]

### 2. Install Dependencies
# Root folder (smart contract)
npm install

# Frontend folder
cd frontend
npm install

### 3. Jalankan Local Blockchain
npx hardhat node

### 4. Deploy Smart Contract
# Di terminal baru
npx hardhat run scripts/deploy.js --network localhost

### 5. Update Contract Address
# Copy address dari output deploy
# Paste ke frontend/src/utils/contract.js

### 6. Import Account ke MetaMask
# Copy private key dari Hardhat node
# Import ke MetaMask
# Ganti network ke Localhost 8545

### 7. Jalankan Frontend
cd frontend
npm run dev

### 8. Buka Browser
http://localhost:5173

## Contract Address
- Local: [alamat setelah deploy]
- Testnet (opsional): [alamat di Sepolia]

## Demo
[Link video demo atau GIF]

## Screenshot
[Screenshot aplikasi]
```

### 3. Screenshot/Video Bukti

Pilih **salah satu** format berikut:

**Opsi A: Video Demo (Disarankan)**
- Durasi: 3-5 menit
- Format: MP4 atau link YouTube/Google Drive
- Isi: Demo lengkap fitur dari connect wallet sampai transaksi berhasil

**Opsi B: Screenshot Lengkap**

| Screenshot                 | Keterangan                              |
| -------------------------- | --------------------------------------- |
| Wallet not connected       | State awal sebelum connect              |
| Wallet connected           | Tampilan setelah connect (show address) |
| Read operation             | Data berhasil dibaca dari contract      |
| Write pending              | Loading state saat transaksi pending    |
| Write success              | Konfirmasi transaksi berhasil           |
| MetaMask popup             | Request signature/transaction           |
| State updated              | Data berubah setelah write              |
| Error handling             | Contoh tampilan error                   |

---

## Rubrik Penilaian

| Komponen                 | Bobot | Kriteria                                               |
| ------------------------ | ----- | ------------------------------------------------------ |
| **Smart Contract**       | 20%   | Berfungsi dengan baik, terintegrasi dengan frontend    |
| **Frontend UI/UX**       | 25%   | Tampilan rapi, responsive, user-friendly               |
| **Wallet Integration**   | 15%   | Connect/disconnect, network detection, account display |
| **Read Operations**      | 10%   | Data ditampilkan dengan benar dari blockchain          |
| **Write Operations**     | 15%   | Transaksi berhasil, feedback states lengkap            |
| **Error Handling**       | 5%    | Graceful error handling, pesan jelas                   |
| **Dokumentasi**          | 5%    | README lengkap, kode terdokumentasi                    |
| **Presentasi**           | 5%    | Demo lancar, menjawab pertanyaan                       |

### Detail Penilaian Frontend (25%)

| Nilai      | Kriteria                                                  |
| ---------- | --------------------------------------------------------- |
| A (90-100) | UI polished, animasi smooth, fully responsive, bonus fitur |
| B (80-89)  | UI rapi, responsive, semua fitur wajib berfungsi          |
| C (70-79)  | UI cukup, sebagian responsive, fitur lengkap              |
| D (60-69)  | UI basic, tidak responsive, fitur minimal                 |
| E (<60)    | UI berantakan atau tidak berfungsi                        |

### Detail Penilaian Integration (25%)

| Nilai      | Kriteria                                                    |
| ---------- | ----------------------------------------------------------- |
| A (90-100) | Semua operasi lancar, event listening, deploy ke testnet    |
| B (80-89)  | Read/write berfungsi, loading states, error handling        |
| C (70-79)  | Read/write berfungsi, minimal feedback                      |
| D (60-69)  | Hanya read atau write yang berfungsi                        |
| E (<60)    | Tidak bisa connect atau tidak ada operasi yang berfungsi    |

---

## Timeline

| Minggu               | Aktivitas                                            |
| -------------------- | ---------------------------------------------------- |
| **Minggu 12**        | Belajar konsep dApp, arsitektur Web3 (Module 12-13)  |
| **Minggu 13**        | Frontend integration, read/write ops (Module 14-15)  |
| **Minggu 14**        | Integrasi smart contract + frontend                  |
| **Minggu 15**        | Polish, testing, deploy                              |
| **Minggu 16**        | **Demo Project (16 Juni 2025)**                      |

---

## Aturan dan Ketentuan

### Academic Integrity

- Setiap anggota kelompok **wajib memahami** keseluruhan kode, bukan hanya bagiannya
- Boleh menggunakan referensi dari tutorial/dokumentasi, tapi **wajib paham** cara kerjanya
- **Dilarang** copy-paste dari kelompok lain atau repository publik tanpa modifikasi signifikan
- Penggunaan AI tools (ChatGPT, GitHub Copilot, dll) diperbolehkan sebagai **alat bantu belajar**, bukan pengganti pemahaman
- Saat presentasi, dosen berhak bertanya ke anggota manapun tentang bagian manapun

### Security Best Practices

Pastikan project kalian mengikuti praktik keamanan berikut:

| Praktik | Penjelasan |
| ------- | ---------- |
| **Jangan commit private key** | Gunakan `.env` dan masukkan ke `.gitignore` |
| **Validasi input user** | Cek format address, angka positif, dll di frontend |
| **Gunakan akun testing** | Jangan pernah gunakan akun mainnet untuk development |
| **Handle error dengan baik** | Jangan tampilkan error teknis ke user |

---

## Tips Pengerjaan

### Do's ✅

1. **Mulai dari smart contract** - Pastikan contract berfungsi sebelum buat frontend
2. **Test di local dulu** - Jangan langsung ke testnet, hemat waktu dan gas
3. **Gunakan console.log** - Debug dengan console browser
4. **Handle semua state** - Loading, success, error, empty
5. **Commit sering** - Backup progress ke Git
6. **Baca error MetaMask** - Pesan error biasanya informatif

### Don'ts ❌

1. **Jangan hardcode private key** - Gunakan environment variables
2. **Jangan skip error handling** - User experience akan buruk
3. **Jangan lupa await** - Operasi blockchain itu async
4. **Jangan test dengan akun mainnet** - Gunakan akun Hardhat
5. **Jangan tunggu deadline** - Integrasi butuh waktu debugging

### Common Issues & Solutions

| Issue                              | Solution                                      |
| ---------------------------------- | --------------------------------------------- |
| MetaMask tidak muncul              | Pastikan extension terinstall dan unlocked    |
| Transaction reverted               | Cek require conditions di smart contract      |
| Cannot read property of undefined  | Data belum di-load, tambahkan loading state   |
| Nonce too high                     | Reset account di MetaMask Settings            |
| Network mismatch                   | Pastikan MetaMask di network yang benar       |

---

## Code Snippets

### Connect Wallet

```javascript
const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setAccount(accounts[0]);
  } catch (error) {
    console.error("Connection failed:", error);
  }
};
```

### Setup Contract Instance

```javascript
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./utils/contract";

const getContract = (signer = null) => {
  const provider = new ethers.BrowserProvider(window.ethereum);

  if (signer) {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
```

### Read Operation

```javascript
const readData = async () => {
  try {
    setLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const result = await contract.getValue();
    setData(result.toString());
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Write Operation

```javascript
const writeData = async (newValue) => {
  try {
    setLoading(true);
    setTxStatus("pending");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.setValue(newValue);
    await tx.wait(); // Tunggu konfirmasi

    setTxStatus("success");
    await readData(); // Refresh data
  } catch (error) {
    setTxStatus("failed");
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## FAQ

### Q: Boleh pakai framework CSS seperti Tailwind?

**A:** Boleh. Bebas menggunakan CSS framework apapun (Tailwind, Bootstrap, dll).

### Q: Harus pakai React?

**A:** Disarankan React + Vite seperti di modul. Jika ingin pakai framework lain (Vue, Svelte), diskusikan dulu dengan dosen.

### Q: Smart contract harus baru atau boleh pakai Project 2?

**A:** Boleh pakai smart contract dari Project 2, atau buat yang baru/lebih kompleks.

### Q: Harus deploy ke testnet?

**A:** Tidak wajib. Local blockchain sudah cukup. Deploy ke testnet adalah bonus.

### Q: Harus hosting frontend?

**A:** Tidak wajib. Demo dari localhost sudah cukup. Hosting adalah bonus.

### Q: Bagaimana jika MetaMask error saat demo?

**A:** Siapkan backup: screen recording atau reset MetaMask account sebelum demo.

### Q: Boleh pakai template/starter code?

**A:** Boleh, tapi harus memahami cara kerjanya. Saat presentasi, dosen bisa bertanya tentang kode apapun.

### Q: Boleh pakai AI tools seperti ChatGPT?

**A:** Boleh sebagai alat bantu belajar. Tapi semua anggota wajib paham kode yang ditulis. Copy-paste tanpa pemahaman akan terlihat saat presentasi.

---

## Referensi

- [Module 12 - Pengenalan dApp](../module-12.md)
- [Module 13 - Frontend Integration (Read)](../module-13.md)
- [Module 14 - Frontend Integration (Write)](../module-14.md)
- [Module 15 - Advanced Features & Deployment](../module-15.md)
- [ethers.js Documentation](https://docs.ethers.org/v6/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

## Submission

### Deadline

**Minggu 16 - 16 Juni 2025** (sesuai jadwal demo)

### Cara Submit

1. Push semua kode ke GitHub repository
2. Pastikan repository **public** atau invite dosen sebagai collaborator
3. Pastikan README lengkap dengan cara menjalankan
4. Siapkan demo (local atau deployed)
5. Kumpulkan link repository ke LMS/sistem yang ditentukan

### Format Nama Repository

```
blockchain-project3-[nama-kelompok]
```

Contoh: `blockchain-project3-team-alpha`

---

## Bonus Points

| Bonus                          | Poin Extra | Keterangan                              |
| ------------------------------ | ---------- | --------------------------------------- |
| Deploy ke Sepolia Testnet      | +5         | Contract di-deploy dan berfungsi        |
| Frontend Hosting               | +5         | Deploy ke Vercel/Netlify, link publik   |
| Event Listening (Real-time)    | +5         | UI update otomatis saat ada event       |
| Multiple Network Support       | +3         | Switch antara local dan testnet         |
| Dark Mode                      | +2         | Toggle dark/light theme                 |
| Transaction History            | +3         | Tampilkan riwayat transaksi user        |
| Loading Skeleton               | +2         | Skeleton loading instead of spinner     |

Maksimum bonus: **+15 poin** (tidak melebihi 100)