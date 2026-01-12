<div align="center">
  <img src="public/MNEE_Logo.png" alt="MNEE POS x402 Logo" width="120" height="120">
  
  # MNEE POS x402
  
  A point-of-sale application that enables merchants to accept instant MNEE stablecoin payments using the **x402 HTTP-402 payment protocol** on Sepolia testnet.
  
  **MNEE Hackathon: Programmable Money for Agents, Commerce, and Automated Finance**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-mnee--pos--x402.birangal.com-blue)](https://mnee-pos-x402.birangal.com/)
</div>

---

## What is x402?

**x402** is the HTTP-402 payment protocol that enables seamless, programmatic payments on the web. In the modern world, **x402 is increasingly used by AI agents** for autonomous transactions, making it a critical infrastructure for the future of automated commerce and AI-driven financial interactions.

### Why x402 Support for MNEE Matters

**MNEE** is a USD-backed stablecoin live on Ethereum, designed for programmable money applications in commerce, AI automation, and financial coordination. Adding **x402 support to MNEE** will significantly enhance its utility by enabling:

- 🤖 **AI Agent Payments**: Allow AI agents to autonomously make payments using MNEE
- ⚡ **Instant Settlements**: Gasless transactions via ERC4337 UserOperation batching
- 🔒 **Secure Signatures**: Cryptographic payment authorization without manual approvals
- 🌐 **Web-Native Payments**: HTTP-based payment protocol that works seamlessly with web APIs

### x402 Payment Token Requirements

For x402 to work, the payment token must support either:

- **ERC-2612 Permit** (most ERC20 tokens) - Allows token approvals via signatures
- **ERC-3009 Sign with Authorization** (USDC on all chains) - Enables signed transfer authorizations

### Current MNEE Status

⚠️ **Important**: **MNEE does not currently support ERC-2612 Permit on mainnet**. The contract needs to be upgraded through a proxy to add Permit functionality.

This project demonstrates:
- ✅ **What's possible** once MNEE adds ERC-2612 Permit support
- ✅ **Complete x402 integration** ready for when the upgrade happens
- ✅ **Production-ready codebase** for merchants and AI agents
- ✅ **Sepolia testnet implementation** for testing and development

Once MNEE is upgraded with ERC-2612 Permit support, it will be fully compatible with the x402 protocol, enabling seamless integration with AI agents and automated payment systems.

---

## Links

- **Live Demo**: [https://mnee-pos-x402.birangal.com/](https://mnee-pos-x402.birangal.com/)
- **GitHub**: [https://github.com/AdityaBirangal/MNEE-POS](https://github.com/AdityaBirangal/MNEE-POS)
- **MNEE Contract**: `0x2F039630031C2C56E40bB9Ff729504E016765730` on Sepolia Testnet
- **Learn more about MNEE**: [https://mnee.io](https://mnee.io)
- **Hackathon**: [https://mnee-eth.devpost.com](https://mnee-eth.devpost.com)

---

## Overview

**MNEE POS x402** demonstrates how merchants can accept MNEE stablecoin payments using the x402 protocol, showcasing the power of programmable money for AI agents and automated commerce.

### Key Features

- ✅ **x402 Protocol Integration**: Full HTTP-402 payment protocol implementation
- ✅ **Ready for ERC-2612 Permit**: Codebase prepared for MNEE Permit upgrade
- ✅ **AI Agent Ready**: Designed for autonomous AI agent payments
- ✅ **Gasless Transactions**: ERC4337 UserOperation batching via facilitator
- ✅ **Invoice Management**: Create invoices with custom amounts
- ✅ **QR Code Payments**: Generate payment URLs and QR codes
- ✅ **Real-time Status**: Track payment status updates instantly
- ✅ **Modern UI**: Responsive, mobile-first design
- ✅ **Sepolia Testnet**: Working demonstration on testnet

### How x402 Works

The application uses **Thirdweb's x402 SDK** for payment processing:

1. **Payment Request**: Server returns HTTP 402 with payment details in headers
2. **Signature Generation**: Wallet/AI agent signs payment authorization (ERC-2612 Permit)
3. **Payment Processing**: Facilitator executes transaction via ERC4337 UserOperation batching
4. **Gasless Execution**: Customer pays MNEE to merchant, facilitator covers gas fees
5. **Instant Settlement**: Payment confirmed and invoice marked as paid

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Payment Protocol**: x402 HTTP 402 (via Thirdweb SDK v5)
- **Blockchain**: Sepolia Testnet
- **Token**: MNEE (6 decimals, contract: `0x2F039630031C2C56E40bB9Ff729504E016765730`)
- **Wallet Integration**: Thirdweb React SDK
- **Storage**: PostgreSQL (via Prisma)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Thirdweb account (for Client ID and Secret Key)
- Sepolia testnet wallet with MNEE for testing
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

## Technical Details

### x402 Implementation

This project implements the complete x402 payment flow:

- **HTTP 402 Response**: Server returns payment requirements in standard HTTP headers
- **EIP712 Signatures**: Payment authorization using ERC-2612 Permit signatures
- **ERC4337 Batching**: UserOperations are batched and executed by facilitator
- **Queue System**: Payments processed through queue (Queue ID returned, not blockchain tx hash)
- **Status Updates**: Real-time payment confirmation via database polling

### Payment Flow

```
1. Merchant creates invoice → Invoice stored in database
2. Customer visits payment URL → Server returns HTTP 402 with payment details
3. Wallet/AI agent signs payment → ERC-2612 Permit signature generated
4. Payment request sent → X-PAYMENT header contains signed authorization
5. Facilitator processes → ERC4337 UserOperation executed (gasless for customer)
6. Payment confirmed → Invoice status updated to "paid" in database
```

### Token Compatibility

**Current Status**: MNEE does not support ERC-2612 Permit on mainnet as of now. The contract needs to be upgraded through a proxy to add Permit functionality.

**Once Upgraded**, MNEE with ERC-2612 Permit will:
- ✅ Be compatible with x402 protocol requirements
- ✅ Support signature-based approvals (no on-chain approval needed)
- ✅ Work seamlessly with AI agents and automated systems
- ✅ Enable gasless payment flows via ERC4337

**This Project**: Demonstrates the complete x402 integration that will be possible once MNEE adds ERC-2612 Permit support. The codebase is production-ready and will work immediately after the contract upgrade.

## Use Cases

### For Merchants
- Accept MNEE payments with zero gas fees (paid by facilitator)
- Generate payment links and QR codes instantly
- Track payments in real-time
- Modern, mobile-friendly POS interface

### For AI Agents
- Autonomous payment processing via x402 protocol
- Programmatic invoice creation and payment
- HTTP-based API integration
- Gasless transactions for cost-effective operations

### For Developers
- Complete x402 implementation reference
- ERC-2612 Permit integration example
- ERC4337 UserOperation batching demonstration
- Production-ready codebase

## Hackathon Category

This project is submitted under the **Commerce & Creator Tools** category of the MNEE Hackathon, demonstrating:

- ✅ **x402 Protocol Integration**: Full HTTP-402 payment protocol implementation
- ✅ **Future MNEE Compatibility**: Ready for ERC-2612 Permit upgrade (contract upgrade required)
- ✅ **AI Agent Ready**: Designed for autonomous AI agent payments
- ✅ **Real-world Commerce**: Point-of-sale infrastructure for merchants
- ✅ **Programmable Money**: Showcasing the future of automated financial transactions
- ✅ **Production-Ready Code**: Complete implementation ready for when MNEE adds Permit support

### Roadmap to Mainnet

For MNEE to support x402 on mainnet:
1. **Contract Upgrade**: MNEE contract must be upgraded through proxy to add ERC-2612 Permit
2. **Deploy**: This POS application can be deployed immediately after Permit support is added
3. **Enable AI Agents**: Once Permit is live, AI agents can autonomously pay with MNEE via x402
