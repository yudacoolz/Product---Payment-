/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `imgUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `coverUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imgUrl",
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "galleryUrl" TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imgUrl",
ADD COLUMN     "coverUrl" TEXT NOT NULL;
