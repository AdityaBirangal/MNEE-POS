import type { Metadata, Viewport } from "next";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import "./globals.css";

// Initialize Thirdweb client at layout level for persistence across pages
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export const metadata: Metadata = {
  title: "MNEE POS x402 - MNEE Stablecoin Payment System",
  description: "Point-of-sale system for accepting MNEE stablecoin payments using x402 on Ethereum",
  manifest: "/manifest.json",
  icons: {
    icon: "/MNEE_Logo.png",
    apple: "/MNEE_Logo.png",
    shortcut: "/MNEE_Logo.png",
  },
  openGraph: {
    title: "MNEE POS x402 - MNEE Stablecoin Payment System",
    description: "Point-of-sale system for accepting MNEE stablecoin payments using x402 on Ethereum",
    images: ["/MNEE_Logo.png"],
  },
  twitter: {
    card: "summary",
    title: "MNEE POS x402 - MNEE Stablecoin Payment System",
    description: "Point-of-sale system for accepting MNEE stablecoin payments using x402 on Ethereum",
    images: ["/MNEE_Logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}

