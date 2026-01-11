/**
 * Network and Token Constants for MNEE POS
 * 
 * Configuration for Ethereum Mainnet:
 * - Chain ID: 1 (Ethereum Mainnet)
 * - MNEE Contract: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
 * - MNEE Decimals: 18 (as per Etherscan: https://etherscan.io/token/0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf)
 * 
 * IMPORTANT: MNEE token does NOT support ERC-2612 (permit) or ERC-3009 (transferWithAuthorization).
 * This means gasless payments via x402 are not possible with MNEE.
 * 
 * MNEE is a USD-backed stablecoin live on Ethereum.
 * Learn more at https://mnee.io
 */
export const ETHEREUM_CHAIN_ID = 1;

// MNEE token address on Ethereum mainnet
// Contract: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
// Etherscan: https://etherscan.io/token/0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf
export const MNEE_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as `0x${string}`;

// MNEE has 18 decimals (as confirmed on Etherscan)
export const MNEE_DECIMALS = 18;

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

