import type { Metadata } from "next";
import "@fontsource-variable/outfit";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chulda — Motion for digital products",
  description:
    "Strategic motion design for SaaS, AI, and digital products. Making complex software clear, engaging, and memorable.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
