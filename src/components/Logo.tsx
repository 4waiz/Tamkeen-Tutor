import Image from "next/image";
import { cn } from "@/lib/utils";

/** SkillCompass logo (image wordmark). */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="SkillCompass"
      width={1113}
      height={348}
      priority
      className={cn("h-12 w-auto md:h-14", className)}
    />
  );
}
