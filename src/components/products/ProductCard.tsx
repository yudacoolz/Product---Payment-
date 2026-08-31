import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-lg border border-white p-5">
      <h2 className="text-xl font-semibold">{product.name}</h2>

      <p className="mt-2 text-gray-600">{product.description}</p>

      <p className="mt-3 font-bold">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      <Link
        href={`/products/${product.id}`}
        className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
      >
        View
      </Link>
    </div>
  );
}
