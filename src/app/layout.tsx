import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nibedita Live — Bangladesh Live TV Channels",
  description:
    "Watch Bangladesh and international TV channels live online for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-linear-to-b from-zinc-950 via-black to-zinc-900 min-h-screen font-sans">
        <main className="max-w-3xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
