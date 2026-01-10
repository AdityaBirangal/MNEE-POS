/**
 * GET /api/invoices/:id/status
 * Returns the current status of an invoice
 * 
 * This endpoint provides real-time payment status:
 * - "pending": Invoice created but not paid yet
 * - "paid": Payment successful, includes queue ID
 */
import { NextRequest, NextResponse } from "next/server";
import { getInvoiceById } from "@/lib/invoiceRepository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Return comprehensive status information
    const response = {
      invoiceId: invoice.id,
      status: invoice.status,
      amount: invoice.amount,
      currency: invoice.currency,
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      receiverAddress: invoice.merchantAddress, // Merchant address (receiver)
      ...(invoice.senderAddress && { senderAddress: invoice.senderAddress }), // Customer address (sender)
      ...(invoice.queueID && { queueID: invoice.queueID }),
      ...(invoice.status === "paid" && invoice.queueID && {
        paymentConfirmed: true,
        paymentUrl: invoice.paymentUrl,
      }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching invoice status:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice status" },
      { status: 500 }
    );
  }
}

