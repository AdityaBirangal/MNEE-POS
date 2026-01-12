/**
 * MNEE POS x402 - Landing Page
 * Comprehensive landing page explaining the platform and highlighting x402 features
 */
"use client";

import { useRouter } from "next/navigation";
import Header from "./components/Header";
import "./globals.css";

function HomeContent() {
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen" style={{ 
        background: "linear-gradient(to bottom, #ffffff 0%, #f9fafb 100%)"
      }}>
        {/* Header */}
        <Header />

        <main>
          {/* Hero Section */}
          <section className="container" style={{ 
            paddingTop: "5rem", 
            paddingBottom: "5rem",
            position: "relative"
          }}>
            <div className="text-center" style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
              <div style={{ 
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}>
                <div style={{ 
                  padding: "0.5rem 1.25rem",
                  backgroundColor: "var(--color-amber-50)",
                  borderRadius: "50px",
                  border: "1px solid var(--color-amber-200)",
                  textAlign: "center",
                  display: "inline-block"
                }}>
                  <span className="text-small" style={{ 
                    color: "var(--color-amber-700)",
                    fontWeight: "600"
                  }}>
                    ⚡ Powered by x402 Protocol
                  </span>
                </div>
              </div>
              
              <h2 className="text-heading" style={{ 
                fontSize: "clamp(2rem, 5vw, 3.5rem)", 
                fontWeight: "800", 
                marginBottom: "1.5rem",
                lineHeight: "1.1",
                color: "#111827",
                textAlign: "center"
              }}>
                Accept Payments with{" "}
                <span style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "#d97706",
                  display: "inline-block",
                  fontWeight: "800"
                }}>
                  MNEE Stablecoin
                </span>
              </h2>
              
              <p className="text-body" style={{ 
                fontSize: "1.25rem", 
                color: "#6b7280", 
                marginBottom: "2.5rem",
                lineHeight: "1.7",
                maxWidth: "700px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center"
              }}>
                A modern point-of-sale system powered by the <strong style={{ color: "var(--color-amber-700)" }}>x402 payment protocol</strong>. 
                Accept instant, gasless payments from customers and AI agents using MNEE stablecoin.
              </p>
              
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => router.push("/create")}
                  className="btn btn-primary"
                  style={{ 
                    fontSize: "1.1rem", 
                    padding: "1rem 2.5rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 14px 0 rgba(251, 191, 36, 0.39)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px 0 rgba(251, 191, 36, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(251, 191, 36, 0.39)";
                  }}
                >
                  Get Started →
                </button>
                <a
                  href="https://github.com/AdityaBirangal/MNEE-POS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ 
                    fontSize: "1.1rem", 
                    padding: "1rem 2.5rem",
                    backgroundColor: "white",
                    color: "#374151",
                    border: "2px solid #e5e7eb",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </section>

          {/* x402 Feature Highlight */}
          <section className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%)",
              border: "2px solid var(--color-amber-300)",
              borderRadius: "24px",
              padding: "3rem 2rem",
              boxShadow: "0 10px 40px rgba(251, 191, 36, 0.15)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-10%",
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)",
                borderRadius: "50%"
              }}></div>
              
              <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 1 }}>
                <div style={{ 
                  fontSize: "4rem", 
                  padding: "1.5rem",
                  background: "linear-gradient(135deg, var(--color-amber-100) 0%, var(--color-amber-200) 100%)",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 8px 24px rgba(251, 191, 36, 0.3)"
                }}>
                  ⚡
                </div>
                <p className="text-body" style={{ 
                  fontSize: "1.2rem", 
                  color: "#4b5563",
                  maxWidth: "750px",
                  margin: "0 auto",
                  lineHeight: "1.7"
                }}>
                  <strong style={{ color: "var(--color-amber-800)" }}>x402</strong> is the HTTP-402 payment protocol used by AI agents for autonomous transactions. 
                  It enables seamless, programmatic payments on the web without traditional payment gateways.
                </p>
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(2, 1fr)", 
                gap: "1.5rem",
                marginTop: "2rem",
                position: "relative",
                zIndex: 1
              }}
              className="x402-cards-grid"
              >
                {[
                  { icon: "🤖", title: "AI Agent Ready", desc: "AI agents can autonomously make payments using x402 protocol, perfect for automated commerce." },
                  { icon: "⚡", title: "Gasless Payments", desc: "Customers pay zero gas fees. Transactions are batched and processed by facilitators." },
                  { icon: "🔒", title: "Secure Signatures", desc: "Payments are authorized with cryptographic signatures, ensuring security and authenticity." },
                  { icon: "🌐", title: "Web-Native", desc: "HTTP-based protocol that works seamlessly with web APIs and modern applications." }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    style={{ 
                      padding: "2rem", 
                      backgroundColor: "white", 
                      borderRadius: "16px",
                      border: "1px solid var(--color-amber-200)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease",
                      cursor: "default"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(251, 191, 36, 0.2)";
                      e.currentTarget.style.borderColor = "var(--color-amber-400)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                      e.currentTarget.style.borderColor = "var(--color-amber-200)";
                    }}
                  >
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{feature.icon}</div>
                    <h4 className="text-heading" style={{ fontSize: "1.3rem", marginBottom: "0.5rem", fontWeight: "700" }}>
                      {feature.title}
                    </h4>
                    <p className="text-small" style={{ color: "#6b7280", lineHeight: "1.6" }}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <h3 className="text-heading" style={{ 
                fontSize: "2.5rem", 
                fontWeight: "800",
                marginBottom: "1rem",
                color: "#111827"
              }}>
                How It Works
              </h3>
              <p className="text-body" style={{ 
                fontSize: "1.1rem", 
                color: "#6b7280",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                Simple, fast, and secure payment processing in three easy steps
              </p>
          </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "2rem",
              position: "relative"
            }}
            className="how-it-works-grid"
            >
              {[
                { 
                  number: "1", 
                  title: "Create Invoice", 
                  desc: "Merchants create an invoice with the payment amount. A unique payment URL and QR code are generated instantly.",
                  color: "var(--color-amber-500)"
                },
                { 
                  number: "2", 
                  title: "Customer Pays", 
                  desc: "Customer visits the payment URL, connects their wallet, and signs the payment authorization using x402 protocol.",
                  color: "var(--color-amber-600)"
                },
                { 
                  number: "3", 
                  title: "Instant Settlement", 
                  desc: "Payment is processed via ERC4337 batching. MNEE is transferred instantly, and the invoice is marked as paid.",
                  color: "var(--color-amber-700)"
                }
              ].map((step, idx) => (
                <div 
                  key={idx}
                  className="card" 
                style={{ 
                    textAlign: "center",
                    padding: "2.5rem 2rem",
                    position: "relative",
                    transition: "all 0.3s ease",
                    border: "2px solid transparent"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(251, 191, 36, 0.2)";
                    e.currentTarget.style.borderColor = step.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <div style={{ 
                    fontSize: "3.5rem", 
                    fontWeight: "800",
                    width: "90px",
                    height: "90px",
                    margin: "0 auto 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}25 100%)`,
                    borderRadius: "50%",
                    border: `3px solid ${step.color}40`,
                    color: step.color
                  }}>
                    {step.number}
                  </div>
                  <h4 className="text-heading" style={{ 
                    fontSize: "1.5rem", 
                    marginBottom: "1rem",
                    fontWeight: "700",
                    color: "#111827"
                  }}>
                    {step.title}
                  </h4>
                  <p className="text-body" style={{ 
                    color: "#6b7280",
                    lineHeight: "1.7",
                    fontSize: "1rem"
                  }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h3 className="text-heading" style={{ 
                fontSize: "2.5rem", 
                fontWeight: "800",
                marginBottom: "1rem",
                color: "#111827"
              }}>
                Benefits
              </h3>
              <p className="text-body" style={{ 
                fontSize: "1.1rem", 
                color: "#6b7280"
              }}>
                Designed for both merchants and customers
              </p>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
              gap: "2rem"
            }}>
              {[
                {
                  title: "For Merchants",
                  icon: "🏪",
                  benefits: [
                    "Zero gas fees for customers (paid by facilitator)",
                    "Instant payment processing",
                    "QR code and payment link generation",
                    "Real-time payment status tracking",
                    "Mobile-friendly interface"
                  ]
                },
                {
                  title: "For Customers",
                  icon: "👤",
                  benefits: [
                    "Pay with MNEE stablecoin (USD-backed)",
                    "No gas fees - transactions are gasless",
                    "Simple wallet connection and payment",
                    "Instant payment confirmation",
                    "Download payment receipt as PDF"
                  ]
                }
              ].map((group, idx) => (
                <div 
                  key={idx}
                  className="card" 
                  style={{ 
                    padding: "2.5rem",
                    background: idx === 0 
                      ? "linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)"
                      : "white",
                    border: `2px solid ${idx === 0 ? "var(--color-amber-200)" : "#e5e7eb"}`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  <div style={{ 
                    fontSize: "3rem", 
                    marginBottom: "1rem",
                    display: "inline-block"
                  }}>
                    {group.icon}
                  </div>
                  <h4 className="text-heading" style={{ 
                    fontSize: "1.75rem", 
                    marginBottom: "1.5rem",
                    fontWeight: "700"
                  }}>
                    {group.title}
                  </h4>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {group.benefits.map((benefit, bidx) => (
                      <li 
                        key={bidx}
                style={{ 
                          padding: "0.75rem 0", 
                          display: "flex", 
                          alignItems: "start", 
                          gap: "0.75rem",
                          borderBottom: bidx < group.benefits.length - 1 ? "1px solid #f3f4f6" : "none"
                        }}
                      >
                        <span style={{ 
                          color: "var(--color-amber-600)",
                          fontSize: "1.25rem",
                          fontWeight: "bold",
                          flexShrink: 0,
                          marginTop: "0.125rem"
                        }}>
                          ✓
                        </span>
                        <span className="text-body" style={{ lineHeight: "1.6" }}>
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>


          {/* Footer Info */}
          <section className="container" style={{ paddingTop: "4rem", paddingBottom: "5rem" }}>
            <div className="card" style={{ 
              textAlign: "center", 
              maxWidth: "900px", 
              margin: "0 auto",
              padding: "3rem 2.5rem",
              background: "linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)",
              border: "2px solid var(--color-amber-200)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
              <h4 className="text-heading" style={{ 
                fontSize: "2rem", 
                marginBottom: "1rem",
                fontWeight: "700",
                color: "#111827"
              }}>
                About MNEE
              </h4>
              <p className="text-body" style={{ 
                color: "#4b5563", 
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                lineHeight: "1.7",
                maxWidth: "700px",
                marginLeft: "auto",
                marginRight: "auto"
              }}>
                MNEE is a USD-backed stablecoin live on Ethereum, designed for programmable money applications 
                in commerce, AI automation, and financial coordination.
              </p>
              <div style={{ 
                padding: "1rem 1.5rem",
                backgroundColor: "rgba(251, 191, 36, 0.1)",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid var(--color-amber-300)"
              }}>
                <p className="text-small" style={{ color: "#6b7280", margin: 0 }}>
                  <strong style={{ color: "var(--color-amber-800)" }}>Note:</strong> MNEE does not currently support ERC-2612 Permit on mainnet. 
                  The contract needs to be upgraded through a proxy. This project demonstrates what's possible 
                  once Permit support is added.
                </p>
              </div>
              <div style={{ 
                marginTop: "2rem", 
                display: "flex", 
                gap: "1.5rem", 
                justifyContent: "center", 
                flexWrap: "wrap" 
              }}>
                <a 
                  href="https://mnee.io" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body"
                  style={{ 
                    color: "var(--color-amber-700)", 
                    textDecoration: "none",
                    fontWeight: "600",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-amber-100)";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  Learn more about MNEE →
                </a>
                <span style={{ color: "#d1d5db", alignSelf: "center" }}>•</span>
                <a 
                  href="https://github.com/AdityaBirangal/MNEE-POS" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body"
                  style={{ 
                    color: "var(--color-amber-700)", 
                    textDecoration: "none",
                    fontWeight: "600",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--color-amber-100)";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  View Source Code →
                </a>
              </div>
          </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .x402-cards-grid {
            grid-template-columns: 1fr !important;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .how-it-works-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .how-it-works-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
