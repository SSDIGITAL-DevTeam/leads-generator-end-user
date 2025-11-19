export interface ScoreBreakdown {
  bussiness_profile: number;
  contact_completeness: number;
  social_precense: number;
  website_quality: number;
}

export interface CompanyScore {
  Total: number;
  Breakdown: ScoreBreakdown;
}
