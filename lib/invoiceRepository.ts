/**
 * Invoice Repository
 * 
 * Database-backed invoice operations using Prisma.
 * Replaces the in-memory storage with persistent SQLite storage.
 */
import { prisma } from "@/lib/db/prisma";
import { Invoice, CreateInvoiceRequest } from "@/lib/types";
import { dollarsToMNEE } from "@/lib/invoices";
import { API_BASE_URL } from "@/lib/constants";
import { randomBytes } from "crypto";

/**
 * Generate a 10-character uppercase hex invoice ID
 */
function generateInvoiceId(): string {
  // Generate 5 random bytes (10 hex characters)
  return randomBytes(5).toString("hex").toUpperCase();
}

/**
 * Create a new invoice in the database
 * 
 * @param request - Invoice creation request with amount, currency, and merchant address
 * @param baseUrl - Base URL for generating payment URL (defaults to API_BASE_URL)
 * @returns Created invoice
 */
export async function createInvoice(
  request: CreateInvoiceRequest,
  baseUrl: string = API_BASE_URL
): Promise<Invoice> {
  const amountUSDC = dollarsToMNEE(request.amount);
  const invoiceId = generateInvoiceId();
  const paymentUrl = `${baseUrl}/pay/${invoiceId}`;

  // Create invoice with generated 10-character uppercase hex ID
  const invoice = await prisma.invoice.create({
    data: {
      id: invoiceId,
      amount: amountUSDC,
      currency: request.currency || "MNEE",
      status: "pending",
      merchantAddress: request.merchantAddress,
      paymentUrl: paymentUrl,
    },
  });

  console.log(`✅ Invoice created in DB: ${invoice.id}`);
  return mapPrismaInvoiceToInvoice(invoice);
}

/**
 * Get invoice by ID
 * 
 * @param id - Invoice ID (10-character uppercase hex)
 * @returns Invoice if found, null otherwise
 */
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    console.log(`⚠️ Invoice not found in DB: ${id}`);
    return null;
  }

  return mapPrismaInvoiceToInvoice(invoice);
}

/**
 * Mark invoice as paid and update with payment details
 * 
 * @param id - Invoice ID (10-character hex)
 * @param queueID - Queue ID from x402 payment receipt
 * @param senderAddress - Optional sender address (customer/payer)
 * @returns true if invoice was found and updated, false otherwise
 */
export async function markInvoicePaid(
  id: string,
  queueID: string,
  senderAddress?: string
): Promise<boolean> {
  try {
    const updateData: {
      status: "paid";
      queueID: string;
      senderAddress?: string | null;
    } = {
      status: "paid",
      queueID,
    };

    // Always set senderAddress if provided (even if empty string, we want to update it)
    if (senderAddress !== undefined) {
      // Convert empty string to null for database (Prisma expects null, not empty string)
      updateData.senderAddress = senderAddress || null;
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    console.log(`✅ Invoice marked as paid in DB: ${id}, Queue ID: ${queueID}, Sender: ${senderAddress || 'not provided'}`);
    return !!updated;
  } catch (error) {
    // Invoice not found or other error
    console.error(`❌ Failed to mark invoice as paid: ${id}`, error);
    return false;
  }
}

/**
 * List invoices by merchant address
 * 
 * @param merchantAddress - Merchant wallet address
 * @returns Array of invoices for the merchant
 */
export async function listInvoicesByMerchant(
  merchantAddress: string
): Promise<Invoice[]> {
  const invoices = await prisma.invoice.findMany({
    where: { merchantAddress },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map(mapPrismaInvoiceToInvoice);
}

/**
 * Map Prisma Invoice model to our Invoice type
 * Converts Prisma's string status to our string union type
 */
function mapPrismaInvoiceToInvoice(prismaInvoice: {
  id: string;
  amount: string;
  currency: string;
  status: string; // Prisma returns string, we'll cast to "pending" | "paid"
  merchantAddress: string;
  senderAddress: string | null;
  queueID: string | null;
  paymentUrl: string;
  createdAt: Date;
  updatedAt: Date;
}): Invoice {
  return {
    id: prismaInvoice.id,
    amount: prismaInvoice.amount,
    currency: prismaInvoice.currency,
    status: prismaInvoice.status as "pending" | "paid", // Type assertion since we control the values
    merchantAddress: prismaInvoice.merchantAddress,
    senderAddress: prismaInvoice.senderAddress || undefined,
    queueID: prismaInvoice.queueID || undefined,
    paymentUrl: prismaInvoice.paymentUrl,
    createdAt: prismaInvoice.createdAt,
    updatedAt: prismaInvoice.updatedAt,
  };
}

