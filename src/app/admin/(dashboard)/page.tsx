import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Inbox,
  MessageSquare,
} from "lucide-react";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    projectCount,
    messageCount,
    unreadCount,
    experienceCount,
    educationCount,
    testimonialCount,
    membershipCount,
    profile,
    recentMessages,
  ] = await Promise.all([
    db.project.count().catch(() => 0),
    db.message.count().catch(() => 0),
    db.message.count({ where: { read: false } }).catch(() => 0),
    db.experience.count().catch(() => 0),
    db.education.count().catch(() => 0),
    db.testimonial.count().catch(() => 0),
    db.membership.count().catch(() => 0),
    db.profile.findUnique({ where: { id: 1 } }).catch(() => null),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
  ]);

  const stats = [
    { label: "Projects & research", value: projectCount, inbox: false, icon: FolderKanban, href: "/admin/projects" },
    { label: "Contact messages", value: messageCount, inbox: true, icon: Inbox, href: "/admin/messages" },
    { label: "Experience entries", value: experienceCount, inbox: false, icon: Briefcase, href: "/admin/experience" },
    { label: "Education entries", value: educationCount, inbox: false, icon: GraduationCap, href: "/admin/education" },
    { label: "Testimonials", value: testimonialCount, inbox: false, icon: MessageSquare, href: "/admin/testimonials" },
    { label: "Memberships", value: membershipCount, inbox: false, icon: BadgeCheck, href: "/admin/memberships" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content and recent activity."
      >
        <Button asChild variant="outline">
          <Link href="/admin/profile">
            Edit profile
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-all hover:-translate-y-0.5 hover:border-sky/40 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className="h-4 w-4 text-aqua" />
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <span className="font-serif text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </span>
                  {stat.inbox && unreadCount > 0 ? (
                    <Badge variant="warn" className="mb-1.5">
                      {unreadCount} unread
                    </Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Recent messages</CardTitle>
            <CardDescription>Latest submissions from the contact form.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul className="divide-y">
                {recentMessages.map((message) => (
                  <li key={message.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {!message.read ? (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-aqua"
                            aria-label="Unread"
                          />
                        ) : null}
                        <span className="truncate">{message.name}</span>
                        <span className="truncate text-xs font-normal text-muted-foreground">
                          {message.subject ?? "No subject"}
                        </span>
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {message.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(message.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/messages">Open inbox</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Site status</CardTitle>
            <CardDescription>Content freshness and key details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Profile last updated</span>
              <span className="font-medium">
                {profile?.updatedAt ? timeAgo(profile.updatedAt) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">NEC registration</span>
              <span className="font-mono font-semibold">{profile?.necNumber ?? "78836"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">Unread messages</span>
              <span className="font-semibold">{unreadCount}</span>
            </div>
            <div className="rounded-lg border border-aqua/30 bg-aqua/10 p-3 text-xs leading-relaxed text-foreground/80">
              Public pages revalidate automatically every minute after content changes — no
              redeploy needed.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}