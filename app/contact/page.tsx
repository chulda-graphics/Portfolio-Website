import type { Metadata } from "next";
import { DestinationPage } from "@/components/destination-page";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <DestinationPage index="04" title="Contact" />;
}
