"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    if (!session.user.email) return { ok: false, error: "No email on session" };

    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

    const user = await db.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { ok: false, error: "User not found" };

    const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    if (!valid) return { ok: false, error: "Current password is incorrect" };

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await db.user.update({ where: { id: user.id }, data: { passwordHash } });

    return { ok: true, message: "Password changed" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}