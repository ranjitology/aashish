"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import Image from "next/image";
import { FileText, ImagePlus } from "lucide-react";
import type { Profile } from "@prisma/client";
import { updateProfile } from "@/lib/actions/profile";
import type { ActionResult } from "@/lib/actions/tools";
import { useResultToast } from "@/hooks/use-result-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/admin/field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useFormState(updateProfile, null as ActionResult | null);
  const [isPending, startTransition] = useTransition();

  useResultToast(state);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  return (
    <div>
      <PageHeader
        title="Profile & About"
        description="Identity, contact details, CV and the About section objective."
      />

      <form
        action={(formData) => startTransition(() => formAction(formData))}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Identity & headline</CardTitle>
            <CardDescription>Displayed in the hero, navbar and footer.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="pf-name">
              <Input id="pf-name" name="name" defaultValue={profile.name} required />
            </Field>
            <Field label="NEC registration number" htmlFor="pf-nec">
              <Input id="pf-nec" name="necNumber" defaultValue={profile.necNumber} required />
            </Field>
            <Field label="Professional title" htmlFor="pf-title" className="sm:col-span-2">
              <Input
                id="pf-title"
                name="title"
                defaultValue={profile.title}
                required
                placeholder="Registered Civil Engineer | Lecturer | ..."
              />
            </Field>
            <Field label="Tagline" htmlFor="pf-tagline" className="sm:col-span-2">
              <Input
                id="pf-tagline"
                name="tagline"
                defaultValue={profile.tagline}
                required
                placeholder="Engineering sustainable water solutions..."
              />
            </Field>
            <Field
              label="Objective / About (Markdown supported)"
              className="sm:col-span-2"
              hint="Bold with **text**, bullet lists with -, headings with ###."
            >
              <Textarea
                name="objective"
                rows={12}
                defaultValue={profile.objective}
                required
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Contact details</CardTitle>
            <CardDescription>Shown in the hero, contact section and footer.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="pf-email">
              <Input id="pf-email" name="email" type="email" defaultValue={profile.email} required />
            </Field>
            <Field label="Phone" htmlFor="pf-phone">
              <Input id="pf-phone" name="phone" defaultValue={profile.phone} required />
            </Field>
            <Field label="Alternate phone" htmlFor="pf-phone2">
              <Input id="pf-phone2" name="phone2" defaultValue={profile.phone2 ?? ""} />
            </Field>
            <Field label="Location" htmlFor="pf-location">
              <Input id="pf-location" name="location" defaultValue={profile.location} required />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Photo & CV</CardTitle>
            <CardDescription>
              Photo used in the hero; CV powers the &ldquo;Download CV&rdquo; button.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Field label="Profile photo" htmlFor="pf-photo" hint="JPG or PNG, square works best.">
                <Input
                  id="pf-photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setPhotoPreview((prev) => {
                      if (prev) URL.revokeObjectURL(prev);
                      return file ? URL.createObjectURL(file) : null;
                    });
                  }}
                />
              </Field>
              <div className="relative aspect-square w-40 overflow-hidden rounded-xl border bg-muted">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Photo preview"
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                ) : profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={profile.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">No photo</span>
                  </div>
                )}
              </div>
              {profile.photoUrl ? (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="removePhoto"
                    className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                  />
                  Remove current photo
                </label>
              ) : null}
            </div>

            <div className="space-y-3">
              <Field label="CV file (PDF)" htmlFor="pf-cv" hint="Shown as the Download CV button.">
                <Input id="pf-cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
              </Field>
              {profile.cvUrl ? (
                <>
                  <a
                    href={profile.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-aqua hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Current CV
                  </a>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="removeCv"
                      className="h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
                    />
                    Remove current CV
                  </label>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No CV uploaded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <SubmitButton
          state={state}
          label="Save profile"
          disabled={isPending}
          className="w-full sm:w-auto"
        />
      </form>
    </div>
  );
}