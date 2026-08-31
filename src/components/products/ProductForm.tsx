"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();

  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");

  const [description, setDescription] = useState(product?.description ?? "");

  const [price, setPrice] = useState(product?.price.toString() ?? "");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";

      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const data = await response.json();

      router.push(`/products/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <label className="mb-2 block font-medium">Price</label>

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
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
