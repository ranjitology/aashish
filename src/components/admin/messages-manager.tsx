"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import type { Message } from "@prisma/client";
import { deleteMessage, markMessageRead } from "@/lib/actions/messages";
import { timeAgo } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PageHeader } from "@/components/admin/page-header";

function MessageDialog({
  message,
  onClose,
  onDeleted,
}: {
  message: Message;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [read, setRead] = useState(message.read);
  const [pending, startTransition] = useTransition();

  const toggleRead = () => {
    if (pending) return;
    startTransition(async () => {
      const res = await markMessageRead(message.id);
      if (res.ok) {
        setRead((v) => !v);
        router.refresh();
      } else {
        toast.error(res.error ?? "Action failed");
      }
    });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {message.name}
            <Badge variant={read ? "secondary" : "warn"}>{read ? "Read" : "Unread"}</Badge>
          </DialogTitle>
          <DialogDescription>
            {message.email} · {new Date(message.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {message.subject ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Subject
              </p>
              <p className="mt-1 font-medium">{message.subject}</p>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message
            </p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{message.message}</p>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex flex-wrap items-center justify-between gap-2 sm:justify-between">
          <ConfirmButton
            action={() => deleteMessage(message.id)}
            title="Delete message?"
            description="This message will be permanently removed."
            onConfirmed={onDeleted}
          >
            <Button variant="ghost" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </ConfirmButton>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={toggleRead} disabled={pending}>
              {read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
              {pending ? "Working..." : read ? "Mark unread" : "Mark read"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const active = messages.find((m) => m.id === openId) ?? null;
  const unread = messages.filter((m) => !m.read).length;

  const toggleRow = (id: string) => {
    if (pending) return;
    startTransition(async () => {
      const res = await markMessageRead(id);
      if (res.ok) router.refresh();
      else toast.error(res.error ?? "Action failed");
    });
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Inbox of contact-form submissions."
      >
        {unread > 0 ? <Badge variant="warn">{unread} unread</Badge> : null}
      </PageHeader>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <ul className="divide-y">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-muted/40 sm:px-5 ${
                  message.read ? "" : "border-l-2 border-l-aqua bg-aqua/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(message.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {!message.read ? (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-aqua" aria-label="Unread" />
                    ) : null}
                    <span className="truncate">{message.name}</span>
                    <span className="truncate font-normal text-muted-foreground">
                      &lt;{message.email}&gt;
                    </span>
                  </p>
                  <p className="mt-1 truncate text-sm text-foreground/80">
                    {message.subject ? `${message.subject} — ` : ""}
                    {message.message}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <span className="mr-2 hidden text-xs text-muted-foreground sm:block">
                    {timeAgo(message.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(message.id)}
                    disabled={pending}
                  >
                    {message.read ? "Mark unread" : "Mark read"}
                  </Button>
                  <ConfirmButton
                    action={() => deleteMessage(message.id)}
                    title="Delete message?"
                    description={`Message from "${message.name}" will be permanently removed.`}
                    onConfirmed={() => {
                      if (openId === message.id) setOpenId(null);
                    }}
                  >
                    <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {active ? (
        <MessageDialog
          message={active}
          onClose={() => setOpenId(null)}
          onDeleted={() => setOpenId(null)}
        />
      ) : null}
    </div>
  );
}