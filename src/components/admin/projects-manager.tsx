"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { ArrowDown, ArrowUp, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import type { Project } from "@prisma/client";
import {
  createProject,
  deleteProject,
  moveProject,
  updateProject,
} from "@/lib/actions/projects";
import type { ActionResult } from "@/lib/actions/tools";
import { useResultToast } from "@/hooks/use-result-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

const TYPE_LABELS: Record<string, string> = {
  PROJECT: "Project",
  RESEARCH: "Research",
  THESIS: "Thesis",
};

function ProjectDialog({ item, onClose }: { item: Project | null; onClose: () => void }) {
  const action = item ? updateProject : createProject;
  const [state, formAction] = useFormState(action, null as ActionResult | null);
  const [isPending, startTransition] = useTransition();

  useResultToast(state);

  useEffect(() => {
    if (state?.ok) onClose();
  }, [state, onClose]);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit project" : "Add project"}</DialogTitle>
          <DialogDescription>
            Optionally attach a PDF abstract or paper.
          </DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => startTransition(() => formAction(formData))}
          className="grid gap-4 sm:grid-cols-2"
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <Field label="Title" htmlFor="proj-title" className="sm:col-span-2">
            <Input id="proj-title" name="title" defaultValue={item?.title ?? ""} required />
          </Field>
          <Field label="Type" htmlFor="proj-type">
            <Select name="type" defaultValue={item?.type ?? "PROJECT"}>
              <SelectTrigger id="proj-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROJECT">Project</SelectItem>
                <SelectItem value="RESEARCH">Research</SelectItem>
                <SelectItem value="THESIS">Thesis</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Year" htmlFor="proj-year">
            <Input id="proj-year" name="year" defaultValue={item?.year ?? ""} required placeholder="2023" />
          </Field>
          <Field label="Order" htmlFor="proj-order">
            <Input id="proj-order" type="number" name="order" defaultValue={item?.order ?? 0} className="w-24" />
          </Field>
          <Field label="External link (optional)" htmlFor="proj-link">
            <Input id="proj-link" name="link" type="url" defaultValue={item?.link ?? ""} placeholder="https://..." />
          </Field>

          <Field label="Description (Markdown supported)" className="sm:col-span-2">
            <Textarea name="description" rows={5} defaultValue={item?.description ?? ""} required />
          </Field>

          <Field
            label="Attachment (PDF / document)"
            htmlFor="proj-file"
            hint={item?.fileUrl ? `Current file: ${item.fileUrl.split("/").pop()}` : "Optional abstract, paper or report."}
            className="sm:col-span-2"
          >
            <Input id="proj-file" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip" className="file:font-medium" />
          </Field>

          {item?.fileUrl ? (
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                name="removeFile"
                className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
              />
              Remove current attachment
            </label>
          ) : null}

          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton state={state} label={item ? "Save changes" : "Add project"} disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsManager({ items }: { items: Project[] }) {
  const [dialog, setDialog] = useState<{ open: boolean; item: Project | null }>({
    open: false,
    item: null,
  });

  return (
    <div>
      <PageHeader
        title="Projects & Research"
        description="Card grid entries with optional PDF abstract/paper attachments."
      >
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          Add project
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No projects yet. Add a project, research study or thesis.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={item.type === "RESEARCH" ? "aqua" : item.type === "THESIS" ? "secondary" : "sky"}>
                      {TYPE_LABELS[item.type] ?? item.type}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {item.year}
                    </Badge>
                  </div>
                  <p className="mt-2 font-medium">{item.title}</p>
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-aqua hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Attachment
                    </a>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={async () => { await moveProject(item.id, "up"); }}>
                    <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                  <form action={async () => { await moveProject(item.id, "down"); }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Move down"
                      disabled={index === items.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </form>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => setDialog({ open: true, item })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmButton
                    action={() => deleteProject(item.id)}
                    title="Delete project?"
                    description={`"${item.title}" and its attachment will be permanently removed.`}
                  >
                    <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {dialog.open ? (
        <ProjectDialog item={dialog.item} onClose={() => setDialog({ open: false, item: null })} />
      ) : null}
    </div>
  );
}