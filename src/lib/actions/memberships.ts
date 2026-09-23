"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  organization: z.string().min(1, "Organization is required"),
  status: z.string().min(1, "Status is required"),
  regNumber: z.string().optional().nullable(),
  url: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || null),
  order: z.coerce.number().default(0),
});

export async function createMembership(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.membership.create({ data: parsed.data });
    revalidateSite();
    return { ok: true, message: "Membership added" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateMembership(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const id = formData.get("id") as string;
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    await db.membership.update({ where: { id }, data: parsed.data });
    revalidateSite();
    return { ok: true, message: "Membership updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteMembership(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    await db.membership.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Membership deleted" };
  } catch {
    return { ok: false, error: "Could not delete membership" };
  }
}

export async function moveMembership(id: string, dir: "up" | "down"): Promise<ActionResult> {
  try {
    await withAuth();
    const items = await db.membership.findMany({ orderBy: { order: "asc" } });
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= items.length) return { ok: false, error: "Out of range" };
    await Promise.all([
      db.membership.update({ where: { id: items[idx].id }, data: { order: items[swap].order } }),
      db.membership.update({ where: { id: items[swap].id }, data: { order: items[idx].order } }),
    ]);
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reorder" };
  }
}