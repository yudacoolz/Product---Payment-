import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "My App",
  description: "My Next.js application",
};

const snapScriptUrl =
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* The Midtrans client key is public by design. */}
        <Script
          src={"https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        />
        <Navbar />

        {children}
      </body>
    </html>
  );
}
