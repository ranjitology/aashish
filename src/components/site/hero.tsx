import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Download, Mail, MapPin } from "lucide-react";
import type { Profile } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ContourLines } from "@/components/site/section";

export function Hero({ profile }: { profile: Profile }) {
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 3)
    .join("");

  return (
    <section id="hero" className="relative overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/[0.04] via-transparent to-transparent dark:from-navy-900/40" />
        <ContourLines className="absolute -right-24 -top-24 h-[560px] w-[560px] text-sky" />
        <ContourLines className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rotate-180 text-aqua" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-aqua sm:text-sm">
            <BadgeCheck className="h-4 w-4" />
            NEC Registered Engineer [{profile.necNumber}]
          </div>

          <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>

          <p className="mt-4 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
            {profile.title}
          </p>

          <p className="mt-6 max-w-xl border-l-2 border-sky pl-4 font-serif text-lg italic text-foreground/80 sm:text-xl">
            &ldquo;{profile.tagline}&rdquo;
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-aqua" />
              {profile.location}
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4 text-aqua" />
              {profile.email}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="#contact">Get in Touch</Link>
            </Button>
            {profile.cvUrl ? (
              <Button size="lg" variant="outline" asChild>
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute inset-6 -z-10" aria-hidden="true">
            <span className="ripple-ring absolute inset-0 rounded-full border border-sky/40" />
            <span className="ripple-ring absolute inset-0 rounded-full border border-aqua/40" />
            <span className="ripple-ring absolute inset-0 rounded-full border border-sky/30" />
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl border bg-gradient-to-br from-navy-900 to-navy-700 shadow-2xl shadow-navy-900/20">
            {profile.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/90">
                <span className="font-serif text-6xl font-semibold tracking-tight sm:text-7xl">
                  {initials}
                </span>
                <span className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Civil Engineer
                </span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-950">
                NEC [{profile.necNumber}]
              </span>
              <span className="text-xs font-medium text-white/80">{profile.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}