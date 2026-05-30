# 🔐 ReKampus Escrow DApp

A decentralized escrow application built on the **Stellar Soroban smart contract platform**, enabling secure, trustless peer-to-peer transactions for campus communities.

> 🚀 **Live Demo:** https://rekampus-escrow.vercel.app

---

## 📌 Overview

ReKampus Escrow solves the trust problem in student-to-student transactions (e.g., buying used books, electronics, or services).

Instead of relying on manual transfers or centralized intermediaries, funds are securely held in an **on-chain escrow smart contract**, ensuring:

* Funds are only released when the buyer confirms receipt
* Refunds are guaranteed if the transaction is canceled
* No third-party intervention is required

---

## 🎯 Key Features

* 🔗 **Wallet Integration**
  Connect using Freighter Wallet (Stellar)

* 💰 **Deposit Funds**
  Buyer deposits XLM into the escrow smart contract

* ✅ **Confirm Transaction**
  Buyer confirms receipt → funds released to seller

* ❌ **Cancel Escrow**
  Buyer cancels → funds refunded securely

* ⚡ **On-Chain Execution**
  All actions executed directly on Stellar Mainnet

---

## 🔗 Frontend Interaction

Users can directly interact with the deployed smart contract via the web interface:

* Connect Freighter wallet
* Trigger smart contract functions (`deposit`, `confirm_received`, `cancel`)
* Sign transactions client-side
* Submit transactions to Stellar Mainnet

---

## 🧠 Smart Contract Details

* **Network**: Stellar Mainnet

* **Contract ID**:

```
CCJYTXUBBJBCEI5KI7MRRIH7UMQIWSUPEZCG4VZETI54H6FY67TQ7D56
```

* **Deployment Transaction**:
  https://stellar.expert/explorer/public/tx/79f7e866cd264eb7c632d97a5f6752f53ba10656665899da0ba3df599f80be31

* **Contract Explorer**:
  https://lab.stellar.org/r/mainnet/contract/CCJYTXUBBJBCEI5KI7MRRIH7UMQIWSUPEZCG4VZETI54H6FY67TQ7D56

---

## ⚙️ Tech Stack

* **Smart Contract**: Rust + Soroban SDK
* **Frontend**: Next.js 14 (App Router), TypeScript
* **Styling**: Tailwind CSS
* **Blockchain Integration**:

  * @stellar/freighter-api
  * @stellar/stellar-sdk

---

## 🚀 Development Status

* ✅ Smart contract deployed to **Mainnet**
* ✅ Core escrow lifecycle implemented (Initialized → Funded → Released / Cancelled)
* ✅ Freighter wallet integration working
* ✅ Transactions successfully submitted on-chain
* ✅ Functional frontend UI

---

## ⚠️ Important Notes

* This app runs on **Stellar Mainnet**
* Transactions use **real XLM (not testnet)**
* Make sure Freighter is set to **PUBLIC network**

---

## 👨‍💻 Author

**Muhammad Aqilla Ramadhan**
IPB University — Artificial Intelligence Student

---
