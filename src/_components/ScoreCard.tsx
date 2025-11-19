import { cn } from "@/lib/utils";

type ScoreCategoryKey = "poor" | "medium" | "strong" | "premium";

export type ScoreCardVariant = "total" | "breakdown";

export interface ScoreCategoryDescriptor {
  key: ScoreCategoryKey;
  label: string;
  min: number;
  max: number;
  emoji: string;
  description: string;
  theme: {
    wrapper: string;
    badge: string;
    text: string;
    subtext: string;
    kicker: string;
  };
}

export const SCORE_CATEGORY_DESCRIPTORS: ScoreCategoryDescriptor[] = [
  {
    key: "poor",
    label: "Poor Lead",
    min: 0,
    max: 30,
    emoji: "🟥",
    description: "Limited and low-confidence data. Needs verification before outreach.",
    theme: {
      wrapper: "bg-[#FFBBB5] border-[#FEE4E2]",
      badge: "bg-white/80 text-[#B42318] border border-[#FECACA]",
      text: "text-[#B42318]",
      subtext: "text-[#7A271A]",
      kicker: "text-[#B42318]",
    },
  },
  {
    key: "medium",
    label: "Medium Lead",
    min: 30,
    max: 60,
    emoji: "🟨",
    description: "Basic business info is present but multiple key elements are missing.",
    theme: {
      wrapper: "bg-[#FEF7CD] border-[#FDE68A]",
      badge: "bg-white/80 text-[#B45309] border border-[#F97316]/40",
      text: "text-[#B45309]",
      subtext: "text-[#78350F]",
      kicker: "text-[#B45309]",
    },
  },
  {
    key: "strong",
    label: "Strong Lead",
    min: 60,
    max: 80,
    emoji: "🟩",
    description: "Well documented with active signals. Ready for contact with minimal prep.",
    theme: {
      wrapper: "bg-[#C2FFDB] border-[#BBF7D0]",
      badge: "bg-white/90 text-[#027A48] border border-[#34D399]/50",
      text: "text-[#027A48]",
      subtext: "text-[#05603A]",
      kicker: "text-[#027A48]",
    },
  },
  {
    key: "premium",
    label: "Premium Lead",
    min: 80,
    max: 100,
    emoji: "🟦",
    description: "Complete, verified, and high-value profile with rich engagement signals.",
    theme: {
      wrapper: "bg-[#C4D9FF] border-[#BFDBFE]",
      badge: "bg-white/90 text-[#1D4ED8] border border-[#93C5FD]",
      text: "text-[#1D4ED8]",
      subtext: "text-[#1E40AF]",
      kicker: "text-[#1D4ED8]",
    },
  },
];

export const resolveScoreCategory = (
  value: number
): ScoreCategoryDescriptor => {
  const sanitized = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(Math.max(sanitized, 0), 100);

  if (clamped < 30) {
    return SCORE_CATEGORY_DESCRIPTORS[0];
  }
  if (clamped < 60) {
    return SCORE_CATEGORY_DESCRIPTORS[1];
  }
  if (clamped < 80) {
    return SCORE_CATEGORY_DESCRIPTORS[2];
  }

  return SCORE_CATEGORY_DESCRIPTORS[3];
};

interface ScoreCardProps {
  title: string;
  score: number | string | null | undefined;
  variant?: ScoreCardVariant;
  maxScore?: number;
  description?: string;
}

export const ScoreCard = ({
  title,
  score,
  variant = "breakdown",
  maxScore,
  description,
}: ScoreCardProps) => {
  const value = Number(score ?? 0);
  const isTotal = variant === "total";
  const category = isTotal ? resolveScoreCategory(value) : null;
  const theme = category?.theme ?? {
    wrapper: "bg-white border-[#E2E8F0]",
    badge: "bg-slate-100 text-slate-700 border border-slate-200",
    text: "text-slate-900",
    subtext: "text-slate-600",
    kicker: "text-slate-500",
  };

  const formattedScore = Number.isFinite(value)
    ? value.toFixed(0)
    : (score as string) ?? "0";

  const detailCopy =
    description ?? category?.description ?? "No description provided.";

  return (
    <article
      className={cn(
        "rounded-2xl border p-6 shadow-sm transition-all",
        isTotal ? "lg:col-span-2" : "",
        theme.wrapper
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className={cn("text-xs font-semibold uppercase", theme.kicker)}>
            {title}
          </p>
          <p className={cn("mt-4 text-4xl font-bold leading-none", theme.text)}>
            {formattedScore}
            {!isTotal && typeof maxScore === "number" ? (
              <span className="ml-1 text-lg font-semibold text-slate-400">
                / {maxScore}
              </span>
            ) : null}
          </p>
        </div>

        {isTotal && category ? (
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold",
              theme.badge
            )}
          >
            <span aria-hidden>{category.emoji}</span>
            {category.label}
          </span>
        ) : null}
      </div>

      {(isTotal || description) && (
        <p className={cn("mt-4 text-sm leading-relaxed", theme.subtext)}>
          {detailCopy}
        </p>
      )}
    </article>
  );
};
