"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/storage";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")).transform((v) => v || null),
  order: z.coerce.number().default(0),
});

export async function createProject(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

    const file = formData.get("file") as File | null;
    let fileUrl: string | null = null;
    if (file && file.size > 0) {
      const result = await uploadFile(file, "projects");
      fileUrl = result.url;
    }

    await db.project.create({ data: { ...parsed.data, fileUrl } });
    revalidateSite();
    return { ok: true, message: "Project added" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateProject(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const id = formData.get("id") as string;
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

    const existing = await db.project.findUnique({ where: { id } });
    let fileUrl = existing?.fileUrl ?? null;
    const file = formData.get("file") as File | null;
    const removeFile = formData.get("removeFile") === "1";

    if (removeFile && fileUrl) {
      await deleteFile(fileUrl);
      fileUrl = null;
    }
    if (file && file.size > 0) {
      const result = await uploadFile(file, "projects");
      if (fileUrl) await deleteFile(fileUrl).catch(() => {});
      fileUrl = result.url;
    }

    await db.project.update({ where: { id }, data: { ...parsed.data, fileUrl } });
    revalidateSite();
    return { ok: true, message: "Project updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    const existing = await db.project.findUnique({ where: { id } });
    if (existing?.fileUrl) await deleteFile(existing.fileUrl);
    await db.project.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Project deleted" };
  } catch {
    return { ok: false, error: "Could not delete project" };
  }
}

export async function moveProject(id: string, dir: "up" | "down"): Promise<ActionResult> {
  try {
    await withAuth();
    const items = await db.project.findMany({ orderBy: { order: "asc" } });
    const idx = items.findIndex((i) => i.id === id);
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swap < 0 || swap >= items.length) return { ok: false, error: "Out of range" };
    await Promise.all([
      db.project.update({ where: { id: items[idx].id }, data: { order: items[swap].order } }),
      db.project.update({ where: { id: items[swap].id }, data: { order: items[idx].order } }),
    ]);
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reorder" };
  }
}