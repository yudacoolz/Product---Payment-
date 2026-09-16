import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Create Product</h1>

      <ProductForm />
    </main>
  );
}
