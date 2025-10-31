

export interface BusinessLead {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  city: string;
  country: string;
  rating: number;
  businessType: string;
  website: string;
  linkedin: string;
}

export interface BusinessFilters {
  search: string;
  businessType: string;
  rating: string;
  city: string;
  country: string;
}
