/**
 * MNEE POS x402 - Merchant Dashboard
 * Mobile-first POS interface for creating invoices and viewing payment status
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import Toast, { ToastType } from "./components/Toast";
import { MNEE_ADDRESS } from "@/lib/constants";
import "./globals.css";

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

function HomeContent() {
  const router = useRouter();
  const wallet = useActiveWallet();
  const [amount, setAmount] = useState<string>("0.05");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const createInvoice = async () => {
    if (!wallet?.getAccount()) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const merchantAddress = wallet.getAccount()?.address;
      if (!merchantAddress) {
        throw new Error("No wallet address found");
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: "MNEE",
          merchantAddress,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invoice");
      }

      const data = await response.json();
      showToast("Invoice created successfully!", "success");
      
      // Smooth redirect to invoice details page with fade transition
      setTimeout(() => {
        // Add fade-out effect
        const main = document.querySelector('main');
        if (main) {
          main.style.transition = 'opacity 0.3s ease-out';
          main.style.opacity = '0';
        }
        setTimeout(() => {
          router.push(`/invoice/${data.invoiceId}`);
        }, 300);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div 
        className="min-h-screen bg-gray-50 pb-8"
        style={{
          transition: 'opacity 0.3s ease-out',
        }}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10" style={{ marginTop: "1rem" }}>
          <div className="container">
            <div className="py-4 text-center">
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
                  MNEE POS x402
                </h1>
              </div>
              <p className="text-small" style={{ textAlign: "center" }}>
                Accept MNEE stablecoin payments with x402 on Sepolia
              </p>
            </div>
          </div>
        </header>

        <main className="container mt-6">
          {/* Wallet Connection */}
          <div className="card mb-6">
            <div className="text-center">
              <h2 className="text-heading" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                Connect Wallet
              </h2>
              <div style={{ display: "flex", justifyContent: "center" }}>
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
              {!wallet && (
                <p className="text-small mt-4" style={{ color: "#6b7280" }}>
                  Connect your wallet to start accepting payments
                </p>
              )}
            </div>
          </div>

          {/* Create Invoice Section */}
          <div className="card mb-6">
            <h2 className="text-heading" style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
              Create Invoice
            </h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <label 
                htmlFor="amount" 
                className="text-body" 
                style={{ 
                  display: "block", 
                  marginBottom: "0.5rem", 
                  fontWeight: "500",
                  fontSize: "0.875rem"
                }}
              >
                Amount (USD)
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input"
                disabled={loading}
                placeholder="1.00"
              />
            </div>

            <button
              onClick={createInvoice}
              disabled={loading || !wallet}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" style={{ width: "1rem", height: "1rem" }} fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Invoice"
              )}
            </button>

            {error && (
              <div 
                style={{ 
                  marginTop: "1rem",
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
          </div>

        </main>
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
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
