import { Resend } from "resend";

export async function sendContactNotificationMail(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false as const, reason: "RESEND_API_KEY not configured" };

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL ?? "asisjha15@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `[Portfolio] New contact message from ${input.name}`,
    replyTo: input.email,
    text: [
      `You received a new message on your portfolio site.`,
      ``,
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.subject ? `Subject: ${input.subject}` : null,
      ``,
      `Message:`,
      input.message,
    ].filter(Boolean).join("\n"),
  });

  if (error) return { sent: false as const, reason: error.message };
  return { sent: true as const };
}

export async function sendTestimonialApprovalMail(input: {
  name: string;
  email: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: input.email,
    subject: "Your testimonial is now live",
    text: `Hi ${input.name},\n\nThank you for your kind words! Your testimonial has been approved and is now visible on my portfolio.\n\n— Aashish Kumar Jha`,
  });
}