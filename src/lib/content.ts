import { db } from "@/lib/db";
import type { Profile, Experience, Education, Project, Skill, Membership, Testimonial } from "@prisma/client";

const FALLBACK_PROFILE = {
  id: 1,
  name: "Aashish Kumar Jha",
  title: "Registered Civil Engineer | Lecturer | Land & Water Resources Specialist",
  tagline: "Engineering sustainable water solutions, shaping future engineers.",
  objective:
    "Motivated and licensed Civil Engineer with a strong focus on **land and water resources engineering**, combined with academic experience as a **lecturer** in Nepal.",
  photoUrl: null,
  cvUrl: null,
  email: "asisjha15@gmail.com",
  phone: "+977 9819695416",
  phone2: "9844382565",
  location: "Janakpur, Nepal",
  necNumber: "78836",
  updatedAt: new Date(),
} satisfies Profile;

export async function getContent() {
  const [profile, experiences, education, projects, skills, memberships, testimonials] =
    await Promise.all([
      db.profile.findUnique({ where: { id: 1 } }).catch(() => null),
      db.experience.findMany({ orderBy: { order: "asc" } }).catch(() => [] as Experience[]),
      db.education.findMany({ orderBy: { order: "asc" } }).catch(() => [] as Education[]),
      db.project.findMany({ orderBy: { order: "asc" } }).catch(() => [] as Project[]),
      db.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }).catch(() => [] as Skill[]),
      db.membership.findMany({ orderBy: { order: "asc" } }).catch(() => [] as Membership[]),
      db.testimonial
        .findMany({ where: { approved: true }, orderBy: { order: "asc" } })
        .catch(() => [] as Testimonial[]),
    ]);

  return {
    profile: profile ?? FALLBACK_PROFILE,
    experiences,
    education,
    projects,
    skills,
    memberships,
    testimonials,
  };
}

export type SiteContent = Awaited<ReturnType<typeof getContent>>;