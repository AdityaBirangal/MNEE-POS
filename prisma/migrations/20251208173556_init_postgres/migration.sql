-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USDC',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "merchantAddress" TEXT NOT NULL,
    "senderAddress" TEXT,
    "queueID" TEXT,
    "paymentUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invoices_merchantAddress_idx" ON "invoices"("merchantAddress");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
