import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  jumlah: number;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    // whole card is clickable, like etsy
    <Link href={`/products/${product.id}`} className="group block">
      {/* image placeholder (product has no image yet) */}
      <div className="flex aspect-4/5 items-center justify-center rounded-lg bg-subtle font-serif text-6xl text-muted transition group-hover:shadow-lg">
        {product.name.charAt(0).toUpperCase()}
      </div>

      <h2 className="mt-2 truncate text-base">{product.name}</h2>

      <p className="truncate text-base text-muted">
        Jumlah : {product.jumlah}
        {product.description && ` · ${product.description}`}
      </p>

      <p className="mt-1 text-lg font-bold">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      {product.jumlah <= 5 && (
        <p className="text-sm font-semibold text-accent">
          Only {product.jumlah} left
        </p>
      )}
    </Link>
  );
}
