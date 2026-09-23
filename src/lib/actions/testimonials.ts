"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
  approved: z.string().optional(),
  order: z.coerce.number().default(0),
});

export async function createTestimonial(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    const { approved, ...data } = parsed.data;
    await db.testimonial.create({
      data: { ...data, approved: approved === "on" || approved === "true" },
    });
    revalidateSite();
    return { ok: true, message: "Testimonial added" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateTestimonial(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const id = formData.get("id") as string;
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    const { approved, ...data } = parsed.data;
    await db.testimonial.update({
      where: { id },
      data: { ...data, approved: approved === "on" || approved === "true" },
    });
    revalidateSite();
    return { ok: true, message: "Testimonial updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function toggleTestimonialApproval(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    const t = await db.testimonial.findUnique({ where: { id } });
    if (!t) return { ok: false, error: "Not found" };
    await db.testimonial.update({ where: { id }, data: { approved: !t.approved } });
    revalidateSite();
    return { ok: true, message: t.approved ? "Testimonial hidden" : "Testimonial approved" };
  } catch {
    return { ok: false, error: "Could not update testimonial" };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await withAuth();
    await db.testimonial.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Testimonial deleted" };
  } catch {
    return { ok: false, error: "Could not delete testimonial" };
  }
}