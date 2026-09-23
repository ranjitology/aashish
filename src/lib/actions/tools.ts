import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

export async function withAuth() {
  await requireAdmin();
}

export function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/experience");
  revalidatePath("/admin/education");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/memberships");
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin/messages");
}

export function badRequest(message: string): ActionResult {
  return { ok: false, error: message };
}