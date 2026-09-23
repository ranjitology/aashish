import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SkillsForm } from "@/components/admin/skills-form";

export const metadata: Metadata = { title: "Skills" };

export default async function SkillsAdminPage() {
  const skills = await db.skill
    .findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] })
    .catch(() => []);

  return <SkillsForm skills={skills} />;
}