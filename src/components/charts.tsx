import { cn } from "@/lib/utils";
import { scoreStatus } from "@/lib/utils";
import { Progress } from "@/components/ui";
import type { SkillScore } from "@/lib/types";

// CSS-variable backed so charts adapt to light/dark themes.
const STATUS_COLOR: Record<"success" | "warning" | "danger", string> = {
  success: "rgb(var(--color-success))",
  warning: "rgb(var(--color-warning))",
  danger: "rgb(var(--color-danger))",
};
const C_TRACK = "rgb(var(--color-surface-sunken))";
const C_BORDER = "rgb(var(--color-border))";
const C_SECONDARY = "rgb(var(--color-secondary))";
const C_PRIMARY = "rgb(var(--color-primary))";

/** Big readiness donut - pure SVG, no external chart lib. */
export function ScoreDonut({
  value,
  size = 160,
  label = "Readiness",
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const color = STATUS_COLOR[scoreStatus(v)];

  return (
    <div
      className="inline-flex flex-col items-center"
      role="img"
      aria-label={`${label}: ${v} percent`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={C_TRACK}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* dark outline ring for the neobrutalism look */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r + stroke / 2}
          fill="none"
          stroke={C_BORDER}
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - stroke / 2}
          fill="none"
          stroke={C_BORDER}
          strokeWidth={3}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          className="fill-ink font-display"
          fontSize={size * 0.26}
          fontWeight={800}
        >
          {v}%
        </text>
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          className="fill-ink font-mono"
          fontSize={size * 0.085}
          fontWeight={600}
          letterSpacing={1}
        >
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}

/** A labelled list of skill scores using Progress bars. */
export function SkillScoreList({
  scores,
  highlight,
}: {
  scores: SkillScore[];
  highlight?: string[];
}) {
  return (
    <ul className="flex flex-col gap-4">
      {scores.map((s) => {
        const isWeak = highlight?.includes(s.skill_name);
        return (
          <li key={s.skill_name}>
            <Progress
              value={s.score}
              label={`${s.skill_name}${isWeak ? " - focus area" : ""}`}
            />
          </li>
        );
      })}
    </ul>
  );
}

/** Readiness-over-time line chart (pure SVG). */
export function ProgressChart({
  points,
}: {
  points: { created_at: string; readiness_score: number }[];
}) {
  if (points.length < 2) {
    return (
      <p className="text-sm text-ink-soft">
        Complete another diagnostic to see your progress trend over time.
      </p>
    );
  }

  const w = 520;
  const h = 160;
  const pad = 24;
  const xs = points.map(
    (_, i) => pad + (i * (w - pad * 2)) / (points.length - 1),
  );
  const ys = points.map(
    (p) => h - pad - (p.readiness_score / 100) * (h - pad * 2),
  );
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full"
      role="img"
      aria-label="Readiness score over time"
    >
      {[0, 50, 100].map((g) => {
        const y = h - pad - (g / 100) * (h - pad * 2);
        return (
          <g key={g}>
            <line x1={pad} y1={y} x2={w - pad} y2={y} stroke={C_TRACK} strokeWidth={2} />
            <text x={4} y={y + 4} fontSize={10} className="fill-ink-soft font-mono">
              {g}
            </text>
          </g>
        );
      })}
      <path d={path} fill="none" stroke={C_SECONDARY} strokeWidth={4} strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={ys[i]}
          r={5}
          fill={C_PRIMARY}
          stroke={C_BORDER}
          strokeWidth={3}
        />
      ))}
    </svg>
  );
}

/** Small horizontal stat with mono value. */
export function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "success" | "warning" | "danger";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "danger"
          ? "text-danger"
          : "text-ink";
  return (
    <div>
      <p className="neo-tag text-ink-soft">{label}</p>
      <p className={cn("font-display text-2xl font-extrabold", color)}>{value}</p>
    </div>
  );
}
