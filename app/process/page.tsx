import type { Metadata } from "next";
import { DestinationPage } from "@/components/destination-page";

export const metadata: Metadata = { title: "Process" };

export default function ProcessPage() {
  return <DestinationPage index="02" title="Process" />;
}
