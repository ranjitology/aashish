"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BadgeCheck,
  Briefcase,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/memberships", label: "Memberships", icon: BadgeCheck },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/messages", label: "Messages", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarNav({
  pathname,
  unreadCount,
  onNavigate,
}: {
  pathname: string;
  unreadCount: number;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-navy-800 px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          target="_blank"
          onClick={onNavigate}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-aqua text-xs font-bold text-navy-950">
            AKJ
          </span>
          <span>
            <span className="block font-serif text-sm font-semibold text-white">Admin Panel</span>
            <span className="block text-[11px] text-navy-400">Aashish Kumar Jha</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {NAV.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-navy-800 text-white"
                  : "text-navy-300 hover:bg-navy-900 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/messages" && unreadCount > 0 ? (
                <span className="rounded-full bg-aqua px-2 py-0.5 text-[10px] font-bold text-navy-950">
                  {unreadCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-navy-800 p-3">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 transition-colors hover:bg-navy-900 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View public site
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 transition-colors hover:bg-navy-900"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({
  user,
  unreadCount,
  children,
}: {
  user: { name?: string | null; email?: string | null };
  unreadCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const displayName = user.name || user.email || "Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy-950 lg:block">
        <SidebarNav pathname={pathname} unreadCount={unreadCount} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-navy-950 shadow-2xl">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-md p-1.5 text-navy-300 hover:bg-navy-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarNav
              pathname={pathname}
              unreadCount={unreadCount}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden text-sm text-muted-foreground sm:block">
              Content management · single-admin workspace
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>
            <span className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[11px] font-bold text-white">
                {initials}
              </span>
              <span className="max-w-[120px] truncate text-xs font-medium">{displayName}</span>
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}