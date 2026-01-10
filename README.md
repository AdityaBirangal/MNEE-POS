<div align="center">
  <img src="public/MNEE_Logo.png" alt="MNEE POS Logo" width="120" height="120">
  
  # MNEE POS
  
  A point-of-sale application that lets merchants accept instant MNEE stablecoin payments using the x402 HTTP-402 payment protocol on Ethereum.
  
  **MNEE Hackathon: Programmable Money for Agents, Commerce, and Automated Finance**
</div>

---

## Links

- **GitHub**: [https://github.com/AdityaBirangal/MNEE-POS](https://github.com/AdityaBirangal/MNEE-POS)
- **MNEE Contract**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF` on Ethereum
- **Learn more about MNEE**: [https://mnee.io](https://mnee.io)
- **Hackathon**: [https://mnee-eth.devpost.com](https://mnee-eth.devpost.com)

---

## Overview

MNEE POS enables merchants to:
- Create invoices with custom amounts
- Generate payment URLs and QR codes
- Accept MNEE stablecoin payments via x402 protocol
- Track payment status in real-time

The application uses **Thirdweb's x402 SDK** for payment processing, which handles:
- ERC4337 UserOperation batching (gasless transactions)
- Payment signature verification
- Automatic payment settlement

**MNEE** is a USD-backed stablecoin live on Ethereum, designed for programmable money applications in commerce, AI automation, and financial coordination.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Payment Protocol**: x402 HTTP 402 (via Thirdweb SDK v5)
- **Blockchain**: Ethereum Mainnet
- **Token**: MNEE (6 decimals, contract: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`)
- **Wallet Integration**: Thirdweb React SDK
- **Storage**: PostgreSQL (via Prisma)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Thirdweb account (for Client ID and Secret Key)
- Ethereum mainnet wallet with MNEE for testing
- Facilitator wallet (ERC4337 Smart Account) with ETH for gas

### Installation

```bash
git clone https://github.com/AdityaBirangal/MNEE-POS
cd MNEE-POS
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```env
# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
THIRDWEB_SECRET_KEY=your_secret_key_here

# Facilitator Wallet (ERC4337 Smart Account address)
THIRDWEB_SERVER_WALLET_ADDRESS=0x...

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Database
DATABASE_URL=your_database_url
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- ✅ Invoice creation with custom amounts
- ✅ Payment URL and QR code generation
- ✅ Real-time payment status updates
- ✅ x402 HTTP 402 payment protocol
- ✅ Gasless transactions (via ERC4337 facilitator)
- ✅ Wallet integration (Thirdweb)
- ✅ Modern, responsive UI
- ✅ Database persistence (PostgreSQL)
- ✅ MNEE stablecoin integration on Ethereum

## Hackathon Category

This project is submitted under the **Commerce & Creator Tools** category of the MNEE Hackathon, demonstrating:
- Checkout and payment acceptance using MNEE stablecoin
- Point-of-sale infrastructure for merchants
- Real-world commerce application using programmable money
