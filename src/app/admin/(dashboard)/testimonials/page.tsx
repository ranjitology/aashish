import type { Metadata } from "next";
import { db } from "@/lib/db";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const items = await db.testimonial
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return <TestimonialsManager items={items} />;
}