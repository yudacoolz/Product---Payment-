-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'MERCHANT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "snap_token" TEXT NOT NULL DEFAULT 'unknown';

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);
