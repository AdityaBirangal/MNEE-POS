/**
 * Invoice utility functions for MNEE POS
 * 
 * Helper functions for invoice amount conversion and formatting.
 */
import { Invoice, CreateInvoiceRequest } from "./types";
import { randomBytes } from "crypto";
import { MNEE_DECIMALS, API_BASE_URL } from "./constants";

// In-memory store: Map<invoiceId, Invoice>
// Use globalThis to ensure the store persists across Next.js module reloads
declare global {
  // eslint-disable-next-line no-var
  var __invoiceStore: Map<string, Invoice> | undefined;
}

const invoiceStore = globalThis.__invoiceStore || new Map<string, Invoice>();

if (!globalThis.__invoiceStore) {
  globalThis.__invoiceStore = invoiceStore;
}

/**
 * Convert dollar amount to MNEE units (with 18 decimals)
 * Example: 1.00 -> "1000000000000000000"
 */
export function dollarsToMNEE(amount: number): string {
  return Math.floor(amount * 10 ** MNEE_DECIMALS).toString();
}

// Legacy export for backward compatibility
export const dollarsToUSDC = dollarsToMNEE;

/**
 * Generate a short, URL-friendly invoice ID
 */
function generateInvoiceId(): string {
  // Generate 8-character hex ID
  return randomBytes(4).toString("hex");
}

/**
 * Create a new invoice
 */
export function createInvoice(
  request: CreateInvoiceRequest,
  baseUrl: string = API_BASE_URL
): Invoice {
  const invoiceId = generateInvoiceId();
  const amountUSDC = dollarsToMNEE(request.amount);
  const now = new Date();

  const invoice: Invoice = {
    id: invoiceId,
    amount: amountUSDC,
    currency: request.currency || "MNEE",
    status: "pending",
    merchantAddress: request.merchantAddress,
    createdAt: now,
    updatedAt: now,
    paymentUrl: `${baseUrl}/pay/${invoiceId}`,
  };

  invoiceStore.set(invoiceId, invoice);
  console.log(`✅ Invoice created: ${invoiceId}, total invoices: ${invoiceStore.size}`);
  return invoice;
}

/**
 * Get invoice by ID
 */
export function getInvoice(invoiceId: string): Invoice | undefined {
  const invoice = invoiceStore.get(invoiceId);
  if (!invoice) {
    console.log(`⚠️ Invoice not found: ${invoiceId}, total invoices: ${invoiceStore.size}`);
  }
  return invoice;
}

/**
 * Update invoice status to paid
 */
export function markInvoiceAsPaid(invoiceId: string, queueID: string, senderAddress?: string): boolean {
  const invoice = invoiceStore.get(invoiceId);
  if (!invoice) {
    return false;
  }

  invoice.status = "paid";
  invoice.queueID = queueID;
  if (senderAddress) {
    invoice.senderAddress = senderAddress;
  }
  invoice.updatedAt = new Date();
  
  invoiceStore.set(invoiceId, invoice);
  return true;
}

/**
 * Get all invoices (for debugging/admin purposes)
 */
export function getAllInvoices(): Invoice[] {
  return Array.from(invoiceStore.values());
}

/**
 * Check if an invoice exists and is paid
 */
export function isInvoicePaid(invoiceId: string): boolean {
  const invoice = invoiceStore.get(invoiceId);
  return invoice?.status === "paid" || false;
}
