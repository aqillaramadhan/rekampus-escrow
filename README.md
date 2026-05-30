# 🔐 ReKampus Escrow DApp

A decentralized escrow smart contract solution built on the Stellar blockchain using the Soroban SDK. This project provides a secure, trustless, and transparent transaction system tailored for peer-to-peer campus marketplaces.

> **🚀 Live Demo:** [https://rekampus-escrow.vercel.app](https://rekampus-escrow.vercel.app)

---

## 📌 Project Description

**ReKampus Escrow DApp** solves the critical challenge of trust in peer-to-peer student transactions (such as buying used books, electronics, or campus services). Instead of relying on risky manual transfers or centralized third parties, funds are securely locked in an on-chain smart contract.

The contract acts as an immutable intermediary, automatically releasing funds to the seller only after the buyer confirms successful receipt of the goods, or facilitating an instant refund if the transaction is cancelled.

---

## 🎯 Project Vision

Our vision is to revolutionize digital campus commerce by establishing a trustless financial primitive powered by smart contracts.

* **Decentralization**: Removing centralized marketplace fees and arbitrary intermediary controls
* **Transaction Fairness**: Ensuring both buyers and sellers are fully protected throughout the trade lifecycle
* **Fraud Reduction**: Eliminating common student peer-to-peer scams through robust on-chain fund locking
* **Clean & Accessible Web3 UX**: Bridging complex blockchain logic with intuitive UI/UX

---

## ⚙️ Key Features

### 🧾 Create Escrow

The buyer initializes a contract instance on-chain, defining:

* Buyer address
* Seller address
* Token type
* Transaction amount

### 💰 Deposit Funds

The buyer deposits funds into the smart contract, transitioning the escrow state to `Funded`.

### ✅ Confirm Transaction

Once the buyer receives the item/service, they confirm the transaction, triggering the release of funds to the seller.

### ❌ Cancel Escrow

If conditions are not met, the buyer can cancel the escrow and retrieve their funds securely.

---

## 🧠 Smart Contract Details

* **Network**: Stellar Mainnet

* **Contract ID**:

  ```
  CCJYTXUBBJBCEI5KI7MRRIH7UMQIWSUPEZCG4VZETI54H6FY67TQ7D56
  ```

* **Transaction (Deployment Proof)**:
  https://stellar.expert/explorer/public/tx/79f7e866cd264eb7c632d97a5f6752f53ba10656665899da0ba3df599f80be31

* **Contract Explorer (Stellar Lab)**:
  https://lab.stellar.org/r/mainnet/contract/CCJYTXUBBJBCEI5KI7MRRIH7UMQIWSUPEZCG4VZETI54H6FY67TQ7D56

---

## 🚀 Development Status

* ✅ **Core Logic**: Fully implemented state-machine lifecycle (Initialized → Funded → Released / Cancelled)
* ✅ **Security**: Access control enforced using Soroban `require_auth()`
* ✅ **Testing**: Unit tests passed (`cargo test`)
* ✅ **Deployment**: Successfully deployed to **Stellar Mainnet**
* ✅ **Frontend UI**: Built with Next.js 14 + Freighter Wallet integration

---

## 🛠 Tech Stack

* **Smart Contract**: Rust, Soroban SDK
* **Frontend**: Next.js 14 (App Router), TypeScript
* **Styling**: Tailwind CSS (Glassmorphism UI)
* **Blockchain Integration**:

  * `@stellar/freighter-api`
  * `@stellar/stellar-sdk`

---

## ⚠️ Important Notes

* This application runs on **Stellar Mainnet**
* All transactions involve **real XLM (not testnet tokens)**
* Ensure your Freighter wallet is connected to **PUBLIC network** before interacting

---

## 👨‍💻 Author

**Muhammad Aqilla Ramadhan**
IPB University — Artificial Intelligence Student

---