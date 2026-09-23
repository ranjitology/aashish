"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/storage";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  objective: z.string().min(1, "Objective is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  phone2: z.string().optional().nullable(),
  location: z.string().min(1, "Location is required"),
  necNumber: z.string().min(1, "NEC number is required"),
});

export async function updateProfile(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();
    const current = await db.profile.findUnique({ where: { id: 1 } });

    const parsed = profileSchema.safeParse({
      name: formData.get("name"),
      title: formData.get("title"),
      tagline: formData.get("tagline"),
      objective: formData.get("objective"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      phone2: formData.get("phone2") || null,
      location: formData.get("location"),
      necNumber: formData.get("necNumber"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const photo = formData.get("photo") as File | null;
    const cv = formData.get("cv") as File | null;

    let photoUrl = current?.photoUrl ?? null;
    let cvUrl = current?.cvUrl ?? null;
    const removePhoto = formData.get("removePhoto") === "1";
    const removeCv = formData.get("removeCv") === "1";

    if (removePhoto && photoUrl) {
      await deleteFile(photoUrl);
      photoUrl = null;
    }
    if (photo && photo.size > 0) {
      const result = await uploadFile(photo, "profile");
      if (photoUrl) await deleteFile(photoUrl).catch(() => {});
      photoUrl = result.url;
    }
    if (removeCv && cvUrl) {
      await deleteFile(cvUrl);
      cvUrl = null;
    }
    if (cv && cv.size > 0) {
      const result = await uploadFile(cv, "cv");
      if (cvUrl) await deleteFile(cvUrl).catch(() => {});
      cvUrl = result.url;
    }

    await db.profile.upsert({
      where: { id: 1 },
      update: { ...parsed.data, photoUrl, cvUrl },
      create: { id: 1, ...parsed.data, photoUrl, cvUrl },
    });

    revalidateSite();
    return { ok: true, message: "Profile updated" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}