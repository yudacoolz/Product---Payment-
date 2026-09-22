/*
  Warnings:

  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CartItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
ALTER COLUMN "cartId" DROP DEFAULT,
ALTER COLUMN "cartId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("cartId");
DROP SEQUENCE "Cart_cartId_seq";

-- AlterTable
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_pkey",
ALTER COLUMN "cartId" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ALTER COLUMN "cartItemId" DROP DEFAULT,
ALTER COLUMN "cartItemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cartItemId");
DROP SEQUENCE "CartItem_cartItemId_seq";

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ALTER COLUMN "orderItemid" DROP DEFAULT,
ALTER COLUMN "orderItemid" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemid");
DROP SEQUENCE "OrderItem_orderItemid_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
