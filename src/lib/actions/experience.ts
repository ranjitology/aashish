"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  role: z.string().min(1, "Role is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  current: z.string().optional(),
  description: z.string().default(""),
  order: z.coerce.number().default(0),
});

function toDate(value?: string | null) {
  if (!value) return null;
  return new Date(value.length === 10 ? `${value}T00:00:00` : value);
}

function parseDates(data: z.infer<typeof schema>) {
  return {
    ...data,
    current: data.current === "on" || data.current === "true",
    startDate: data.current ? (toDate(data.startDate) ?? new Date()) : toDate(data.startDate),
    endDate: data.current ? null : toDate(data.endDate),
  };
}

export async function createExperience(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.experience.create({ data: { ...parseDates(parsed.data), description: parsed.data.description } });
    revalidateSite();
    return { ok: true, message: "Experience added" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateExperience(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const id = formData.get("id") as string;
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.experience.update({ where: { id }, data: { ...parseDates(parsed.data), description: parsed.data.description } });
    revalidateSite();
    return { ok: true, message: "Experience updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    await db.experience.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Experience deleted" };
  } catch {
    return { ok: false, error: "Could not delete experience" };
  }
}

export async function moveExperience(id: string, dir: "up" | "down"): Promise<ActionResult> {
  try {
    await withAuth();
    const items = await db.experience.findMany({ orderBy: { order: "asc" } });
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= items.length) return { ok: false, error: "Out of range" };
    const a = items[idx].order;
    await Promise.all([
      db.experience.update({ where: { id: items[idx].id }, data: { order: items[swap].order } }),
      db.experience.update({ where: { id: items[swap].id }, data: { order: a } }),
    ]);
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reorder" };
  }
}