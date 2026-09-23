import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Admin — Aashish Kumar Jha" },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");

  const unreadCount = await db.message
    .count({ where: { read: false } })
    .catch(() => 0);

  return (
    <AdminShell
      user={{ name: session.user.name, email: session.user.email }}
      unreadCount={unreadCount}
    >
      {children}
    </AdminShell>
  );
}