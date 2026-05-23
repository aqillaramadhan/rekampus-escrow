# 🔐 ReKampus Escrow DApp

A decentralized escrow smart contract solution built on the Stellar blockchain using the Soroban SDK. This project provides a secure, trustless, and transparent transaction system tailored for peer-to-peer campus marketplaces.

> **🚀 Live Demo:** [https://rekampus-escrow.vercel.app](https://rekampus-escrow.vercel.app)

---

## 📌 Project Description

**ReKampus Escrow DApp** solves the critical challenge of trust in peer-to-peer student transactions (such as buying used books, electronics, or campus services). Instead of relying on risky manual transfers or centralized third parties, funds are securely locked in an on-chain smart contract. The contract acts as an immutable intermediary, automatically releasing funds to the seller only after the buyer confirms successful receipt of the goods, or facilitating an instant refund if the transaction is cancelled.

---

## 🎯 Project Vision

Our vision is to revolutionize digital campus commerce by establishing a trustless financial primitive powered by smart contracts.
- **Decentralization**: Removing centralized marketplace fees and arbitrary intermediary controls.
- **Transaction Fairness**: Ensuring both buyers and sellers are fully protected throughout the trade lifecycle.
- **Fraud Reduction**: Eliminating common student peer-to-peer scams through robust on-chain fund locking.
- **Clean & Accessible Web3 UX**: Leveraging modern design languages like premium Glassmorphism to bridge the gap between complex blockchain logic and everyday student usability.

---

## ⚙️ Key Features

### 🧾 Create Escrow
The buyer initializes a contract instance on-chain, binding the specific transaction details: buyer address, seller address, token type, and target amount.

### 💰 Deposit Funds
The buyer transfers the required tokens into the smart contract's custody, shifting the escrow state to `Funded`.

### ✅ Confirm Transaction
Upon verifying the physical or digital asset delivery, the buyer triggers the release function, transferring the locked funds directly to the seller's wallet.

### ❌ Cancel Escrow
Allows the buyer to abort the transaction if conditions are unmet, securely reversing the locked funds back to the buyer's balance.

---

## 🧠 Smart Contract Details

- **Network**: Stellar Soroban Testnet
- **Contract ID**: `CBUZHV5NKXY2MMWY5OWTWWDXVK3JOWR5SKZIAYSY52P3DMVAA4PMJLRD`
- **On-Chain Transaction Hash**: [9a035d9451b7052342dc573f86cbd0357cf3c6296db1eb1d](https://stellar.expert/explorer/testnet/tx/9a035d9451b7052342dc573f86cbd0357cf3c6296db1eb1d)
- **Verified Contract Instance**: [Stellar Laboratory View](https://lab.stellar.org/r/testnet/contract/CBUZHV5NKXY2MMWY5OWTWWDXVK3JOWR5SKZIAYSY52P3DMVAA4PMJLRD)

---

## 🚀 Development Status

- ✅ **Core Logic**: Fully implemented state-machine lifecycle (Initialized → Funded → Released / Cancelled).
- ✅ **Security**: Robust access control verification utilizing Soroban's `require_auth()` primitives.
- ✅ **Testing**: Comprehensive local unit tests successfully passed (`cargo test`).
- ✅ **Deployment**: Successfully compiled to WASM and deployed live onto the Stellar Testnet.
- ✅ **Frontend UI**: Built using Next.js 14, integrated with `@stellar/freighter-api` and styled with an advanced, clean Glassmorphism aesthetic.

---

## 🛠 Tech Stack

- **Smart Contract Layer**: Rust, Soroban SDK
- **Frontend Framework**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS (Backdrop Blur Filters)
- **Web3 Integration**: `@stellar/freighter-api`, `@stellar/stellar-sdk`

---

## 👨‍💻 Author

**Muhammad Aqilla Ramadhan**
IPB University — Artificial Intelligence Student
