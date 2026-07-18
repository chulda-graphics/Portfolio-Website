import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <main id="main-content">
      <SiteHeader />
      <section className="not-found">
        <p className="eyebrow">404 / Frame not found</p>
        <h1>This scene isn&apos;t in the edit.</h1>
        <Link href="/">Return to the work ↗</Link>
      </section>
    </main>
  );
}
