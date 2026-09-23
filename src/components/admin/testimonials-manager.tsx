"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Testimonial } from "@prisma/client";
import {
  createTestimonial,
  deleteTestimonial,
  toggleTestimonialApproval,
  updateTestimonial,
} from "@/lib/actions/testimonials";
import type { ActionResult } from "@/lib/actions/tools";
import { timeAgo } from "@/lib/utils";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

function TestimonialDialog({ item, onClose }: { item: Testimonial | null; onClose: () => void }) {
  const action = item ? updateTestimonial : createTestimonial;
  const [state, formAction] = useFormState(action, null as ActionResult | null);
  const [approved, setApproved] = useState(item?.approved ?? false);
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
          <DialogTitle>{item ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
          <DialogDescription>
            Only approved testimonials appear on the public site.
          </DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => startTransition(() => formAction(formData))}
          className="grid gap-4"
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" htmlFor="test-name">
              <Input id="test-name" name="name" defaultValue={item?.name ?? ""} required />
            </Field>
            <Field label="Role / affiliation" htmlFor="test-role">
              <Input id="test-role" name="role" defaultValue={item?.role ?? ""} placeholder="B.E. Civil Engineering" />
            </Field>
          </div>

          <Field label="Message" htmlFor="test-message">
            <Textarea id="test-message" name="message" rows={5} defaultValue={item?.message ?? ""} required />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Order" htmlFor="test-order">
              <Input id="test-order" type="number" name="order" defaultValue={item?.order ?? 0} className="w-24" />
            </Field>
            <div className="flex items-end gap-3 pb-2">
              <Switch
                id="test-approved"
                checked={approved}
                onCheckedChange={setApproved}
              />
              <input type="hidden" name="approved" value={approved ? "true" : "false"} />
              <label htmlFor="test-approved" className="text-sm font-medium">
                Approved (visible publicly)
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton state={state} label={item ? "Save changes" : "Add testimonial"} disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TestimonialsManager({ items }: { items: Testimonial[] }) {
  const [dialog, setDialog] = useState<{ open: boolean; item: Testimonial | null }>({
    open: false,
    item: null,
  });
  const [pending, startTransition] = useTransition();

  const toggleApproval = (id: string) => {
    if (pending) return;
    startTransition(async () => {
      const res = await toggleTestimonialApproval(id);
      if (res.ok) toast.success(res.message ?? "Updated");
      else toast.error(res.error ?? "Action failed");
    });
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Student and client feedback. Approve entries to show them publicly."
      >
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          Add testimonial
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No testimonials yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className={item.approved ? "" : "opacity-75"}>
              <CardContent className="flex h-full flex-col gap-4 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {item.role ?? "—"} · {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  <Badge variant={item.approved ? "success" : "warn"}>
                    {item.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground/80">{item.message}</p>
                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleApproval(item.id)}
                    disabled={pending}
                  >
                    {item.approved ? "Unpublish" : "Approve"}
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => setDialog({ open: true, item })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmButton
                      action={() => deleteTestimonial(item.id)}
                      title="Delete testimonial?"
                      description={`Feedback from "${item.name}" will be permanently removed.`}
                    >
                      <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {dialog.open ? (
        <TestimonialDialog
          item={dialog.item}
          onClose={() => setDialog({ open: false, item: null })}
        />
      ) : null}
    </div>
  );
}