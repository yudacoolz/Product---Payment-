import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      <p className="mt-4 text-gray-600">{product.description}</p>

      <p className="mt-4 text-xl font-bold">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/products/${product.id}/edit`}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Edit
        </Link>

        <BuyProductButton
          product={product}
          // productId={product.id}
          // productName={product.name}
          // price={product.price}
        />

        <DeleteProductButton productId={product.id} />
      </div>
    </main>
  );
}
