import type { Metadata } from "next";
import { db } from "@/lib/db";
import { EducationManager } from "@/components/admin/education-manager";

export const metadata: Metadata = { title: "Education" };

export default async function EducationAdminPage() {
  const items = await db.education
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return <EducationManager items={items} />;
}