/**
 * QRCodeCard Component
 * Displays QR code in a polished container
 */
"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import styles from './QRCodeCard.module.css';

interface QRCodeCardProps {
  value: string;
  title?: string;
  description?: string;
}

export default function QRCodeCard({ value, title = "QR Code", description = "Scan with your wallet to pay" }: QRCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      
      <div className={styles.qrContainer}>
        <div className={styles.qrWrapper}>
          <QRCodeSVG 
            value={value} 
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
      </div>
    </div>
  );
}

