import type { Metadata } from "next";
import { DestinationPage } from "@/components/destination-page";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return <DestinationPage index="01" title="Work" />;
}
