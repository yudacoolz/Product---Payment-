import ProductCard from "@/components/products/ProductCard";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/services/product.service";

export default async function ProductsPage() {
  const products = await getProducts();
  console.log("products: ", products);

  return (
    <main className="mx-auto max-w-7xl px-6 py-6">
      {/* toolbar: pill buttons like etsy filter row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="mr-2 font-serif text-3xl">Products</h1>

          <Link
            href="/products/new"
            className="flex items-center gap-2 rounded-full bg-subtle px-5 py-3 font-semibold hover:bg-line"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
            Add Product
          </Link>
        </div>

        <p className="text-muted">{products.length} items</p>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
