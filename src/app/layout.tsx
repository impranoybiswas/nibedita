import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nibedita Live TV — Bangladesh Live TV Channels",
  description:
    "Watch Bangladesh and international TV channels live online for free. Stream your favorite shows, movies, and sports events in high quality.",
  keywords: [
    "Live TV",
    "Bangladesh TV",
    "International TV",
    "Free TV",
    "Sports",
    "Movies",
    "Shows",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
