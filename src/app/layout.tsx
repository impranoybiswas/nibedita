import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BDTV Live — Bangladesh Live TV Channels",
  description:
    "Watch Bangladesh and international TV channels live online for free.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") {
    console.log("--- SERVER SIDE localStorage inspection ---");
    console.log("localStorage type:", typeof global.localStorage);
    if (global.localStorage) {
      console.log("localStorage keys:", Object.keys(global.localStorage));
    }
  }
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] min-h-screen font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
