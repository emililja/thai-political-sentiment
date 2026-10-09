export type DomainType = 
  | 'Regime & Authority' 
  | 'Personal & LGBTQ+ Autonomy' 
  | 'Gender Hierarchy' 
  | 'Economy & Corruption';

export type DemographicGroup = 'Ideology' | 'Age' | 'Gender' | 'Education';

export interface MCACategory {
  id: string;
  dim1: number;
  dim2: number;
  contrib_dim1: number;
  contrib_dim2: number;
  contrib_total: number;
  cos2_dim1: number;
  cos2_dim2: number;
  cos2_total: number;
  domain: DomainType;
  variableName: string;
  wvsQuestionCode: string;
  surveyQuestion: string;
  description: string;
  pairedWith?: string;
  quadrant: 1 | 2 | 3 | 4;
}

export interface SupplementaryCategory {
  id: string;
  dim1: number;
  dim2: number;
  vtest_dim1: number;
  vtest_dim2: number;
  group: DemographicGroup;
  description: string;
  isSignificantDim1: boolean;
  isSignificantDim2: boolean;
  quadrant: 1 | 2 | 3 | 4;
}

export interface MCAVariance {
  dim1: number;
  dim2: number;
  total: number;
}

export interface MCAIndividual {
  id: string;
  dim1: number;
  dim2: number;
  gender: string | null;
  age_group: string | null;
  education: string | null;
  ideology: string | null;
  quadrant?: 1 | 2 | 3 | 4;
}

export interface MCAScatterplotConfig {
  x: {
    field: string;
    label: string;
  };
  y: {
    field: string;
    label: string;
  };
  color: {
    field: string;
    label: string;
  };
}

export interface MCAPayload {
  variance: MCAVariance;
  categories: MCACategory[];
  supplementary: SupplementaryCategory[];
  individuals: MCAIndividual[];
  scatterplot: MCAScatterplotConfig;
}

export interface StorySlide {
  id: string;
  title: string;
  badge: string;
  summary: string;
  detail: string;
  highlightCategoryIds: string[];
  highlightSupplementaryIds: string[];
  activeDomain?: DomainType;
  primaryAxis: 'dim1' | 'dim2' | 'both';
  insightBadge: string;
  quote?: string;
}
