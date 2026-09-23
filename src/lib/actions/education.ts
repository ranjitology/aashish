"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
  percentage: z.string().optional().nullable(),
  order: z.coerce.number().default(0),
});

export async function createEducation(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.education.create({ data: parsed.data });
    revalidateSite();
    return { ok: true, message: "Education added" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateEducation(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const id = formData.get("id") as string;
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.education.update({ where: { id }, data: parsed.data });
    revalidateSite();
    return { ok: true, message: "Education updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    await db.education.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Education deleted" };
  } catch {
    return { ok: false, error: "Could not delete education" };
  }
}

export async function moveEducation(id: string, dir: "up" | "down"): Promise<ActionResult> {
  try {
    await withAuth();
    const items = await db.education.findMany({ orderBy: { order: "asc" } });
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= items.length) return { ok: false, error: "Out of range" };
    await Promise.all([
      db.education.update({ where: { id: items[idx].id }, data: { order: items[swap].order } }),
      db.education.update({ where: { id: items[swap].id }, data: { order: items[idx].order } }),
    ]);
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reorder" };
  }
}