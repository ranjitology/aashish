import Link from "next/link";
import type { Profile } from "@prisma/client";
import { NAV_LINKS } from "@/lib/site";

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-navy-950 text-navy-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-aqua font-serif text-sm font-semibold text-navy-950">
              AKJ
            </span>
            <div>
              <p className="font-serif text-base font-semibold text-white">{profile.name}</p>
              <p className="text-xs text-navy-300">NEC Registered Engineer [{profile.necNumber}]</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">{profile.tagline}</p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-aqua">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-navy-300 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-aqua">Contact</p>
          <ul className="space-y-2 text-sm text-navy-300">
            <li>
              <a href={`mailto:${profile.email}`} className="transition-colors hover:text-white">
                {profile.email}
              </a>
            </li>
            <li>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-white">
                {profile.phone}
              </a>
            </li>
            {profile.phone2 ? (
              <li>
                <a href={`tel:${profile.phone2.replace(/\D/g, "")}`} className="transition-colors hover:text-white">
                  {profile.phone2}
                </a>
              </li>
            ) : null}
            <li className="text-navy-400">{profile.location}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p>
            Engineering sustainable water solutions, shaping future engineers.
          </p>
        </div>
      </div>
    </footer>
  );
}