import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { MotionSystem } from "@/components/motion-system";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

async function getRequestOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host ?? "localhost:3000"}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const socialImage = `${origin}/og-v2.jpg`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Dhrex — SaaS Motion Designer",
      template: "%s — Dhrex",
    },
    description:
      "Purpose-led SaaS motion design by Dhrex. Product launch videos, UI motion, and visual storytelling for software companies worldwide.",
    applicationName: "Dhrex",
    authors: [{ name: "Dhrex" }],
    creator: "Dhrex",
    category: "Motion Design",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: "Dhrex",
      title: "Dhrex — SaaS Motion Designer",
      description:
        "Purpose-led motion that makes SaaS products easier to understand, trust, and remember.",
      url: origin,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Dhrex — Clarity, set in motion.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dhrex — SaaS Motion Designer",
      description:
        "Purpose-led motion that makes SaaS products easier to understand, trust, and remember.",
      images: [socialImage],
    },
  };
}

function buildStructuredData(origin: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${origin}/#dhrex`,
        name: "Dhrex",
        url: origin,
        jobTitle: "SaaS Motion Graphics Designer",
        description:
          "A remote motion designer creating precise UI and product motion for SaaS companies worldwide.",
        email: "chulda.graphics2022@gmail.com",
        sameAs: [
          "https://www.tiktok.com/@dhrex.in.motion",
          "https://www.instagram.com/dhrex.in.motion/",
          "https://www.facebook.com/canezo.dhrex/",
          "https://x.com/dhrexinmotion",
          "https://www.linkedin.com/in/dhrex-ca%C3%B1ezo/",
        ],
        knowsAbout: [
          "SaaS motion design",
          "UI animation",
          "product launch videos",
          "motion graphics",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Project inquiries",
          email: "chulda.graphics2022@gmail.com",
          url: "https://calendly.com/chulda-graphics2022/30min",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: "Dhrex",
        url: origin,
        inLanguage: "en",
        publisher: { "@id": `${origin}/#dhrex` },
      },
      {
        "@type": "Service",
        "@id": `${origin}/#saas-motion-design`,
        name: "SaaS Motion Design",
        serviceType: [
          "SaaS motion design",
          "UI/UX motion design",
          "Product launch video production",
        ],
        provider: { "@id": `${origin}/#dhrex` },
        areaServed: "Worldwide",
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const origin = await getRequestOrigin();
  const structuredData = buildStructuredData(origin);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://pub-8843028733224946913b21df4054c3ae.r2.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//pub-8843028733224946913b21df4054c3ae.r2.dev" />
      </head>
      <body>
        <MotionSystem />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
