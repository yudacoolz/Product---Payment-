import Navbar from "@/components/Navbar";

// layout for the shop pages (home, products, carts, checkout), shows the navbar
export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
