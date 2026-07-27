import type { Metadata } from "next";
import { DestinationPage } from "@/components/destination-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <DestinationPage index="03" title="About" />;
}
