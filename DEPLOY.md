# ReKampus Escrow — Deploy & Test Guide

## Prerequisites

```bash
# 1. Install Rust + WASM target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# 2. Install the Stellar CLI (formerly Soroban CLI)
cargo install --locked stellar-cli --features opt

# 3. Verify
stellar --version   # should print stellar 21.x.x or similar
```

---

## 1 — Build the Contract

```bash
cd rekampus/contracts/escrow

stellar contract build
# WASM output: target/wasm32-unknown-unknown/release/rekampus_escrow.wasm
```

---

## 2 — Set Up Testnet Identity

```bash
# Generate a keypair and fund it from Friendbot
stellar keys generate --global alice --network testnet
stellar keys fund alice --network testnet

stellar keys generate --global bob --network testnet
stellar keys fund bob --network testnet

# Verify balances
stellar network use testnet
stellar account show alice
```

---

## 3 — Deploy the Contract

```bash
WASM=target/wasm32-unknown-unknown/release/rekampus_escrow.wasm

CONTRACT_ID=$(stellar contract deploy \
  --wasm $WASM \
  --source alice \
  --network testnet)

echo "Contract ID: $CONTRACT_ID"
# Save this — you'll need it for every invocation.
```

---

## 4 — Get a Testnet Token Address (USDC SAC)

For hackathon purposes, use the Testnet USDC Stellar Asset Contract:

```bash
# The issuer address is known — derive the SAC address:
USDC_SAC=$(stellar contract id asset \
  --asset USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5 \
  --network testnet)

echo "USDC SAC: $USDC_SAC"
```

> **Alternative:** Use any classic asset you create yourself on testnet.

---

## 5 — Invoke Functions

### create_escrow

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  create_escrow \
  --buyer  $(stellar keys address alice) \
  --seller $(stellar keys address bob) \
  --token  $USDC_SAC \
  --amount 500
```

### deposit (buyer sends funds)

```bash
# Alice (buyer) must first approve the contract to spend on her behalf.
# With SAC tokens you can do this via the token contract:
stellar contract invoke \
  --id $USDC_SAC \
  --source alice \
  --network testnet \
  -- \
  approve \
  --from    $(stellar keys address alice) \
  --spender $CONTRACT_ID \
  --amount  500 \
  --expiration_ledger 99999999

# Now deposit
stellar contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  deposit
```

### confirm_received (buyer releases funds to seller)

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  confirm_received
```

### cancel (optional refund)

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  cancel
```

### get_escrow (read state, no auth needed)

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- \
  get_escrow
```

---

## 6 — Run Unit Tests Locally

```bash
cd rekampus/contracts/escrow

cargo test
# Expected output:
# test test::test_full_happy_path   ... ok
# test test::test_cancel_refunds_buyer ... ok
```

---

## Architecture at a Glance

```
Buyer ──create_escrow──► Contract (Initialized)
Buyer ──deposit──────────► Contract (Funded) ← tokens locked here
Buyer ──confirm_received──► Seller receives tokens (Released)
       OR
Buyer ──cancel───────────► Buyer refunded (Cancelled)
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `HostError: Error(Contract, #1)` | Auth failed | Make sure `--source` matches the expected caller |
| `Escrow already exists` | `create_escrow` called twice | Deploy a new contract instance per deal |
| `insufficient balance` | Buyer doesn't have enough tokens | Fund alice via Friendbot / transfer USDC |
| `No escrow found` | `deposit` called before `create_escrow` | Check invocation order |

---

## Hackathon Tips

- **One contract instance = one escrow deal.** Deploy a fresh contract per transaction (very cheap on Stellar).
- The `get_escrow` function is free to call (no auth, no fee) — great for your front-end polling.
- Use `soroban-sdk`'s `testutils` feature for fast local iteration before going to testnet.
- Stellar testnet resets every ~3 months — save your Contract IDs in a `.env` file.
