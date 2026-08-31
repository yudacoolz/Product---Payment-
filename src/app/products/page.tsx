import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

        <Link
          href="/products/new"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
