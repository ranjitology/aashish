"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { Loader2, Send } from "lucide-react";
import { submitMessage } from "@/lib/actions/messages";
import type { ActionResult } from "@/lib/actions/tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
  const [state, formAction] = useFormState(submitMessage, null as ActionResult | null);
  const [pending, startTransition] = useTransition();
  const [key, setKey] = useState(0);
  const handled = useRef<ActionResult | null>(null);

  useEffect(() => {
    if (!state || state === handled.current) return;
    handled.current = state;
    if (state.ok) {
      toast.success(state.message ?? "Message sent");
      setKey((k) => k + 1);
    } else {
      toast.error(state.error ?? "Something went wrong");
    }
  }, [state]);

  return (
    <form
      key={key}
      action={(formData) => startTransition(() => formAction(formData))}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your name" required maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required maxLength={200} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can I help?" maxLength={200} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message..."
          rows={6}
          required
          minLength={5}
          maxLength={5000}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {pending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}