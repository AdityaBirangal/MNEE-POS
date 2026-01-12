/**
 * Customer Payment Page
 * Mobile-first payment interface for customers
 */
"use client";

import { useState, useEffect, useRef } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { createNormalizedFetch } from "@/lib/payment";
import { ETHEREUM_CHAIN_ID, MNEE_ADDRESS } from "@/lib/constants";
import StatusBadge from "@/app/components/StatusBadge";
import Toast, { ToastType } from "@/app/components/Toast";
import jsPDF from "jspdf";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

function PaymentPageContent({ invoiceId }: { invoiceId: string }) {
  const wallet = useActiveWallet();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paid" | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const downloadInvoicePDF = async () => {
    if (!invoice || !invoiceRef.current) return;

    try {
      const { default: html2canvas } = await import("html2canvas");
      
      // Show loading toast
      showToast("Generating PDF...", "info");

      // Capture the invoice section
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`invoice-${invoiceId}.pdf`);

      showToast("Invoice downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to generate PDF", "error");
    }
  };

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}/status`);
        if (response.ok) {
          const data = await response.json();
          setInvoice(data);
          setPaymentStatus(data.status as "pending" | "paid");
          setLoading(false);
        } else {
          setError("Invoice not found");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load invoice");
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!wallet) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    if (!invoice) {
      showToast("Invoice data not loaded. Please refresh the page.", "error");
      return;
    }

    setPaying(true);
    setError(null);

    try {
      // Convert amount from MNEE units (6 decimals) to BigInt
      const amountBigInt = BigInt(invoice.amount);

      // Create normalized fetch for signature normalization
      const normalizedFetch = createNormalizedFetch(ETHEREUM_CHAIN_ID);

      // Wrap fetch with payment handling
      const fetchWithPayment = wrapFetchWithPayment(
        normalizedFetch,
        client,
        wallet,
        {
          maxValue: amountBigInt,
        }
      );

      // Make payment request to API endpoint
      console.log(`Making payment request to /api/pay/${invoiceId}`);
      const response = await fetchWithPayment(`/api/pay/${invoiceId}`);
      const data = await response.json();

      console.log('Payment response:', { status: response.status, data });

      if (response.status === 200) {
        setPaymentStatus("paid");
        
        // Get sender address from wallet
        const senderAddress = wallet?.getAccount()?.address;
        
        // Refresh invoice to get updated data including addresses
        const statusResponse = await fetch(`/api/invoices/${invoiceId}/status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          // Ensure receiver address is set (merchant address)
          if (!statusData.receiverAddress && statusData.merchantAddress) {
            statusData.receiverAddress = statusData.merchantAddress;
          }
          // If sender address not in response but we have it from wallet, use it
          if (!statusData.senderAddress && senderAddress) {
            statusData.senderAddress = senderAddress;
          }
          setInvoice(statusData);
        } else {
          // Fallback: update with available data
          setInvoice((prev: any) => ({
            ...prev,
            status: "paid",
            queueID: data.queueID,
            senderAddress: senderAddress || prev.senderAddress,
            receiverAddress: prev.receiverAddress || prev.merchantAddress || invoice.merchantAddress,
          }));
        }
        
        showToast("Payment successful! 🎉", "success");
      } else {
        const errorMsg = data.error || `Payment failed with status ${response.status}`;
        setError(errorMsg);
        showToast(errorMsg, "error");
        console.error('Payment error:', errorMsg, data);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment error";
      setError(errorMsg);
      showToast(errorMsg, "error");
      console.error('Payment exception:', err);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <div style={{ textAlign: "center" }}>
          <div className="animate-spin" style={{ width: "3rem", height: "3rem", margin: "0 auto 1rem", border: "4px solid #e5e7eb", borderTopColor: "var(--color-amber-400)", borderRadius: "50%" }}></div>
          <p className="text-body">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <div className="card" style={{ maxWidth: "400px", margin: "0 1rem" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
            <h1 className="text-heading" style={{ color: "#dc2626", marginBottom: "1rem" }}>Error</h1>
            <p className="text-body">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Convert MNEE amount to dollars for display
  const amountDollars = invoice ? (parseInt(invoice.amount) / 1000000).toFixed(2) : "0.00";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "1rem 0 2rem" }}>
      <div className="container">
        <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          {(paymentStatus === "paid") || (invoice?.status === "paid") ? (
            <div>
              {/* Success Header */}
              <div style={{ textAlign: "center", padding: "2rem 0 1.5rem", borderBottom: "2px solid #e5e7eb" }}>
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                <h1 className="text-heading" style={{ color: "#166534", marginBottom: "0.5rem" }}>
                  Payment Successful!
                </h1>
                <p className="text-body" style={{ color: "#6b7280" }}>
                  Your payment has been processed successfully
                </p>
              </div>

              {/* Invoice Details */}
              <div ref={invoiceRef} style={{ padding: "2rem 0", backgroundColor: "#ffffff" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <img 
                      src="/MNEE_Logo.png" 
                      alt="MNEE POS x402" 
                      style={{ width: "2.25rem", height: "2.25rem", borderRadius: "6px" }}
                    />
                    <h2 className="text-heading" style={{ fontSize: "1.5rem", margin: 0 }}>
                      Invoice Receipt
                    </h2>
                  </div>
                  <p className="text-small" style={{ color: "#6b7280" }}>
                    MNEE POS x402 - MNEE Stablecoin Payment
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Invoice ID */}
                  <div style={{ 
                    padding: "1rem", 
                    backgroundColor: "#f9fafb", 
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <div className="text-small" style={{ color: "#6b7280", marginBottom: "0.5rem", fontWeight: "500" }}>
                      Invoice ID
                    </div>
                    <code style={{ 
                      fontSize: "1rem",
                      fontFamily: "monospace",
                      color: "#111827",
                      fontWeight: "600"
                    }}>
                      {invoiceId}
                    </code>
                  </div>

                  {/* Amount */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f0fdf4", 
                    borderRadius: "8px",
                    border: "2px solid #86efac",
                    textAlign: "center"
                  }}>
                    <div className="text-small" style={{ color: "#166534", marginBottom: "0.5rem", fontWeight: "500" }}>
                      Amount Paid
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#166534" }}>
                      ${amountDollars}
                    </div>
                    <div style={{ fontSize: "1rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      {invoice.currency}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#f9fafb",
                    borderRadius: "8px"
                  }}>
                    <span className="text-body" style={{ fontWeight: "500" }}>Status:</span>
                    <StatusBadge status="paid" size="large" />
                  </div>

                  {/* Payment Details */}
                  <div style={{ 
                    padding: "1.5rem", 
                    backgroundColor: "#f9fafb", 
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <h3 className="text-heading" style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                      Payment Details
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="text-small" style={{ color: "#6b7280" }}>Payment Date:</span>
                        <span className="text-body" style={{ fontWeight: "500" }}>
                          {invoice.updatedAt ? new Date(invoice.updatedAt).toLocaleString() : new Date().toLocaleString()}
                        </span>
                      </div>
                      {invoice.createdAt && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span className="text-small" style={{ color: "#6b7280" }}>Invoice Date:</span>
                          <span className="text-body" style={{ fontWeight: "500" }}>
                            {new Date(invoice.createdAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {/* Sender Address (Customer/Payer) */}
                      {invoice.senderAddress && (
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <span className="text-small" style={{ color: "#6b7280" }}>From (Sender):</span>
                          <code style={{ 
                            fontSize: "0.875rem",
                            fontFamily: "monospace",
                            color: "#111827",
                            fontWeight: "500",
                            wordBreak: "break-all",
                            textAlign: "right"
                          }}>
                            {invoice.senderAddress}
                          </code>
                        </div>
                      )}
                      
                      {/* Receiver Address (Merchant) */}
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                        <span className="text-small" style={{ color: "#6b7280" }}>To (Receiver):</span>
                        <code style={{ 
                          fontSize: "0.875rem",
                          fontFamily: "monospace",
                          color: "#111827",
                          fontWeight: "500",
                          wordBreak: "break-all",
                          textAlign: "right"
                        }}>
                          {invoice.receiverAddress || invoice.merchantAddress || "N/A"}
                        </code>
                      </div>
                      
                      {invoice.queueID && (
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                          <span className="text-small" style={{ color: "#6b7280" }}>Transaction ID:</span>
                          <code style={{ 
                            fontSize: "0.875rem",
                            fontFamily: "monospace",
                            color: "var(--color-amber-600)",
                            wordBreak: "break-all"
                          }}>
                            {invoice.queueID}
                          </code>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="text-small" style={{ color: "#6b7280" }}>Network:</span>
                        <span className="text-body" style={{ fontWeight: "500" }}>
                          Sepolia Testnet
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className="text-small" style={{ color: "#6b7280" }}>Payment Method:</span>
                        <span className="text-body" style={{ fontWeight: "500" }}>
                          x402 Protocol
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ 
                    padding: "1rem", 
                    textAlign: "center",
                    borderTop: "1px solid #e5e7eb",
                    marginTop: "1rem"
                  }}>
                    <p className="text-small" style={{ color: "#6b7280" }}>
                      Thank you for your payment!
                    </p>
                    <p className="text-small" style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
                      This is a receipt for your records
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div style={{ padding: "1.5rem 0 0", textAlign: "center", borderTop: "2px solid #e5e7eb" }}>
                <button
                  onClick={downloadInvoicePDF}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "1rem",
                    padding: "0.875rem 1.5rem"
                  }}
                >
                  <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Invoice PDF
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <img 
                    src="/MNEE_Logo.png" 
                    alt="MNEE POS x402" 
                    style={{ width: "3.5rem", height: "3.5rem", borderRadius: "10px" }}
                  />
                  <h1 className="text-title" style={{ 
                    background: "linear-gradient(135deg, var(--color-amber-400) 0%, var(--color-amber-600) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    margin: 0
                  }}>
                    MNEE POS x402 Payment
                  </h1>
                </div>
                <p className="text-small">Pay with MNEE stablecoin using x402 on Sepolia</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2rem" }}>
                <div>
                  <div className="text-small" style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
                    Invoice ID
                  </div>
                  <div 
                    className="p-3 rounded-lg font-mono text-sm" 
                    style={{ 
                      backgroundColor: "#f9fafb", 
                      color: "var(--color-amber-600)",
                      fontWeight: "600",
                      wordBreak: "break-all"
                    }}
                  >
                    {invoiceId}
                  </div>
                </div>

                <div>
                  <div className="text-small" style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
                    Amount
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "700", color: "#111827" }}>
                    ${amountDollars} <span style={{ fontSize: "1rem", color: "#6b7280", fontWeight: "400" }}>MNEE</span>
                  </div>
                </div>

                <div>
                  <div className="text-small" style={{ marginBottom: "0.5rem", fontWeight: "500" }}>
                    Status
                  </div>
                  <StatusBadge status={paymentStatus || "pending"} size="medium" />
                </div>
              </div>

              <div style={{ marginBottom: "2rem", textAlign: "center" }}>
                <div className="connect-button-wrapper">
                  <ConnectButton 
                    client={client}
                    detailsButton={{
                      displayBalanceToken: {
                        11155111: MNEE_ADDRESS, // Chain ID for Sepolia Testnet
                      },
                    }}
                  />
                </div>
              </div>

              {error && (
                <div 
                  style={{ 
                    marginBottom: "1rem",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#fef2f2",
                    color: "#991b1b",
                    border: "1px solid #fecaca"
                  }}
                >
                  <p className="text-small">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={!wallet || paying || invoice?.status === "paid"}
                className="btn btn-primary"
                style={{ width: "100%" }}
              >
                {paying ? (
                  <>
                    <svg className="animate-spin" style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : invoice?.status === "paid" ? (
                  "Already Paid"
                ) : (
                  "Pay with Wallet"
                )}
              </button>

              <p className="text-small" style={{ marginTop: "1rem", textAlign: "center", color: "#6b7280" }}>
                Make sure your wallet is connected to Sepolia testnet
              </p>
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const [invoiceId, setInvoiceId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setInvoiceId(p.invoiceId));
  }, [params]);

  if (!invoiceId) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <p className="text-body">Loading...</p>
      </div>
    );
  }

  return <PaymentPageContent invoiceId={invoiceId} />;
}
