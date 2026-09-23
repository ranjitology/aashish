import type { Metadata } from "next";
import { db } from "@/lib/db";
import { MembershipsManager } from "@/components/admin/memberships-manager";

export const metadata: Metadata = { title: "Memberships" };

export default async function MembershipsAdminPage() {
  const items = await db.membership
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  return <MembershipsManager items={items} />;
}