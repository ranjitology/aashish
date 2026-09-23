"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/actions/tools";

export function ConfirmButton({
  action,
  title,
  description,
  confirmLabel = "Delete",
  onConfirmed,
  children,
}: {
  action: () => Promise<ActionResult>;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirmed?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (pending) return;
    startTransition(async () => {
      const res = await action();
      if (res.ok) toast.success(res.message ?? "Deleted");
      else toast.error(res.error ?? "Action failed");
      setOpen(false);
      if (res.ok) onConfirmed?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            <Trash2 className="h-4 w-4" />
            {pending ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}