import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dhrex-motion.dhrexcanezo.chatgpt.site"),
  title: {
    default: "Dhrex — SaaS Motion Designer",
    template: "%s — Dhrex",
  },
  description:
    "Dhrex is a SaaS motion designer creating clear, purposeful product motion for software companies worldwide.",
  openGraph: {
    type: "website",
    title: "Dhrex — Premium SaaS Motion Graphics",
    description:
      "Purpose-led product motion and launch films for SaaS companies.",
    siteName: "Dhrex",
    images: [
      {
        url: "/og.png",
        width: 1672,
        height: 941,
        alt: "Dhrex — Premium SaaS Motion Graphics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhrex — Premium SaaS Motion Graphics",
    description:
      "Purpose-led product motion and launch films for SaaS companies.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
