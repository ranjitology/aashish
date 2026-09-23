import { Wrench } from "lucide-react";
import type { Membership, Skill } from "@prisma/client";

const CATEGORY_ORDER = ["Software", "Tools", "Strengths"];

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return <p className="text-sm text-muted-foreground">No skills listed yet.</p>;
  }

  const grouped = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }

  const categories = [...grouped.keys()].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="mb-4 inline-flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
            <Wrench className="h-4 w-4 text-aqua" />
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {grouped.get(category)!.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium text-foreground/85 shadow-sm transition-colors hover:border-aqua/50 hover:text-foreground"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MembershipsSection({ memberships }: { memberships: Membership[] }) {
  if (memberships.length === 0) {
    return <p className="text-sm text-muted-foreground">No memberships listed yet.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {memberships.map((item) => (
        <div
          key={item.id}
          className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-aqua/10" aria-hidden="true" />
          <div className="relative">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-lg font-semibold tracking-tight">{item.organization}</h3>
              <span className="rounded-full bg-aqua/15 px-3 py-1 text-xs font-semibold text-aqua">
                {item.status}
              </span>
            </div>
            {item.regNumber ? (
              <p className="mt-3 font-mono text-sm text-muted-foreground">
                Reg. No: <span className="font-semibold text-foreground">{item.regNumber}</span>
              </p>
            ) : null}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky transition-colors hover:text-sky/80"
              >
                Verify membership
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: { id: string; name: string; role: string | null; message: string }[] }) {
  if (testimonials.length === 0) {
    return <p className="text-sm text-muted-foreground">No testimonials yet.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((item) => (
        <figure
          key={item.id}
          className="flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <svg className="h-6 w-6 text-aqua/60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.2 6C4.9 7.4 3.5 9.8 3.5 12.8c0 3.3 2 5.4 4.7 5.4 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.8.1-1 .2.5-1.6 2-3.3 4.1-4.5L7.2 6Zm9.6 0c-2.3 1.4-3.7 3.8-3.7 6.8 0 3.3 2 5.4 4.7 5.4 2.3 0 4-1.7 4-3.9 0-2.1-1.5-3.7-3.5-3.7-.4 0-.8.1-1 .2.5-1.6 2-3.3 4.1-4.5L16.8 6Z" />
          </svg>
          <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
            {item.message}
          </blockquote>
          <figcaption className="mt-5 border-t pt-4">
            <p className="text-sm font-semibold">{item.name}</p>
            {item.role ? <p className="mt-0.5 text-xs text-muted-foreground">{item.role}</p> : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}