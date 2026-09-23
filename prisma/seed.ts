import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "asisjha15@gmail.com";
  const adminName = process.env.ADMIN_NAME ?? "Aashish Kumar Jha";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { email: adminEmail, name: adminName, passwordHash, role: "ADMIN" },
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Aashish Kumar Jha",
      title: "Registered Civil Engineer | Lecturer | Land & Water Resources Specialist",
      tagline: "Engineering sustainable water solutions, shaping future engineers.",
      objective: `Motivated and licensed Civil Engineer with a strong focus on **land and water resources engineering**, combined with academic experience as a **lecturer** in Nepal.

I work at the intersection of infrastructure design, irrigation/drainage systems, hydrology, and engineering education — delivering practical solutions for communities while mentoring the next generation of engineers.

Core focus areas:

- Irrigation, drainage and flood-management design
- Hydrological & hydraulic modelling
- Water supply and sanitation infrastructure
- Engineering education, curriculum delivery and student mentorship
- Site investigation, estimation and project documentation`,
      photoUrl: null,
      cvUrl: null,
      email: "asisjha15@gmail.com",
      phone: "+977 9819695416",
      phone2: "9844382565",
      location: "Janakpur, Nepal",
      necNumber: "78836",
    },
  });

  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          role: "Lecturer — Civil Engineering",
          institution: "Koshi Institute of Technology (Affiliated to Purbanchal University)",
          location: "Biratnagar, Nepal",
          startDate: new Date("2023-01-01"),
          current: true,
          description:
            "Delivering undergraduate courses in Hydraulics, Fluid Mechanics, Irrigation Engineering, Surveying and Estimation. Mentoring final-year project students, preparing course materials, and coordinating laboratory/practical sessions.",
          order: 1,
        },
        {
          role: "Lecturer — Civil Engineering",
          institution: "College of Engineering & Management, Kapilvastu",
          location: "Taulihawa, Nepal",
          startDate: new Date("2021-01-01"),
          endDate: new Date("2022-12-31"),
          description:
            "Taught core civil engineering subjects including Engineering Hydrology, Soil Mechanics, and Structural Analysis. Supervised site visits, practical classes and student seminars.",
          order: 2,
        },
        {
          role: "Site Engineer — Water Resources",
          institution: "Government / Municipal Water Supply & Irrigation Projects",
          location: "Madhesh Province, Nepal",
          startDate: new Date("2018-01-01"),
          endDate: new Date("2020-12-31"),
          description:
            "Supervised irrigation canal lining, drainage and flood-control works. Performed site investigation, measurement book preparation, BOQ estimation and quality control as per Department of Irrigation standards.",
          order: 3,
        },
      ],
    });
  }

  const educationCount = await prisma.education.count();
  if (educationCount === 0) {
    await prisma.education.createMany({
      data: [
        {
          degree: "M.E. — Water Resources Engineering (Pursued / Relevant Coursework)",
          institution: "Institute of Engineering, Tribhuvan University",
          year: "—",
          order: 1,
        },
        {
          degree: "B.E. — Civil Engineering",
          institution: "Institute of Engineering, Tribhuvan University",
          year: "2017",
          percentage: "First Division",
          order: 2,
        },
        {
          degree: "Higher Secondary (+2) — Science",
          institution: "National Higher Secondary School, Janakpur",
          year: "2012",
          percentage: "First Division",
          order: 3,
        },
        {
          degree: "School Leaving Certificate (SLC)",
          institution: "Janakpur, Nepal",
          year: "2010",
          order: 4,
        },
      ],
    });
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Irrigation Canal Lining & Distribution Network Improvement",
          type: "PROJECT",
          year: "2022",
          description:
            "Detailed design and supervision of canal lining and water-distribution network for command-area improvement, including cross-drainage structures, water measurement devices and BOQ estimation.",
          order: 1,
        },
        {
          title: "Urban Drainage & Flood Mitigation Study — Janakpur",
          type: "RESEARCH",
          year: "2023",
          description:
            "Hydrological and hydraulic assessment of urban drainage catchments in Janakpur, identifying flood-prone reaches and recommending drainage improvements and low-cost retention measures.",
          order: 2,
        },
        {
          title: "Assessment of Rainfall–Runoff Characteristics of a Catchment in Madhesh Province",
          type: "THESIS",
          year: "2021",
          description:
            "Academic research comparing runoff estimates using rational method, SCS-CN and observed gauged data, evaluating model applicability for small agricultural catchments.",
          order: 3,
        },
        {
          title: "Water Supply Scheme Design for a Rural Settlement",
          type: "PROJECT",
          year: "2020",
          description:
            "Design of a gravity-fed water supply scheme including catchment protection, sedimentation tank, distribution piping and sanitation linkages for a rural community.",
          order: 4,
        },
      ],
    });
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { category: "Software", name: "AutoCAD", order: 1 },
        { category: "Software", name: "EPANET", order: 2 },
        { category: "Software", name: "HEC-HMS / HEC-RAS", order: 3 },
        { category: "Software", name: "MS Office", order: 4 },
        { category: "Software", name: "STAAD Pro", order: 5 },
        { category: "Tools", name: "Total Station Surveying", order: 1 },
        { category: "Tools", name: "Level & Chain Survey", order: 2 },
        { category: "Tools", name: "BOQ Estimation", order: 3 },
        { category: "Tools", name: "Hydrological Modelling", order: 4 },
        { category: "Tools", name: "Measurement Book / Rate Analysis", order: 5 },
        { category: "Strengths", name: "Water Resources Engineering", order: 1 },
        { category: "Strengths", name: "Irrigation & Drainage Design", order: 2 },
        { category: "Strengths", name: "Teaching & Mentorship", order: 3 },
        { category: "Strengths", name: "Technical Report Writing", order: 4 },
        { category: "Strengths", name: "Team Leadership", order: 5 },
      ],
    });
  }

  const membershipCount = await prisma.membership.count();
  if (membershipCount === 0) {
    await prisma.membership.createMany({
      data: [
        {
          organization: "Nepal Engineering Council (NEC)",
          status: "Registered Engineer",
          regNumber: "78836",
          url: "https://nec.org.np/",
          order: 1,
        },
        {
          organization: "Nepal Engineers' Association (NEA)",
          status: "Member",
          regNumber: null,
          url: "https://nea.org.np/",
          order: 2,
        },
      ],
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Former Student",
          role: "B.E. Civil Engineering",
          message:
            "Sir made hydraulics and irrigation design genuinely understandable. His real-world project examples connected theory to practice better than any textbook.",
          approved: true,
          order: 1,
        },
        {
          name: "Project Supervisor",
          role: "Water Resources Division",
          message:
            "Aashish brought clarity and discipline to our drainage study — thorough analysis, well-documented reports and dependable site supervision.",
          approved: true,
          order: 2,
        },
      ],
    });
  }

  console.log("Seed completed ✓");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
