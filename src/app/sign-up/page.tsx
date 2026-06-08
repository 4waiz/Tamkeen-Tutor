"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/AuthLayout";
import { Button, Input, ErrorBanner, SuccessBanner } from "@/components/ui";
import { signUpSchema, type SignUpInput } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    setFormError(null);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    // Persist the name onto the profile row (created by the DB trigger).
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: values.fullName })
        .eq("id", data.user.id);
    }

    // If email confirmation is on, there is no session yet.
    if (!data.session) {
      setNeedsConfirm(true);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <AuthLayout
      title="Create your free account"
      subtitle="Start your diagnostic in under five minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-secondary underline">
            Sign in
          </Link>
        </>
      }
    >
      {needsConfirm ? (
        <SuccessBanner message="Account created. Check your email to confirm, then sign in. (Tip: disable email confirmation in Supabase for instant access during the hackathon.)" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {formError && <ErrorBanner message={formError} />}
          <Input
            label="Full name"
            autoComplete="name"
            required
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            helper="At least 8 characters."
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" fullWidth loading={isSubmitting} loadingText="Creating account…">
            Create my account
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
