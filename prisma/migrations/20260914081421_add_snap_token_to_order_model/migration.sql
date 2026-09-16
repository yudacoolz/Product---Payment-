-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "snap_token" DROP NOT NULL,
ALTER COLUMN "snap_token" DROP DEFAULT;
