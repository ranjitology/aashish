import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MessagesManager } from "@/components/admin/messages-manager";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesAdminPage() {
  const messages = await db.message
    .findMany({ orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return <MessagesManager messages={messages} />;
}