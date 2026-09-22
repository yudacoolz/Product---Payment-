"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { forEach } from "lodash";
import { createProduct, updateProduct } from "@/services/product.service";
import { storageUrl } from "@/lib/storage";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  console.log("load product data : ", product);
  const router = useRouter();

  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");

  const [description, setDescription] = useState(product?.description ?? "");

  const [price, setPrice] = useState<number | undefined>(product?.price);

  const [jumlah, setJumlah] = useState<number | undefined>(product?.jumlah);

  const [cover, setCover] = useState<File | null>(null);
  const [previewCover, setPreviewCover] = useState<string | null>(
    product?.coverUrl ? storageUrl(product.coverUrl) : null,
  );

  const [gallery, setGallery] = useState<File[]>([]);
  const [previewGallery, setPreviewGallery] = useState<string[]>(
    product?.galleryUrl?.map((key) => storageUrl(key)) ?? [],
  );

  const [loading, setLoading] = useState(false);
  const [errorPesan, setErrorPesan] = useState<string | null>(null);

  useEffect(() => {
    if (gallery.length === 0) {
      return;
    }

    const viewGallery = gallery.map((item) => URL.createObjectURL(item));
    setPreviewGallery(viewGallery);

    return () => {
      viewGallery.forEach((item) => URL.revokeObjectURL(item));
    };
  }, [gallery]);

  useEffect(() => {
    if (!cover) {
      return;
    }
    const viewCover = URL.createObjectURL(cover);
    setPreviewCover(viewCover);

    return () => {
      URL.revokeObjectURL(viewCover);
    };
  }, [cover]);

  console.log(cover);
  console.log(gallery);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("jumlah", String(jumlah));
    if (cover) {
      formData.append("coverUrl", cover);
    }
    if (gallery.length > 0) {
      gallery.forEach((item) => formData.append("galleryUrl", item));
    }

    console.log("formData: ", formData);

    try {
      const response = isEdit
        ? await updateProduct(product!.id, formData)
        : await createProduct(formData);

      console.log("response Product api :", response);

      router.push(`/products/${response.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setErrorPesan(message);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorPesan && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorPesan}
        </div>
      )}
      <div>
        <label className="mb-2 block font-medium">Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Jumlah</label>

        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Price</label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Cover</label>

        <input
          type="file"
          // value={cover}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setCover(file);
          }}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">Gallery</label>

        <input
          type="file"
          // value={price}
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setGallery(files);
          }}
          className="w-full rounded border p-2"
          required
        />

        {/* PREVIEW IMG */}
        {previewCover && (
          <img src={previewCover} className="rounded border w-40 h-40" />
        )}

        {previewGallery.length > 0 && (
          <div className="flex items-center gap-2">
            {previewGallery.map((item, i) => (
              <img key={i} src={item} className="rounded border w-40 h-40" />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
}
