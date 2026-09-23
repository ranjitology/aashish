import type { Profile } from "@prisma/client";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Section } from "@/components/site/section";

export function ContactSection({ profile }: { profile: Profile }) {
  const items = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    profile.phone2
      ? {
          icon: Phone,
          label: "Alternate",
          value: profile.phone2,
          href: `tel:${profile.phone2.replace(/\D/g, "")}`,
        }
      : null,
    { icon: MapPin, label: "Location", value: profile.location, href: null },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string | null }[];

  return (
    <Section
      id="contact"
      label="Get in Touch"
      title="Let's discuss your project or collaboration"
      subtitle="For consulting enquiries, lectureship opportunities, or academic collaboration — send a message or reach out directly."
      className="border-t bg-muted/30"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-sky/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white dark:bg-navy-800">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">
                    {item.value}
                  </span>
                </span>
              </div>
            );
            return item.href ? (
              <a key={item.label} href={item.href} className="block">
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
          <div className="rounded-xl border border-aqua/30 bg-aqua/10 p-4 text-sm text-foreground/80">
            Typically replies within 1–2 working days. Messages are stored securely and only used
            to respond to your enquiry.
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}