/**
 * GET /api/pay/:invoiceId
 * 
 * x402 Payment Protocol Endpoint
 * 
 * This endpoint implements the HTTP 402 payment protocol using Thirdweb's x402 SDK.
 * 
 * Flow:
 * 1. First request (no payment): Returns HTTP 402 with payment details in headers
 * 2. Wallet reads headers and prepares payment with signature
 * 3. Second request (with X-PAYMENT header): Verifies and processes payment
 * 4. On success: Returns HTTP 200 and marks invoice as paid
 * 
 * The payment is processed via ERC4337 UserOperation batching:
 * - Facilitator (Smart Account) executes the transaction
 * - Customer pays MNEE to merchant
 * - Gas fees are paid by facilitator (gasless for customer)
 * 
 * Payment receipt contains a Queue ID (UUID), not a blockchain transaction hash,
 * because payments go through a queue system for batching.
 */
import { NextRequest, NextResponse } from "next/server";
import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { getInvoiceById, markInvoicePaid } from "@/lib/invoiceRepository";
import { MNEE_ADDRESS, MNEE_DECIMALS, ETHEREUM_CHAIN_ID } from "@/lib/constants";

// Initialize Thirdweb client (only if credentials are available)
let client: ReturnType<typeof createThirdwebClient> | null = null;
let thirdwebFacilitator: ReturnType<typeof facilitator> | null = null;

if (process.env.THIRDWEB_SECRET_KEY && process.env.THIRDWEB_SERVER_WALLET_ADDRESS) {
  client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });

  thirdwebFacilitator = facilitator({
    client,
    serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  let invoice: Awaited<ReturnType<typeof getInvoiceById>> | null = null;
  
  try {
    const { invoiceId } = await params;
    console.log(`🔍 Looking up invoice: ${invoiceId}`);
    
    invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      console.error(`❌ Invoice not found: ${invoiceId}`);
      
      return NextResponse.json(
        { 
          error: "Invoice not found",
          invoiceId: invoiceId,
          message: `Invoice ${invoiceId} does not exist.`
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Invoice found: ${invoiceId}, status: ${invoice.status}, amount: ${invoice.amount}`);

    // This endpoint handles x402 payment protocol requests
    // Browser requests go to /pay/:invoiceId (page.tsx)
    // This route handles API/x402 requests with X-PAYMENT header

    // If invoice is already paid, return success
    if (invoice.status === "paid") {
      return NextResponse.json({
        status: "paid",
        message: "Invoice has already been paid",
        queueID: invoice.queueID,
        invoiceId: invoice.id,
      });
    }

    // Check if Thirdweb is configured
    if (!client || !thirdwebFacilitator) {
      return NextResponse.json(
        { 
          error: "Thirdweb not configured. Please set THIRDWEB_SECRET_KEY and THIRDWEB_SERVER_WALLET_ADDRESS in .env.local",
          invoiceId: invoice.id,
          amount: invoice.amount,
          currency: invoice.currency,
        },
        { status: 503 }
      );
    }

    // Get payment data from header (x-payment)
    const paymentData = request.headers.get("x-payment");

    // Log payment attempt
    if (paymentData) {
      console.log(`💳 Payment attempt for invoice ${invoiceId}, amount: ${invoice.amount} MNEE`);
    } else {
      console.log(`📋 Payment request (no payment data) for invoice ${invoiceId}`);
    }

    // Use Thirdweb's settlePayment to handle the x402 protocol
    // EIP712 configuration for MNEE token:
    // - name: Token name for EIP712 domain
    // - version: EIP712 domain version (typically "1" for ERC20 tokens)
    // - primaryType: Signature type - "Permit" (ERC-2612) or "TransferWithAuthorization" (ERC-3009)
    // Currently using "TransferWithAuthorization" (ERC-3009) as it's more commonly supported
    // If this doesn't work, try changing to "Permit" (ERC-2612)
    const result = await settlePayment({
      resourceUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/pay/${invoiceId}`,
      method: "GET",
      paymentData,
      payTo: invoice.merchantAddress,
      network: ethereum,
      price: {
        amount: invoice.amount,
        asset: {
          address: MNEE_ADDRESS,
          decimals: MNEE_DECIMALS,
          eip712: {
            name: "MNEE",
            version: "1",
            primaryType: "TransferWithAuthorization" as const, // ERC-3009 (used by USDC-like tokens)
          },
        },
      },
      facilitator: thirdwebFacilitator,
    });

    // Log result status for debugging
    console.log(`📊 Payment settlement result: status ${result.status}`);

    // If payment was successful (status 200), update invoice
    if (result.status === 200) {
      // Extract Queue ID from paymentReceipt
      // When status is 200, result has paymentReceipt with transaction info
      // The transaction field contains a Queue ID (UUID), not a blockchain transaction hash
      let queueID: string | undefined;
      let senderAddress: string | undefined;
      
      // Log the full result structure for debugging
      console.log('🔍 Payment result structure:', JSON.stringify(result, null, 2));
      
      // Extract sender address from payment data
      if (paymentData) {
        try {
          const decoded = JSON.parse(Buffer.from(paymentData, 'base64').toString());
          console.log('🔍 Decoded payment data:', JSON.stringify(decoded, null, 2));
          
          // Try to extract sender address from payment data
          // The address might be in various locations depending on the payment structure
          if (decoded.payload?.from) {
            senderAddress = decoded.payload.from;
          } else if (decoded.payload?.signer) {
            senderAddress = decoded.payload.signer;
          } else if (decoded.payload?.account) {
            senderAddress = decoded.payload.account;
          } else if (decoded.from) {
            senderAddress = decoded.from;
          } else if (decoded.signer) {
            senderAddress = decoded.signer;
          } else if (decoded.account) {
            senderAddress = decoded.account;
          }
          
          if (senderAddress) {
            console.log('✅ Extracted sender address from payment data:', senderAddress);
          } else {
            console.warn('⚠️ Sender address not found in payment data structure');
          }
        } catch (e) {
          console.warn('⚠️ Could not extract sender address from payment data:', e);
        }
      }
      
      // Also try to get sender from paymentReceipt if available
      if (!senderAddress && 'paymentReceipt' in result && result.paymentReceipt) {
        const receipt = result.paymentReceipt as any;
        // Check payer first (most common in x402 receipts)
        if (receipt.payer) {
          senderAddress = receipt.payer;
          console.log('✅ Extracted sender address from payment receipt (payer):', senderAddress);
        } else if (receipt.from) {
          senderAddress = receipt.from;
          console.log('✅ Extracted sender address from payment receipt (from):', senderAddress);
        } else if (receipt.signer) {
          senderAddress = receipt.signer;
          console.log('✅ Extracted sender address from payment receipt (signer):', senderAddress);
        } else if (receipt.account) {
          senderAddress = receipt.account;
          console.log('✅ Extracted sender address from payment receipt (account):', senderAddress);
        }
      }
      
      // Extract Queue ID from paymentReceipt
      if ('paymentReceipt' in result && result.paymentReceipt) {
        const receipt = result.paymentReceipt as any;
        
        console.log('🔍 Payment receipt structure:', JSON.stringify(receipt, null, 2));
        
        // The transaction field contains the Queue ID (UUID)
        if (receipt.transaction && typeof receipt.transaction === 'string') {
          queueID = receipt.transaction;
        }
      }

      // Mark invoice as paid with Queue ID and sender address
      // Always pass senderAddress if we extracted it (even if undefined, the function will handle it)
      if (queueID) {
        const success = await markInvoicePaid(invoiceId, queueID, senderAddress);
        if (success) {
          console.log(`✅ Payment successful for invoice ${invoiceId}, Queue ID: ${queueID}, Sender: ${senderAddress || 'not extracted'}`);
        } else {
          console.error(`❌ Failed to mark invoice ${invoiceId} as paid`);
        }
      } else {
        console.warn(`⚠️ Payment successful for invoice ${invoiceId} but Queue ID not found in paymentReceipt`);
        // Still mark as paid since payment was verified by settlePayment
        // Pass senderAddress if we have it
        const success = await markInvoicePaid(invoiceId, "payment-confirmed", senderAddress);
        if (success && senderAddress) {
          console.log(`✅ Invoice marked as paid with sender address: ${senderAddress}`);
        }
      }

      return NextResponse.json({
        status: "paid",
        message: "Payment successful",
        invoiceId: invoice.id,
        queueID: queueID || null,
        amount: invoice.amount,
        currency: invoice.currency,
      });
    }

    // Otherwise, return the 402 response with payment details
    // settlePayment handles generating the proper 402 headers
    // When status is not 200, result has responseBody and responseHeaders
    const responseBody = 'responseBody' in result ? result.responseBody : {};
    const responseHeaders = 'responseHeaders' in result ? result.responseHeaders : {};
    
    return NextResponse.json(responseBody, {
      status: result.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("❌ Error processing payment:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Failed to process payment",
        details: errorMessage,
        invoiceId: invoice?.id || "unknown",
        hint: "This might indicate that MNEE token doesn't support ERC-2612 Permit or ERC-3009 TransferWithAuthorization. Check the token contract on Etherscan."
      },
      { status: 500 }
    );
  }
}


