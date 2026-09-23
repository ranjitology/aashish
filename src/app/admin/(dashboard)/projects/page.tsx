import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProjectsManager } from "@/components/admin/projects-manager";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsAdminPage() {
  const items = await db.project
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return <ProjectsManager items={items} />;
}