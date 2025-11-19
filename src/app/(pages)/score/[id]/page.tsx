import { ScoreCard, SCORE_CATEGORY_DESCRIPTORS } from "@/_components/ScoreCard";
import type { CompanyScore } from "@/types/score";

type BreakdownKey = keyof CompanyScore["Breakdown"];

const BREAKDOWN_SECTIONS: Array<{
  key: BreakdownKey;
  label: string;
  maxScore: number;
}> = [
  { key: "bussiness_profile", label: "Business Profile", maxScore: 20 },
  { key: "contact_completeness", label: "Contact Completeness", maxScore: 30 },
  { key: "social_precense", label: "Social Presence", maxScore: 20 },
  { key: "website_quality", label: "Website Quality", maxScore: 30 },
];

const CATEGORY_POINTS = [
  {
    category: "Business Profile",
    maximum: 20,
    description:
      "Evaluates the validity and quality of the company name, domain, and address information.",
  },
  {
    category: "Contact Completeness",
    maximum: 30,
    description:
      "Measures how many valid contact channels are available such as emails, phone numbers, social links, or contact forms.",
  },
  {
    category: "Social Presence",
    maximum: 20,
    description:
      "Checks for the presence of social media profiles across multiple platforms.",
  },
  {
    category: "Website Quality",
    maximum: 30,
    description:
      "Analyzes the website technical and content quality including HTTPS, About page, and Contact section.",
  },
];

type ScorePageProps = {
  params: { id: string };
};

type DummyCompanyProfile = {
  name: string;
  industry: string;
  location: string;
  description: string;
};

const sumBreakdown = (breakdown: CompanyScore["Breakdown"]) =>
  BREAKDOWN_SECTIONS.reduce(
    (total, section) => total + breakdown[section.key],
    0
  );

const createScore = (breakdown: CompanyScore["Breakdown"]): CompanyScore => ({
  Total: sumBreakdown(breakdown),
  Breakdown: breakdown,
});

const DUMMY_COMPANY_PRESETS: Record<string, DummyCompanyProfile> = {
  "1": {
    name: "Aurora Dental Clinic",
    industry: "Healthcare Services",
    location: "Bandung, Indonesia",
    description:
      "Boutique dental practice that recently expanded to two satellite clinics and invests heavily in digital outreach.",
  },
  "2": {
    name: "Green Valley Organics",
    industry: "Food & Beverage",
    location: "Surabaya, Indonesia",
    description:
      "Organic produce supplier for premium supermarkets with an active ecommerce storefront and weekly social campaigns.",
  },
  "3": {
    name: "Stellar Insight Analytics",
    industry: "B2B SaaS",
    location: "Jakarta, Indonesia",
    description:
      "Customer intelligence platform serving enterprise retail brands with a strong technical and marketing footprint.",
  },
  "aurora-retail": {
    name: "Aurora Retail Collective",
    industry: "Retail & Lifestyle",
    location: "Singapore",
    description:
      "Multi-brand concept store that leverages pop-up events and omnichannel marketing to reach urban shoppers.",
  },
};

const DUMMY_SCORE_PRESETS: Record<string, CompanyScore> = {
  "1": createScore({
    bussiness_profile: 18,
    contact_completeness: 0,
    social_precense: 0,
    website_quality: 0,
  }),
  "2": createScore({
    bussiness_profile: 16,
    contact_completeness: 0,
    social_precense: 18,
    website_quality: 25,
  }),
  "3": createScore({
    bussiness_profile: 0,
    contact_completeness: 27,
    social_precense: 19,
    website_quality: 29,
  }),
  "aurora-retail": createScore({
    bussiness_profile: 15,
    contact_completeness: 22,
    social_precense: 20,
    website_quality: 26,
  }),
};

const sanitizeIdentifier = (value: string) => value.trim().toLowerCase();

const createEmptyBreakdown = (): CompanyScore["Breakdown"] => ({
  bussiness_profile: 0,
  contact_completeness: 0,
  social_precense: 0,
  website_quality: 0,
});

const generateScoreFromSeed = (seedInput: string): CompanyScore => {
  const seed =
    seedInput.length > 0
      ? seedInput.split("").reduce((acc, char, index) => {
          return acc + char.charCodeAt(0) * (index + 3);
        }, 0)
      : 83;

  const breakdown = BREAKDOWN_SECTIONS.reduce(
    (acc, section, index) => {
      const minValue = Math.round(section.maxScore * 0.7);
      const availableRange = Math.max(section.maxScore - minValue + 1, 1);
      const variation = (seed + index * 11) % availableRange;
      acc[section.key] = Math.min(section.maxScore, minValue + variation);
      return acc;
    },
    createEmptyBreakdown()
  );

  return {
    Total: sumBreakdown(breakdown),
    Breakdown: breakdown,
  };
};

const getDummyCompany = (id: string): DummyCompanyProfile => {
  const normalizedId = sanitizeIdentifier(id);
  return (
    DUMMY_COMPANY_PRESETS[normalizedId] ?? {
      name: `Company #${id}`,
      industry: "General Services",
      location: "Indonesia",
      description:
        "Placeholder company for layout preview. Replace this description once live data is available.",
    }
  );
};

const getDummyScore = (id: string): CompanyScore => {
  const normalizedId = sanitizeIdentifier(id);
  return DUMMY_SCORE_PRESETS[normalizedId] ?? generateScoreFromSeed(normalizedId);
};

export default function ScorePage({ params }: ScorePageProps) {
  const company = getDummyCompany(params.id);
  const score = getDummyScore(params.id);
  const companyName = company.name;

  return (
    <section className="space-y-8 pb-12">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-slate-500">
          {company.industry} &middot; {company.location}
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">
          Lead Score Overview
        </h1>
        <p className="text-sm text-slate-600">{company.description}</p>
      </header>

      <div className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{companyName}</span>
        <span className="mx-2 text-slate-400">{">"}</span>
        <span className="text-slate-600">Score</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScoreCard title="Total Score" score={score.Total} variant="total" />

        {BREAKDOWN_SECTIONS.map((section) => (
          <ScoreCard
            key={section.key}
            title={section.label}
            score={score.Breakdown[section.key] ?? 0}
            maxScore={section.maxScore}
          />
        ))}
      </div>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Lead Scoring Explanation
          </h2>
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            <p>
              Our system automatically evaluates each business profile through a
              Lead Scoring Engine. The score helps you understand how complete
              and credible the lead data is.
            </p>
            <p>
              It is calculated from four main categories with a total of 100
              points:
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Maximum Points</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {CATEGORY_POINTS.map((row) => (
                <tr key={row.category}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {row.category}
                  </td>
                  <td className="px-4 py-3">{row.maximum}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Total Score Meaning
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use the banding below as a quick reference when prioritizing which
            leads to contact first.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Score Range</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {SCORE_CATEGORY_DESCRIPTORS.map((descriptor) => (
                <tr key={descriptor.key}>
                  <td className="px-4 py-3">
                    {descriptor.min} - {descriptor.max}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <span className="mr-2" aria-hidden>
                      {descriptor.emoji}
                    </span>
                    {descriptor.label}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {descriptor.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
