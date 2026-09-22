/*
  Warnings:

  - Added the required column `fileName` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
