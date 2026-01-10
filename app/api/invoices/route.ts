/**
 * POST /api/invoices
 * Creates a new invoice
 */
import { NextRequest, NextResponse } from "next/server";
import { createInvoice } from "@/lib/invoiceRepository";
import { CreateInvoiceRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceRequest = await request.json();

    // Validate required fields
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be greater than 0." },
        { status: 400 }
      );
    }

    if (!body.merchantAddress) {
      return NextResponse.json(
        { error: "merchantAddress is required." },
        { status: 400 }
      );
    }

    // Create invoice in database
    const invoice = await createInvoice(body);

    // Return invoice details
    return NextResponse.json({
      invoiceId: invoice.id,
      amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      paymentUrl: invoice.paymentUrl,
      createdAt: invoice.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

