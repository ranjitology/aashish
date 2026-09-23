"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { Experience } from "@prisma/client";
import {
  createExperience,
  deleteExperience,
  moveExperience,
  updateExperience,
} from "@/lib/actions/experience";
import type { ActionResult } from "@/lib/actions/tools";
import { formatDate, toDateInputValue } from "@/lib/utils";
import { useResultToast } from "@/hooks/use-result-toast";
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
import { Textarea } from "@/components/ui/textarea";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

function ExperienceDialog({ item, onClose }: { item: Experience | null; onClose: () => void }) {
  const action = item ? updateExperience : createExperience;
  const [state, formAction] = useFormState(action, null as ActionResult | null);
  const [current, setCurrent] = useState(item?.current ?? false);
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
          <DialogTitle>{item ? "Edit experience" : "Add experience"}</DialogTitle>
          <DialogDescription>
            {item ? "Update this timeline entry." : "Add a teaching or professional role."}
          </DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => startTransition(() => formAction(formData))}
          className="grid gap-4 sm:grid-cols-2"
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <Field label="Role" htmlFor="exp-role">
            <Input id="exp-role" name="role" defaultValue={item?.role ?? ""} required placeholder="Lecturer — Civil Engineering" />
          </Field>
          <Field label="Institution" htmlFor="exp-institution">
            <Input id="exp-institution" name="institution" defaultValue={item?.institution ?? ""} required placeholder="College / organization" />
          </Field>
          <Field label="Location" htmlFor="exp-location">
            <Input id="exp-location" name="location" defaultValue={item?.location ?? ""} placeholder="City, country" />
          </Field>
          <Field label="Order" htmlFor="exp-order">
            <Input id="exp-order" type="number" name="order" defaultValue={item?.order ?? 0} className="w-24" />
          </Field>
          <Field label="Start date" htmlFor="exp-start">
            <Input id="exp-start" type="date" name="startDate" defaultValue={toDateInputValue(item?.startDate)} />
          </Field>
          <Field label="End date" htmlFor="exp-end">
            <Input id="exp-end" type="date" name="endDate" defaultValue={toDateInputValue(item?.endDate)} disabled={current} />
          </Field>

          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              name="current"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
            />
            Currently in this role (shows &ldquo;Present&rdquo;)
          </label>

          <Field label="Description (Markdown supported)" className="sm:col-span-2">
            <Textarea name="description" rows={5} defaultValue={item?.description ?? ""} placeholder="Responsibilities, courses taught, outcomes..." />
          </Field>

          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton state={state} label={item ? "Save changes" : "Add experience"} disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ExperienceManager({ items }: { items: Experience[] }) {
  const [dialog, setDialog] = useState<{ open: boolean; item: Experience | null }>({
    open: false,
    item: null,
  });

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Teaching and professional roles shown on your public timeline."
      >
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          Add entry
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No experience entries yet. Add your first role to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.role}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.startDate ? formatDate(item.startDate) : ""}
                    {" — "}
                    {item.current ? "Present" : item.endDate ? formatDate(item.endDate) : ""}
                    {" · order "}
                    {item.order}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={async () => { await moveExperience(item.id, "up"); }}>
                    <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                  <form action={async () => { await moveExperience(item.id, "down"); }}>
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
                    action={() => deleteExperience(item.id)}
                    title="Delete experience?"
                    description={`"${item.role}" will be permanently removed from your timeline.`}
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
        <ExperienceDialog item={dialog.item} onClose={() => setDialog({ open: false, item: null })} />
      ) : null}
    </div>
  );
}