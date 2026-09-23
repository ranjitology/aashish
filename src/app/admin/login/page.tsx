import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ContourLines } from "@/components/site/section";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.user) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/[0.06] via-transparent to-aqua/10" />
        <ContourLines className="absolute -right-20 top-1/4 h-[420px] w-[420px] text-sky" />
        <ContourLines className="absolute -left-24 bottom-0 h-[380px] w-[380px] rotate-180 text-aqua" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 font-serif text-base font-semibold text-white">
            AKJ
          </span>
          <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your portfolio content
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-lg sm:p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © Aashish Kumar Jha · NEC Registered Engineer [78836]
        </p>
      </div>
    </main>
  );
}