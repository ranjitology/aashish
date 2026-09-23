import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink, rm } from "fs/promises";
import path from "path";
import crypto from "crypto";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadFile(file: File, folder: string) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name);
  const base = folder.replace(/^\/+|\/+$/g, "");

  if (token) {
    const blob = await put(`${base}/${crypto.randomUUID()}${ext}`, bytes, {
      access: "public",
      contentType: file.type,
    });
    return { url: blob.url, mode: "blob" as const };
  }

  const dir = path.join(process.cwd(), "public", "uploads", base);
  await mkdir(dir, { recursive: true });
  const name = safeName(path.basename(file.name));
  const finalName = `${crypto.randomUUID().slice(0, 8)}-${name}`;
  await writeFile(path.join(dir, finalName), bytes);
  return { url: `/uploads/${base}/${finalName}`, mode: "local" as const };
}

export async function deleteFile(url: string | null | undefined) {
  if (!url) return;
  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await rm(filePath, { force: true });
    } catch {
      /* ignore */
    }
  } else if (url.startsWith("https://") && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(url);
    } catch {
      /* ignore */
    }
  }
}