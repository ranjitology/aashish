import { cn } from "@/lib/utils";

export function Section({
  id,
  label,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  label: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-20", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
        <div className="mb-10">
          <span className="section-label">{label}</span>
          <h2 className="max-w-2xl font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export function ContourLines({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 800 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M60 720 C 160 620, 130 430, 260 390 S 390 260, 510 310 S 670 500, 740 400"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M45 650 C 140 570, 175 450, 285 425 S 420 300, 540 350 S 690 480, 755 430"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.25"
      />
      <path
        d="M30 580 C 120 520, 200 470, 300 460 S 450 340, 560 390 S 700 460, 770 460"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.18"
      />
      <circle cx="520" cy="312" r="4" fill="currentColor" opacity="0.4" />
      <circle cx="700" cy="470" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
}