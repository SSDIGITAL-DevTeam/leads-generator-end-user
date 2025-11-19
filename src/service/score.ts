import type { CompanyScore } from "@/types/score";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const DEFAULT_BREAKDOWN: CompanyScore["Breakdown"] = {
  bussiness_profile: 0,
  contact_completeness: 0,
  social_precense: 0,
  website_quality: 0,
};

const normalizeBreakdown = (
  source: Partial<CompanyScore["Breakdown"]> | Record<string, unknown> = {}
): CompanyScore["Breakdown"] => ({
  bussiness_profile: toNumber(
    source?.bussiness_profile ??
      (source as any)?.business_profile ??
      (source as any)?.BusinessProfile ??
      (source as any)?.BussinessProfile
  ),
  contact_completeness: toNumber(
    source?.contact_completeness ??
      (source as any)?.contactCompleteness ??
      (source as any)?.ContactCompleteness
  ),
  social_precense: toNumber(
    source?.social_precense ??
      (source as any)?.social_presence ??
      (source as any)?.socialPresence
  ),
  website_quality: toNumber(
    source?.website_quality ??
      (source as any)?.websiteQuality ??
      (source as any)?.website_quality_score
  ),
});

const normalizeScorePayload = (payload: any): CompanyScore => {
  const scoreNode =
    payload?.score ??
    payload?.data?.score ??
    payload?.data ??
    payload ??
    {};

  const breakdownNode =
    scoreNode?.Breakdown ??
    scoreNode?.breakdown ??
    payload?.Breakdown ??
    payload?.breakdown ??
    {};

  return {
    Total: toNumber(scoreNode?.Total ?? scoreNode?.total ?? payload?.Total),
    Breakdown: {
      ...DEFAULT_BREAKDOWN,
      ...normalizeBreakdown(breakdownNode),
    },
  };
};

export const DEFAULT_COMPANY_SCORE: CompanyScore = {
  Total: 0,
  Breakdown: { ...DEFAULT_BREAKDOWN },
};

export const scoreService = {
  async getCompanyScore(
    companyId: string | number
  ): Promise<CompanyScore | null> {
    const res = await fetch(`${API_BASE}/api/companies/${companyId}/score`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch company score");
    }

    const json = await res.json().catch(() => ({}));
    const payload = json?.data ?? json;
    if (!payload) {
      return null;
    }

    return normalizeScorePayload(payload);
  },
};
