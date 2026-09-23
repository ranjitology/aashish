"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionResult } from "@/lib/actions/tools";

export function SubmitButton({
  state,
  label,
  pendingLabel = "Saving...",
  className,
  variant,
  size,
  disabled,
}: {
  state: ActionResult | null | undefined;
  label: string;
  pendingLabel?: string;
} & Pick<ButtonProps, "className" | "variant" | "size" | "disabled">) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (state) setSubmitting(false);
  }, [state]);

  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      size={size}
      disabled={disabled || submitting}
      onClick={() => setSubmitting(true)}
    >
      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {submitting ? pendingLabel : label}
    </Button>
  );
}