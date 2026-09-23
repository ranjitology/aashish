import { ExternalLink, FileText, FlaskConical, Search } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/site/markdown";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  PROJECT: { label: "Project", className: "bg-sky/15 text-sky", icon: FileText },
  RESEARCH: { label: "Research", className: "bg-aqua/15 text-aqua", icon: Search },
  THESIS: { label: "Thesis", className: "bg-navy-500/15 text-navy-500 dark:bg-navy-300/15 dark:text-navy-200", icon: FlaskConical },
};

export function ProjectGrid({ items }: { items: Project[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No projects published yet.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const type = TYPE_STYLES[item.type] ?? TYPE_STYLES.PROJECT;
        const Icon = type.icon;
        return (
          <Card
            key={item.id}
            className="group flex flex-col overflow-hidden border-border/70 transition-all hover:-translate-y-1 hover:border-sky/40 hover:shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", type.className)}>
                  <Icon className="h-3.5 w-3.5" />
                  {type.label}
                </span>
                <Badge variant="outline" className="shrink-0 font-mono">
                  {item.year}
                </Badge>
              </div>
              <CardTitle className="mt-3 font-serif text-lg leading-snug tracking-tight">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Markdown className="line-clamp-5 text-sm text-muted-foreground">
                {item.description}
              </Markdown>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3 border-t pt-4">
              {item.fileUrl ? (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-aqua transition-colors hover:text-aqua/80"
                >
                  <FileText className="h-4 w-4" />
                  Abstract / Paper
                </a>
              ) : null}
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-sky transition-colors hover:text-sky/80"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit
                </a>
              ) : null}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}