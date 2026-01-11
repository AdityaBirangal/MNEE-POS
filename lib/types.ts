/**
 * Invoice data model for MNEE POS
 */
export interface Invoice {
  id: string;
  amount: string; // Amount in MNEE (18 decimals, e.g., "1000000000000000000" = $1.00)
  currency: string; // "MNEE"
  status: "pending" | "paid";
  merchantAddress: string; // Receiver address (merchant)
  senderAddress?: string; // Sender address (customer/payer) - set when payment is made
  createdAt: Date;
  updatedAt: Date;
  queueID?: string; // Queue ID from x402 payment receipt
  paymentUrl: string;
}

export interface CreateInvoiceRequest {
  amount: number; // Amount in dollars (e.g., 1.00)
  currency?: string; // Optional, defaults to "MNEE"
  merchantAddress: string;
}

export interface InvoiceStatusResponse {
  invoiceId: string;
  status: "pending" | "paid";
  queueID?: string;
  amount: string;
  currency: string;
  receiverAddress?: string; // Merchant address (receiver)
  senderAddress?: string; // Customer address (sender) - only available after payment
}
