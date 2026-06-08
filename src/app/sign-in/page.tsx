"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/AuthLayout";
import { Button, Input, ErrorBanner } from "@/components/ui";
import { signInSchema, type SignInInput } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setFormError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    const redirect = params.get("redirect") || "/dashboard";
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {formError && <ErrorBanner message={formError} />}
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
        autoComplete="current-password"
        required
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" fullWidth loading={isSubmitting} loadingText="Signing in…">
        Sign in
      </Button>
    </form>
  );
}

export default function SignInPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning path."
      footer={
        <>
          New here?{" "}
          <Link href="/sign-up" className="font-semibold text-secondary underline">
            Create a free account
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}
