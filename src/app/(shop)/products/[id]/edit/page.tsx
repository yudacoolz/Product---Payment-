import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/products/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Edit Product</h1>

      <ProductForm product={product} />
    </main>
  );
}
