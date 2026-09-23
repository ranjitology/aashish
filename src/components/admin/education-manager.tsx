"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { Education } from "@prisma/client";
import {
  createEducation,
  deleteEducation,
  moveEducation,
  updateEducation,
} from "@/lib/actions/education";
import type { ActionResult } from "@/lib/actions/tools";
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
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

function EducationDialog({ item, onClose }: { item: Education | null; onClose: () => void }) {
  const action = item ? updateEducation : createEducation;
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit education" : "Add education"}</DialogTitle>
          <DialogDescription>Degree details appear in the public table.</DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => startTransition(() => formAction(formData))}
          className="grid gap-4 sm:grid-cols-2"
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <Field label="Degree" htmlFor="edu-degree" className="sm:col-span-2">
            <Input id="edu-degree" name="degree" defaultValue={item?.degree ?? ""} required placeholder="B.E. — Civil Engineering" />
          </Field>
          <Field label="Institution" htmlFor="edu-institution" className="sm:col-span-2">
            <Input id="edu-institution" name="institution" defaultValue={item?.institution ?? ""} required placeholder="University / campus" />
          </Field>
          <Field label="Year" htmlFor="edu-year">
            <Input id="edu-year" name="year" defaultValue={item?.year ?? ""} required placeholder="2017" />
          </Field>
          <Field label="Result / percentage" htmlFor="edu-percentage">
            <Input id="edu-percentage" name="percentage" defaultValue={item?.percentage ?? ""} placeholder="First Division" />
          </Field>
          <Field label="Order" htmlFor="edu-order">
            <Input id="edu-order" type="number" name="order" defaultValue={item?.order ?? 0} className="w-24" />
          </Field>

          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton state={state} label={item ? "Save changes" : "Add education"} disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EducationManager({ items }: { items: Education[] }) {
  const [dialog, setDialog] = useState<{ open: boolean; item: Education | null }>({
    open: false,
    item: null,
  });

  return (
    <div>
      <PageHeader
        title="Education"
        description="Degrees and academic background shown in the public table."
      >
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          Add entry
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No education entries yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.degree}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {item.institution} · {item.year}
                    {item.percentage ? ` · ${item.percentage}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={async () => { await moveEducation(item.id, "up"); }}>
                    <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                  <form action={async () => { await moveEducation(item.id, "down"); }}>
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
                    action={() => deleteEducation(item.id)}
                    title="Delete education?"
                    description={`"${item.degree}" will be permanently removed.`}
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
        <EducationDialog item={dialog.item} onClose={() => setDialog({ open: false, item: null })} />
      ) : null}
    </div>
  );
}