"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/actions/tools";

export function useResultToast(state: ActionResult | null | undefined) {
  const last = useRef<ActionResult | null>(null);

  useEffect(() => {
    if (!state || state === last.current) return;
    last.current = state;
    if (state.ok) {
      toast.success(state.message ?? "Saved");
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [state]);
}