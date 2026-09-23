"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { revalidateSite, ActionResult, withAuth } from "@/lib/actions/tools";

const schema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  order: z.coerce.number().default(0),
});

const BULK_MAX = 200;

export async function saveSkills(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await withAuth();

    const raw: Record<string, string> = {};
    formData.forEach((value, key) => {
      raw[key] = String(value);
    });

    const parsed = z
      .object({
        software: z.string().optional(),
        tools: z.string().optional(),
        strengths: z.string().optional(),
      })
      .safeParse(raw);
    if (!parsed.success) return { ok: false, error: "Invalid input" };

    const categories = ["Software", "Tools", "Strengths"] as const;
    const fieldMap = { Software: "software", Tools: "tools", Strengths: "strengths" } as const;

    for (const category of categories) {
      const field = fieldMap[category];
      const items = (parsed.data[field] ?? "")
        .split(/\r?\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > BULK_MAX) return { ok: false, error: "Too many skills" };

      await db.skill.deleteMany({ where: { category } });
      await db.skill.createMany({
        data: items.map((name, i) => ({ category, name, order: i + 1 })),
      });
    }

    revalidateSite();
    return { ok: true, message: "Skills saved" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}