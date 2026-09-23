"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";
import { changePassword } from "@/lib/actions/settings";
import type { ActionResult } from "@/lib/actions/tools";
import { useResultToast } from "@/hooks/use-result-toast";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";

export function PasswordForm() {
  const [state, formAction] = useFormState(changePassword, null as ActionResult | null);
  const [isPending, startTransition] = useTransition();

  useResultToast(state);

  useEffect(() => {
    if (state?.ok) {
      const form = document.getElementById("password-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state]);

  return (
    <form
      id="password-form"
      action={(formData) => startTransition(() => formAction(formData))}
      className="space-y-4"
    >
      <Field label="Current password" htmlFor="pw-current">
        <Input
          id="pw-current"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field label="New password" htmlFor="pw-new" hint="Minimum 8 characters.">
        <Input
          id="pw-new"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <Field label="Confirm new password" htmlFor="pw-confirm">
        <Input
          id="pw-confirm"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <SubmitButton
        state={state}
        label="Change password"
        pendingLabel="Updating..."
        disabled={isPending}
      />
    </form>
  );
}