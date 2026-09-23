import type { Metadata } from "next";
import { db } from "@/lib/db";
import type { Profile } from "@prisma/client";
import { ProfileForm } from "@/components/admin/profile-form";

export const metadata: Metadata = { title: "Profile" };

const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "Aashish Kumar Jha",
  title: "Registered Civil Engineer | Lecturer | Land & Water Resources Specialist",
  tagline: "Engineering sustainable water solutions, shaping future engineers.",
  objective: "",
  photoUrl: null,
  cvUrl: null,
  email: "asisjha15@gmail.com",
  phone: "+977 9819695416",
  phone2: "9844382565",
  location: "Janakpur, Nepal",
  necNumber: "78836",
  updatedAt: new Date(),
};

export default async function ProfileAdminPage() {
  const profile = await db.profile
    .findUnique({ where: { id: 1 } })
    .catch(() => null);

  return <ProfileForm profile={profile ?? DEFAULT_PROFILE} />;
}