import Link from "next/link";
import { Logo } from "./Logo";
import { Card } from "./ui";

/** Centered, branded shell for the sign-in / sign-up screens. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b-3 border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl px-4 py-3">
          <Link href="/" className="rounded-neo-sm">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <span className="neo-tag text-secondary">SkillCompass UAE</span>
          <h1 className="mt-2 text-2xl">{title}</h1>
          <p className="mt-1 text-base text-ink-soft">{subtitle}</p>
          <Card className="mt-6">{children}</Card>
          <p className="mt-4 text-center text-sm text-ink-soft">{footer}</p>
        </div>
      </main>
    </div>
  );
}
