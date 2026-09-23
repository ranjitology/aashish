"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendContactNotificationMail } from "@/lib/email";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function submitMessage(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };

    const { name, email, subject, message } = parsed.data;

    const msg = await db.message.create({
      data: { name, email, subject: subject || null, message },
    });

    const mail = await sendContactNotificationMail({ name, email, subject, message });

    void msg;
    void mail;
    revalidateSite();
    return { ok: true, message: "Message sent. Thank you!" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function markMessageRead(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const m = await db.message.findUnique({ where: { id } });
    if (!m) return { ok: false, error: "Not found" };
    await db.message.update({ where: { id }, data: { read: !m.read } });
    revalidateSite();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update message" };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await db.message.delete({ where: { id } });
    revalidateSite();
    return { ok: true, message: "Message deleted" };
  } catch {
    return { ok: false, error: "Could not delete message" };
  }
}