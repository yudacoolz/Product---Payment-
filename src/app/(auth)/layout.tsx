import Link from "next/link";

// layout for the login page, no navbar here
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <Link href="/" className="mb-6 font-serif text-4xl text-accent">
        My App
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8 shadow-sm">
        {children}
      </div>
    </main>
  );
}
