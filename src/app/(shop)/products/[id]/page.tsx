import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { notFound } from "next/navigation";
import DeleteProductButton from "@/components/products/DeleteProductButton";
import BuyProductButton from "@/components/products/BuyProductButton";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const productId = Number(id);

  if (!Number.isInteger(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[3fr_2fr]">
        {/* LEFT SIDE: image placeholder (product has no image yet) */}
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-subtle font-serif text-9xl text-muted lg:sticky lg:top-6">
          {product.name.charAt(0).toUpperCase()}
        </div>

        {/* RIGHT SIDE: info */}
        <div className="flex flex-col gap-4">
          {product.jumlah <= 5 && (
            <p className="text-sm font-semibold text-accent">
              Only {product.jumlah} left
            </p>
          )}

          <p className="text-3xl font-bold">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <h1 className="text-xl">{product.name}</h1>

          <p className="text-sm text-muted">Jumlah : {product.jumlah}</p>

          <BuyProductButton
            product={product}
            // productId={product.id}
            // productName={product.name}
            // price={product.price}
          />

          {/* item details */}
          <div className="border-t border-line pt-4">
            <h2 className="text-lg font-semibold">Item details</h2>
            <p className="mt-2 whitespace-pre-line text-muted">
              {product.description || "No description yet."}
            </p>
          </div>

          {/* edit / delete */}
          <div className="flex gap-3 border-t border-line pt-4">
            <Link
              href={`/products/${product.id}/edit`}
              className="flex items-center gap-2 rounded-full bg-subtle px-5 py-3 font-semibold hover:bg-line"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>

            <DeleteProductButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
