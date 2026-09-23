import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { sitemapUrl } from "@/lib/seo";
import { Markdown } from "@/components/site/markdown";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Section } from "@/components/site/section";
import { ExperienceTimeline, EducationTable } from "@/components/site/experience-timeline";
import { ProjectGrid } from "@/components/site/project-grid";
import { SkillsSection, MembershipsSection, TestimonialsSection } from "@/components/site/skills-sections";
import { ContactSection } from "@/components/site/contact";
import { FloatingContact } from "@/components/site/floating-contact";
import { Footer } from "@/components/site/footer";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  const title = `${profile.name} — Registered Civil Engineer`;
  const description = `${profile.tagline} ${profile.title}. NEC Registered Engineer [${profile.necNumber}], ${profile.location}.`;

  return {
    title,
    description,
    alternates: { canonical: sitemapUrl("/") },
    openGraph: {
      title,
      description,
      url: sitemapUrl("/"),
      type: "website",
      images: [{ url: sitemapUrl("/opengraph-image"), width: 1200, height: 630, alt: profile.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const { profile, experiences, education, projects, skills, memberships, testimonials } =
    await getContent();

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />

        <Section
          id="about"
          label="About"
          title="Objective & summary"
          className="border-t"
        >
          <div className="max-w-3xl">
            <Markdown>{profile.objective}</Markdown>
          </div>
        </Section>

        <Section
          id="experience"
          label="Experience"
          title="Teaching & professional timeline"
          subtitle="Academic appointments and on-site water resources engineering roles."
          className="border-t bg-muted/30"
        >
          <ExperienceTimeline items={experiences} />
        </Section>

        <Section id="education" label="Education" title="Academic background">
          <EducationTable items={education} />
        </Section>

        <Section
          id="projects"
          label="Projects & Research"
          title="Selected work"
          subtitle="Design projects, research studies and thesis work — with downloadable abstracts where available."
          className="border-t bg-muted/30"
        >
          <ProjectGrid items={projects} />
        </Section>

        <Section id="skills" label="Skills & Tools" title="Capabilities">
          <SkillsSection skills={skills} />
        </Section>

        <Section
          id="memberships"
          label="Memberships"
          title="Credentials & professional memberships"
          className="border-t bg-muted/30"
        >
          <MembershipsSection memberships={memberships} />
        </Section>

        <Section id="testimonials" label="Testimonials" title="What others say">
          <TestimonialsSection testimonials={testimonials} />
        </Section>

        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
      <FloatingContact phone={profile.phone} />
    </>
  );
}