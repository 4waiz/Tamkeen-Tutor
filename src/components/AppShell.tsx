"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { signOut } from "@/app/auth/actions";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/assessment", label: "Assessment" },
  { href: "/report", label: "Report" },
  { href: "/learning-path", label: "Learning path" },
  { href: "/tutor", label: "Tutor" },
  { href: "/mentor", label: "Mentor" },
  { href: "/settings", label: "Settings" },
];

/**
 * Authenticated app frame: top bar with brand, primary nav, and sign-out.
 * Responsive - nav collapses to a toggle on small screens. Keyboard
 * navigable with visible focus rings (from globals).
 */
export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 border-b-3 border-border bg-surface-raised">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/dashboard" className="rounded-neo-sm">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-neo-sm border-3 px-3 py-1.5 text-sm font-semibold transition-colors",
                        active
                          ? "border-border bg-primary text-primary-fg shadow-neo-sm"
                          : "border-transparent text-ink hover:border-border hover:bg-surface-sunken",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {userName && (
              <span className="hidden items-center rounded-full border-3 border-border bg-surface-sunken px-3 py-1 text-sm font-semibold text-ink sm:inline-flex">
                {userName}
              </span>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-neo-sm border-3 border-border bg-surface-raised px-3 py-1.5 text-sm font-semibold shadow-neo-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign out
              </button>
            </form>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-neo-sm border-3 border-border bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-fg shadow-neo-sm lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Primary mobile"
            className="border-t-3 border-border bg-surface-raised px-4 py-3 lg:hidden"
          >
            <ul className="grid grid-cols-2 gap-2">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block rounded-neo-sm border-3 border-border px-3 py-2 text-sm font-semibold",
                        active
                          ? "bg-primary text-primary-fg shadow-neo-sm"
                          : "bg-surface-raised",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
