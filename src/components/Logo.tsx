import Image from "next/image";
import { cn } from "@/lib/utils";

/** SkillCompass logo (image wordmark) with a "UAE" suffix for branding. */
export function Logo({
  className,
  showSuffix = true,
}: {
  className?: string;
  showSuffix?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="SkillCompass"
        width={1113}
        height={348}
        priority
        className="h-8 w-auto"
      />
      {showSuffix && (
        <span className="font-display text-lg font-extrabold tracking-tight text-secondary">
          UAE
        </span>
      )}
    </span>
  );
}
