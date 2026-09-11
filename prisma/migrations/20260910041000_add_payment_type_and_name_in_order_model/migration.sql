-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment_name" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "payment_type" TEXT NOT NULL DEFAULT 'unknown';
