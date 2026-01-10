/**
 * Network and Token Constants for MNEE POS
 * 
 * Configuration for Ethereum Mainnet:
 * - Chain ID: 1 (Ethereum Mainnet)
 * - MNEE Contract: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
 * - MNEE Decimals: 6 (USD-backed stablecoin, similar to USDC)
 * 
 * MNEE is a USD-backed stablecoin live on Ethereum.
 * Learn more at https://mnee.io
 */
export const ETHEREUM_CHAIN_ID = 1;

// MNEE token address on Ethereum mainnet
// Contract: 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF
export const MNEE_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF" as `0x${string}`;

// MNEE has 6 decimals (USD-backed stablecoin)
export const MNEE_DECIMALS = 6;

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

