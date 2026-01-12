/**
 * Consistent Header Component
 * Used across all pages with clickable logo
 */
"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonPath?: string;
}

export default function Header({ 
  showBackButton = false, 
  backButtonText = "← Back",
  backButtonPath = "/"
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container">
        <div style={{ paddingTop: "1.5rem", paddingBottom: "1rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: showBackButton ? "space-between" : "center", 
            gap: "0.75rem",
            flexWrap: "wrap"
          }}>
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.75rem",
                cursor: "pointer",
                flexShrink: 0
              }}
              onClick={() => router.push("/")}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <img 
                src="/MNEE_Logo.png" 
                alt="MNEE POS x402" 
                style={{ 
                  width: "3.5rem", 
                  height: "3.5rem", 
                  borderRadius: "10px",
                  flexShrink: 0
                }}
              />
              <h1 style={{ 
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "#d97706",
                margin: 0,
                fontSize: "1.75rem",
                fontWeight: "700",
                lineHeight: "1.2",
                display: "flex",
                alignItems: "center"
              }}>
                MNEE POS x402
              </h1>
            </div>
            
            {showBackButton && (
              <button
                onClick={() => router.push(backButtonPath)}
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e5e7eb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
              >
                {backButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
