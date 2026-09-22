"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteProductButtonProps {
  productId: string;
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
      className="flex items-center gap-2 rounded-full border-2 border-red-200 bg-background px-5 py-3 font-semibold text-red-600 shadow-sm transition duration-200 hover:scale-102 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg active:scale-100 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
