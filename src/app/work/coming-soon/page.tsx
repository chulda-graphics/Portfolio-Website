import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageMotion } from "@/components/PageMotion";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Coming Soon — Chulda" };
export default function ComingSoonPage() { return <PageMotion className="soon-page"><div className="route-nav-reveal"><SiteNav inverse /></div><section className="soon-hero"><div className="route-line-clip"><h1 className="route-hero-line">A new product story is taking shape.</h1></div><p className="route-hero-copy">Strategy is being mapped. Frames are being tested. Motion is finding its purpose.</p><div className="soon-orbit route-hero-art"><i /><i /><i /><span>IN PROGRESS</span></div><Link className="icon-link" href="/work">Return to selected work <ArrowRight size={14} aria-hidden="true" /></Link></section><SiteFooter nextLabel="Have a story to tell?" nextHref="/contact" /></PageMotion>; }
