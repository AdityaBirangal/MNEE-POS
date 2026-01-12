/**
 * Invoice Details Page
 * Shows invoice information with QR code prominently displayed first
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import StatusBadge from "@/app/components/StatusBadge";
import QRCodeCard from "@/app/components/QRCodeCard";
import Toast, { ToastType } from "@/app/components/Toast";

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

function InvoiceDetailsContent({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const wallet = useActiveWallet();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"pending" | "paid" | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
        setStatus(data.status);
        
        // Show success toast when payment is received
        if (data.status === "paid" && status === "pending") {
          showToast("Payment received! 🎉", "success");
        }
      } else {
        throw new Error("Invoice not found");
      }
    } catch (err) {
      showToast("Failed to load invoice", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId]);

  // Poll status every 3 seconds if invoice is pending
  useEffect(() => {
    if (!invoiceId || status !== "pending") return;

    const interval = setInterval(() => {
      fetchInvoice();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, status]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner" style={{
            border: "4px solid #f3f4f6",
            borderTop: "4px solid var(--color-amber-400)",
            borderRadius: "50%",
            width: "48px",
            height: "48px",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
          }}></div>
          <p className="text-body" style={{ color: "#6b7280" }}>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card" style={{ maxWidth: "500px", textAlign: "center" }}>
          <h2 className="text-heading" style={{ marginBottom: "1rem" }}>Invoice Not Found</h2>
          <p className="text-body" style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
            The invoice you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="btn btn-primary"
          >
            Create New Invoice
          </button>
        </div>
      </div>
    );
  }

  const amountDollars = (parseInt(invoice.amount) / 1000000).toFixed(2);
  const paymentUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin}/pay/${invoiceId}`;

  return (
    <>
      <div 
        className="min-h-screen bg-gray-50 pb-8"
        style={{
          animation: 'fadeIn 0.3s ease-in',
        }}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10" style={{ marginTop: "1rem" }}>
          <div className="container">
            <div className="py-4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <img 
                      src="/MNEE_Logo.png" 
                      alt="MNEE POS x402" 
                      style={{ width: "2.75rem", height: "2.75rem", borderRadius: "8px" }}
                    />
                    <h1 className="text-title" style={{ 
                      background: "linear-gradient(135deg, var(--color-amber-400) 0%, var(--color-amber-600) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      margin: 0,
                      fontSize: "1.5rem"
                    }}>
                      MNEE POS x402
                    </h1>
                  </div>
                  <p className="text-small" style={{ color: "#6b7280" }}>
                  Accept MNEE stablecoin payments with x402 on Sepolia
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    width: "auto",
                    minWidth: "auto",
                    flexShrink: 0
                  }}
                >
                  ← Back
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mt-6">
          {/* QR Code - Displayed First */}
          <div className="card mb-6" style={{ textAlign: "center" }}>
            <QRCodeCard
              value={paymentUrl}
              title="Payment QR Code"
              description="Scan with your wallet to pay"
            />
          </div>

          {/* Invoice Details */}
          <div className="card mb-6">
            <h2 className="text-heading" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Invoice Information
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Amount */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f9fafb", 
                borderRadius: "8px",
                border: "1px solid #e5e7eb"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p className="text-small" style={{ color: "#6b7280", marginBottom: "0.25rem" }}>
                      Amount
                    </p>
                    <p className="text-heading" style={{ fontSize: "2rem", fontWeight: "bold", color: "#111827" }}>
                      ${amountDollars}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: "1.25rem", 
                    fontWeight: "600", 
                    color: "#6b7280" 
                  }}>
                    {invoice.currency}
                  </div>
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
                <StatusBadge status={status || "pending"} size="large" />
              </div>

              {/* Invoice ID */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <span className="text-small" style={{ color: "#6b7280", fontWeight: "500" }}>
                  Invoice ID
                </span>
                <code style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "#f3f4f6", 
                  borderRadius: "6px", 
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  color: "#111827"
                }}>
                  {invoiceId}
                </code>
              </div>

              {/* Payment URL */}
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                gap: "0.5rem"
              }}>
                <span className="text-small" style={{ color: "#6b7280", fontWeight: "500" }}>
                  Payment Link
                </span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}>
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      color: "var(--color-amber-600)",
                      textDecoration: "underline",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {paymentUrl}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentUrl);
                      showToast("Payment link copied!", "success");
                    }}
                    style={{
                      padding: "0.75rem 1rem",
                      backgroundColor: "var(--color-amber-400)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Timestamps */}
              {invoice.createdAt && (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  gap: "0.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb"
                }}>
                  <span className="text-small" style={{ color: "#6b7280" }}>
                    Created: {new Date(invoice.createdAt).toLocaleString()}
                  </span>
                  {invoice.updatedAt && invoice.updatedAt !== invoice.createdAt && (
                    <span className="text-small" style={{ color: "#6b7280" }}>
                      Updated: {new Date(invoice.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              {/* Queue ID (if paid) */}
              {invoice.queueID && (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  gap: "0.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb"
                }}>
                  <span className="text-small" style={{ color: "#6b7280", fontWeight: "500" }}>
                    Payment Queue ID
                  </span>
                  <code style={{ 
                    padding: "0.75rem", 
                    backgroundColor: "#f3f4f6", 
                    borderRadius: "6px", 
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    color: "#111827"
                  }}>
                    {invoice.queueID}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                onClick={fetchInvoice}
                className="btn"
                style={{
                  backgroundColor: "#6c757d",
                  color: "white"
                }}
              >
                Refresh Status
              </button>
              <button
                onClick={() => router.push("/")}
                className="btn btn-primary"
              >
                Create New Invoice
              </button>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

export default function InvoiceDetailsPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    params.then((p) => setInvoiceId(p.invoiceId));
  }, [params]);

  if (!mounted || !invoiceId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <InvoiceDetailsContent invoiceId={invoiceId} />;
}

