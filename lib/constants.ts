/**
 * Network and Token Constants for MNEE POS
 * 
 * Configuration for Sepolia Testnet:
 * - Chain ID: 11155111 (Sepolia Testnet)
 * - MNEE Contract: 0x2F039630031C2C56E40bB9Ff729504E016765730
 * - MNEE Decimals: 6 (USD-backed stablecoin, similar to USDC)
 * 
 * MNEE is a USD-backed stablecoin live on Ethereum.
 * Learn more at https://mnee.io
 */
export const ETHEREUM_CHAIN_ID = 11155111;

// MNEE token address on Sepolia testnet
// Contract: 0x2F039630031C2C56E40bB9Ff729504E016765730
export const MNEE_ADDRESS = "0x2F039630031C2C56E40bB9Ff729504E016765730" as `0x${string}`;

// MNEE has 6 decimals (USD-backed stablecoin)
export const MNEE_DECIMALS = 6;

// API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

