import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChaosMonkey AI",
  description: "Break AI apps intentionally. Let Passmark test them automatically."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="fixed inset-0 pointer-events-none bg-radial-mesh" />
        <div className="fixed inset-0 pointer-events-none bg-grid opacity-25" />
        {children}
      </body>
    </html>
  );
}
