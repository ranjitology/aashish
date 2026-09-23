import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/admin/page-header";
import { PasswordForm } from "@/components/admin/password-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsAdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/login");

  return (
    <div>
      <PageHeader title="Settings" description="Account details and security." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Account</CardTitle>
            <CardDescription>The single administrator account for this site.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{session.user.name ?? "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{session.user.email}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{session.user.role ?? "ADMIN"}</span>
            </div>
            <div className="rounded-lg border border-aqua/30 bg-aqua/10 p-3 text-xs leading-relaxed text-foreground/80">
              Sessions last 7 days. To create additional accounts, run a custom seed script —
              public registration is intentionally disabled.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Change password</CardTitle>
            <CardDescription>Use a strong, unique password for the admin account.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}