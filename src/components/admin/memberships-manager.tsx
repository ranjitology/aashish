"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import type { Membership } from "@prisma/client";
import {
  createMembership,
  deleteMembership,
  moveMembership,
  updateMembership,
} from "@/lib/actions/memberships";
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
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

function MembershipDialog({ item, onClose }: { item: Membership | null; onClose: () => void }) {
  const action = item ? updateMembership : createMembership;
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
          <DialogTitle>{item ? "Edit membership" : "Add membership"}</DialogTitle>
          <DialogDescription>Credential and membership badges shown publicly.</DialogDescription>
        </DialogHeader>

        <form
          action={(formData) => startTransition(() => formAction(formData))}
          className="grid gap-4 sm:grid-cols-2"
        >
          {item ? <input type="hidden" name="id" value={item.id} /> : null}

          <Field label="Organization" htmlFor="mem-org" className="sm:col-span-2">
            <Input id="mem-org" name="organization" defaultValue={item?.organization ?? ""} required placeholder="Nepal Engineering Council (NEC)" />
          </Field>
          <Field label="Status" htmlFor="mem-status">
            <Input id="mem-status" name="status" defaultValue={item?.status ?? "Active"} required placeholder="Registered Engineer" />
          </Field>
          <Field label="Registration number" htmlFor="mem-reg">
            <Input id="mem-reg" name="regNumber" defaultValue={item?.regNumber ?? ""} placeholder="78836" />
          </Field>
          <Field label="Verification URL" htmlFor="mem-url" className="sm:col-span-2">
            <Input id="mem-url" name="url" type="url" defaultValue={item?.url ?? ""} placeholder="https://..." />
          </Field>
          <Field label="Order" htmlFor="mem-order">
            <Input id="mem-order" type="number" name="order" defaultValue={item?.order ?? 0} className="w-24" />
          </Field>

          <DialogFooter className="gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <SubmitButton state={state} label={item ? "Save changes" : "Add membership"} disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function MembershipsManager({ items }: { items: Membership[] }) {
  const [dialog, setDialog] = useState<{ open: boolean; item: Membership | null }>({
    open: false,
    item: null,
  });

  return (
    <div>
      <PageHeader
        title="Memberships"
        description="Professional registrations such as NEC and NEA."
      >
        <Button onClick={() => setDialog({ open: true, item: null })}>
          <Plus className="h-4 w-4" />
          Add membership
        </Button>
      </PageHeader>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No memberships yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.organization}</p>
                    <Badge variant="aqua">{item.status}</Badge>
                  </div>
                  {item.regNumber ? (
                    <p className="mt-1 font-mono text-sm text-muted-foreground">
                      Reg. No: {item.regNumber}
                    </p>
                  ) : null}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <form action={async () => { await moveMembership(item.id, "up"); }}>
                    <Button variant="ghost" size="icon" aria-label="Move up" disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                  <form action={async () => { await moveMembership(item.id, "down"); }}>
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
                    action={() => deleteMembership(item.id)}
                    title="Delete membership?"
                    description={`"${item.organization}" will be permanently removed.`}
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
        <MembershipDialog
          item={dialog.item}
          onClose={() => setDialog({ open: false, item: null })}
        />
      ) : null}
    </div>
  );
}