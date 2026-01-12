/**
 * MNEE POS x402 - Create Invoice Page
 * Merchant dashboard for creating invoices
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet } from "thirdweb/react";
import Toast, { ToastType } from "../components/Toast";
import Header from "../components/Header";
import { MNEE_ADDRESS } from "@/lib/constants";
import "../globals.css";

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export default function CreateInvoicePage() {
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
      
      setTimeout(() => {
        router.push(`/invoice/${data.invoiceId}`);
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header showBackButton={true} backButtonText="← Back to Home" />

        <main className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 className="text-heading" style={{ fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>
              Create Invoice
            </h2>
            <p className="text-body" style={{ color: "#6b7280", textAlign: "center", marginBottom: "2rem" }}>
              Generate a payment link and QR code to accept MNEE stablecoin payments
            </p>

            {/* Wallet Connection */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 className="text-heading" style={{ fontSize: "1.25rem", marginBottom: "1rem", textAlign: "center" }}>
                Step 1: Connect Your Wallet
              </h3>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="connect-button-wrapper">
                  <ConnectButton 
                    client={client}
                    detailsButton={{
                      displayBalanceToken: {
                        11155111: MNEE_ADDRESS,
                      },
                    }}
                  />
                </div>
              </div>
              {!wallet && (
                <p className="text-small mt-2" style={{ color: "#6b7280", textAlign: "center" }}>
                  Connect your wallet to start accepting payments
                </p>
              )}
            </div>

            {/* Create Invoice */}
            {wallet && (
              <div>
                <h3 className="text-heading" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                  Step 2: Enter Payment Amount
                </h3>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="amount" 
                    className="text-body" 
                    style={{ 
                      display: "block", 
                      marginBottom: "0.5rem", 
                      fontWeight: "500"
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
                  <p className="text-small" style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                    The amount will be converted to MNEE stablecoin (6 decimals)
                  </p>
                </div>

                <button
                  onClick={createInvoice}
                  disabled={loading || !wallet}
                  className="btn btn-primary"
                  style={{ width: "100%", fontSize: "1.1rem", padding: "0.875rem 1.5rem" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" style={{ width: "1rem", height: "1rem", display: "inline-block", marginRight: "0.5rem" }} fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Invoice...
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
            )}
          </div>

          {/* Info Section */}
          <div className="card" style={{ maxWidth: "600px", margin: "2rem auto 0", backgroundColor: "#f9fafb" }}>
            <h4 className="text-heading" style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
              💡 How it works
            </h4>
            <ol style={{ paddingLeft: "1.5rem", color: "#6b7280" }}>
              <li className="text-body" style={{ marginBottom: "0.5rem" }}>
                Connect your wallet (merchant address)
              </li>
              <li className="text-body" style={{ marginBottom: "0.5rem" }}>
                Enter the payment amount in USD
              </li>
              <li className="text-body" style={{ marginBottom: "0.5rem" }}>
                Get a unique payment URL and QR code
              </li>
              <li className="text-body">
                Share with customers - they pay with MNEE via x402 protocol
              </li>
            </ol>
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
