"use client";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Pencil } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import DeleteProductButton from "@/components/products/DeleteProductButton";
import BuyProductButton from "@/components/products/BuyProductButton";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { getProductById } from "@/services/product.service";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();

  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProductById(productId);
      setProduct(res);
    };

    fetchData();
  }, [productId]);

  if (!product) {
    return <div>Loading....</div>;
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

      {/* LEFT SIDE: image placeholder (product has no image yet) */}
      <div className=" rounded-2xl bg-subtle font-serif text-9xl text-muted ">
        <div className="mb-5">
          {product?.coverUrl ? (
            <img src={product.coverUrl} className="w-full max-w-100 h-96" />
          ) : (
            product.name.charAt(0).toUpperCase()
          )}
        </div>

        <div className="w-full flex items-center flex-wrap gap-3">
          {product.galleryUrl.map((item) => (
            <img src={item} className="w-full max-w-40 h-40 rounded-lg" />
          ))}
        </div>
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
    </main>
  );
}
