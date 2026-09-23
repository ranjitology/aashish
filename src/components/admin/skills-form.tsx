"use client";

import { useFormState } from "react-dom";
import type { Skill } from "@prisma/client";
import { saveSkills } from "@/lib/actions/skills";
import type { ActionResult } from "@/lib/actions/tools";
import { useResultToast } from "@/hooks/use-result-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

function skillsToText(skills: Skill[], category: string) {
  return skills
    .filter((s) => s.category === category)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.name)
    .join("\n");
}

export function SkillsForm({ skills }: { skills: Skill[] }) {
  const [state, formAction] = useFormState(saveSkills, null as ActionResult | null);
  useResultToast(state);

  const groups = [
    {
      key: "software" as const,
      title: "Software",
      description: "CAD, modelling and office tools.",
      placeholder: "AutoCAD\nHEC-RAS\nMS Office",
      category: "Software",
    },
    {
      key: "tools" as const,
      title: "Tools & methods",
      description: "Field, surveying and estimation methods.",
      placeholder: "Total Station Surveying\nBOQ Estimation",
      category: "Tools",
    },
    {
      key: "strengths" as const,
      title: "Core strengths",
      description: "Specialist and soft skills.",
      placeholder: "Water Resources Engineering\nTeaching & Mentorship",
      category: "Strengths",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Skills & Tools"
        description="One skill per line (commas also work). Saving replaces each category list."
      />

      <form action={formAction}>
        <div className="grid gap-6 lg:grid-cols-3">
          {groups.map((group) => (
            <Card key={group.key}>
              <CardHeader>
                <CardTitle className="font-serif text-lg">{group.title}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Field label={`List of ${group.title.toLowerCase()}`} htmlFor={`skills-${group.key}`}>
                  <Textarea
                    id={`skills-${group.key}`}
                    name={group.key}
                    rows={12}
                    defaultValue={skillsToText(skills, group.category)}
                    placeholder={group.placeholder}
                    className="font-mono text-sm"
                  />
                </Field>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <SubmitButton state={state} label="Save skills" />
        </div>
      </form>
    </div>
  );
}