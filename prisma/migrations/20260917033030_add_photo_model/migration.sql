/*
  Warnings:

  - Added the required column `imgUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PhotoCategory" AS ENUM ('PRODUCTS', 'USER');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('COVER', 'GALLERY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imgUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "refId" TEXT NOT NULL,
    "category" "PhotoCategory" NOT NULL,
    "type" "PhotoType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);
