"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProductButtonProps {
  productId: number;
}

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
