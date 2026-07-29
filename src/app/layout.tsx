import type { Metadata } from "next";
import "@fontsource-variable/outfit";
import "@fontsource-variable/playfair-display";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chulda — Motion for products that matter",
  description:
    "Motion design for SaaS, AI, and digital products—turning complex ideas into clear, memorable experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
