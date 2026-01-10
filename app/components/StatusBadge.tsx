/**
 * StatusBadge Component
 * Displays payment status with visual indicator
 */
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: "pending" | "paid";
  size?: "small" | "medium" | "large";
}

export default function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status]} ${styles[size]}`}>
      {status === "paid" ? (
        <>
          <svg className={styles.icon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>PAID</span>
        </>
      ) : (
        <>
          <svg className={`${styles.icon} ${styles.spinning}`} fill="none" viewBox="0 0 24 24">
            <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>PENDING</span>
        </>
      )}
    </span>
  );
}

