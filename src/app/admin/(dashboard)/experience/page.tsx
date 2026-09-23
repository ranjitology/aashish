import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ExperienceManager } from "@/components/admin/experience-manager";

export const metadata: Metadata = { title: "Experience" };

export default async function ExperienceAdminPage() {
  const items = await db.experience
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return <ExperienceManager items={items} />;
}