import type { Metadata } from "next";
import ToursPage from "./TourPageClient";

export const metadata: Metadata = {
  title: "Tours & Safaris — Malikan Tours",
  description:
    "Browse guided tours and safaris across South Africa and beyond — Kruger safaris, Winelands weekends, Drakensberg hikes, heritage tours and cross-border trips to Victoria Falls.",
};

export default function Page() {
  return <ToursPage />;
}