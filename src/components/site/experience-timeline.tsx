import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import type { Experience } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/site/markdown";

function dateRange(item: Experience) {
  const start = item.startDate ? formatDate(item.startDate) : "";
  const end = item.current ? "Present" : item.endDate ? formatDate(item.endDate) : "";
  if (start && end) return `${start} — ${end}`;
  return start || end || "";
}

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No experience entries yet.</p>;
  }

  return (
    <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[31px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-background bg-aqua shadow sm:-left-[39px]" />
          <article className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
              <div>
                <h3 className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
                  {item.role}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground/80">
                    <Briefcase className="h-3.5 w-3.5 text-sky" />
                    {item.institution}
                  </span>
                  {item.location ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  ) : null}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold whitespace-nowrap text-muted-foreground">
                {dateRange(item)}
              </span>
            </div>
            {item.description ? (
              <Markdown className="mt-4 text-sm">{item.description}</Markdown>
            ) : null}
          </article>
        </li>
      ))}
    </ol>
  );
}

export function EducationTable({ items }: { items: { id: string; degree: string; institution: string; year: string; percentage: string | null }[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No education entries yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="thin-scroll overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-semibold sm:px-6">Degree</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Institution</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Year</th>
              <th className="px-4 py-3 font-semibold sm:px-6">Result</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b transition-colors last:border-0 hover:bg-muted/40">
                <td className="px-4 py-4 font-medium sm:px-6">
                  <span className="inline-flex items-start gap-2">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
                    {item.degree}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground sm:px-6">{item.institution}</td>
                <td className="px-4 py-4 sm:px-6">{item.year}</td>
                <td className="px-4 py-4 text-muted-foreground sm:px-6">
                  {item.percentage ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}