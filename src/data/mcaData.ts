import rawJson from '../../thai_values_mca.json';
import { MCACategory, SupplementaryCategory, DomainType, DemographicGroup, StorySlide } from '../types/mca';

export const DOMAIN_COLORS: Record<DomainType, { 
  bg: string; 
  border: string; 
  text: string; 
  fill: string; 
  badgeBg: string;
  badgeBorder: string;
}> = {
  'Regime & Authority': {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    fill: '#F43F5E',
    badgeBg: 'bg-rose-950/60',
    badgeBorder: 'border-rose-800'
  },
  'Personal & LGBTQ+ Autonomy': {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    fill: '#A855F7',
    badgeBg: 'bg-violet-950/60',
    badgeBorder: 'border-violet-800'
  },
  'Gender Hierarchy': {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    fill: '#F59E0B',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-800'
  },
  'Economy & Corruption': {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    fill: '#10B981',
    badgeBg: 'bg-emerald-950/60',
    badgeBorder: 'border-emerald-800'
  }
};

export const DEMOGRAPHIC_COLORS: Record<DemographicGroup, { 
  border: string; 
  text: string; 
  fill: string;
  iconBg: string;
}> = {
  'Ideology': {
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    fill: '#06B6D4',
    iconBg: 'bg-cyan-950'
  },
  'Age': {
    border: 'border-pink-500/40',
    text: 'text-pink-400',
    fill: '#EC4899',
    iconBg: 'bg-pink-950'
  },
  'Gender': {
    border: 'border-sky-500/40',
    text: 'text-sky-400',
    fill: '#38BDF8',
    iconBg: 'bg-sky-950'
  },
  'Education': {
    border: 'border-indigo-500/40',
    text: 'text-indigo-400',
    fill: '#6366F1',
    iconBg: 'bg-indigo-950'
  }
};

const CATEGORY_METADATA: Record<string, {
  domain: DomainType;
  variable: string;
  wvsQuestion: string;
  surveyQuestion: string;
  description: string;
  pairedWith?: string;
}> = {
  'Defend Society': {
    domain: 'Regime & Authority',
    variable: 'Society_Reform',
    wvsQuestion: 'Q42',
    surveyQuestion: 'Basic attitude toward society: Present society must be valiantly defended against all subversive forces.',
    description: 'Conservative stance emphasizing order, stability, and protection of the existing social establishment.',
    pairedWith: 'Radical Change'
  },
  'Gradual Reform': {
    domain: 'Regime & Authority',
    variable: 'Society_Reform',
    wvsQuestion: 'Q42',
    surveyQuestion: 'Basic attitude toward society: Society must be gradually improved by reforms.',
    description: 'Pragmatic reformist stance favoring institutional evolution within established frameworks.',
    pairedWith: 'Radical Change'
  },
  'Radical Change': {
    domain: 'Regime & Authority',
    variable: 'Society_Reform',
    wvsQuestion: 'Q42',
    surveyQuestion: 'Basic attitude toward society: The entire way our society is organized must be radically changed by revolutionary action.',
    description: 'Transformational or revolutionary desire to overhaul Thai governance and power structures.',
    pairedWith: 'Defend Society'
  },
  'Army Rule: Bad': {
    domain: 'Regime & Authority',
    variable: 'Army_Rule',
    wvsQuestion: 'Q237',
    surveyQuestion: 'Political system evaluation: Having the armed forces govern the country.',
    description: 'Explicit rejection of military junta rule and military interference in governance.',
    pairedWith: 'Army Rule: Good'
  },
  'Army Rule: Good': {
    domain: 'Regime & Authority',
    variable: 'Army_Rule',
    wvsQuestion: 'Q237',
    surveyQuestion: 'Political system evaluation: Having the armed forces govern the country.',
    description: 'Acceptance of military government as a stabilizing guardian force.',
    pairedWith: 'Army Rule: Bad'
  },
  'Leader: Bad': {
    domain: 'Regime & Authority',
    variable: 'Strong_Leader',
    wvsQuestion: 'Q235',
    surveyQuestion: 'Political system evaluation: Having a strong leader who does not have to bother with parliament and elections.',
    description: 'Strong rejection of autocratic personal rule; insistence on parliamentary and electoral checks.',
    pairedWith: 'Leader: Good'
  },
  'Leader: Good': {
    domain: 'Regime & Authority',
    variable: 'Strong_Leader',
    wvsQuestion: 'Q235',
    surveyQuestion: 'Political system evaluation: Having a strong leader who does not have to bother with parliament and elections.',
    description: 'Appetite for authoritarian paternalism and decisive executive action unconstrained by parliamentary delays.',
    pairedWith: 'Leader: Bad'
  },
  'Army Coup: Compatible': {
    domain: 'Regime & Authority',
    variable: 'Army_Democratic',
    wvsQuestion: 'Q245',
    surveyQuestion: 'Characteristic of democracy: The army takes over when the government is incompetent.',
    description: 'Belief that military intervention is a legitimate democratic correction mechanism.',
    pairedWith: 'Army Coup: Non-Dem'
  },
  'Army Coup: Non-Dem': {
    domain: 'Regime & Authority',
    variable: 'Army_Democratic',
    wvsQuestion: 'Q245',
    surveyQuestion: 'Characteristic of democracy: The army takes over when the government is incompetent.',
    description: 'Constitutionalist principle that military coups inherently subvert democratic governance.',
    pairedWith: 'Army Coup: Compatible'
  },
  'Gay: Justifiable': {
    domain: 'Personal & LGBTQ+ Autonomy',
    variable: 'LGBTQ_Justifiable',
    wvsQuestion: 'Q182',
    surveyQuestion: 'Moral justifiability scale (1-10): Homosexuality (5-10: Justifiable).',
    description: 'Progressive moral acceptance of diverse sexual orientations and individual freedom.',
    pairedWith: 'Gay: Never/Rarely'
  },
  'Gay: Never/Rarely': {
    domain: 'Personal & LGBTQ+ Autonomy',
    variable: 'LGBTQ_Justifiable',
    wvsQuestion: 'Q182',
    surveyQuestion: 'Moral justifiability scale (1-10): Homosexuality (1-4: Never or rarely justifiable).',
    description: 'Traditional moral disapproval of homosexual relations based on conservative cultural norms.',
    pairedWith: 'Gay: Justifiable'
  },
  'Gay Parents: Agree': {
    domain: 'Personal & LGBTQ+ Autonomy',
    variable: 'SameSex_Parents',
    wvsQuestion: 'Q36',
    surveyQuestion: 'Attitude toward family: Homosexual couples are as good parents as other couples.',
    description: 'Endorsement of equal parenting capability and adoption rights for same-sex partners.',
    pairedWith: 'Gay Parents: Disagree/Neutral'
  },
  'Gay Parents: Disagree/Neutral': {
    domain: 'Personal & LGBTQ+ Autonomy',
    variable: 'SameSex_Parents',
    wvsQuestion: 'Q36',
    surveyQuestion: 'Attitude toward family: Homosexual couples are as good parents as other couples.',
    description: 'Reservations or opposition to non-traditional family structures and same-sex parenting.',
    pairedWith: 'Gay Parents: Agree'
  },
  'Men Lead: Agree': {
    domain: 'Gender Hierarchy',
    variable: 'Men_Better_Leaders',
    wvsQuestion: 'Q29',
    surveyQuestion: 'Gender equality in politics: On the whole, men make better political leaders than women do.',
    description: 'Traditional patriarchal belief favoring male dominance in civic and political leadership.',
    pairedWith: 'Men Lead: Disagree'
  },
  'Men Lead: Disagree': {
    domain: 'Gender Hierarchy',
    variable: 'Men_Better_Leaders',
    wvsQuestion: 'Q29',
    surveyQuestion: 'Gender equality in politics: On the whole, men make better political leaders than women do.',
    description: 'Egalitarian conviction that leadership capability is independent of gender.',
    pairedWith: 'Men Lead: Agree'
  },
  'Men Job: Agree': {
    domain: 'Gender Hierarchy',
    variable: 'Men_Job_Priority',
    wvsQuestion: 'Q33',
    surveyQuestion: 'Gender and economic scarcity: When jobs are scarce, men should have more right to a job than women.',
    description: 'Patriarchal breadwinner ideology prioritizing male employment during economic downturns.',
    pairedWith: 'Men Job: Disagree/Neutral'
  },
  'Men Job: Disagree/Neutral': {
    domain: 'Gender Hierarchy',
    variable: 'Men_Job_Priority',
    wvsQuestion: 'Q33',
    surveyQuestion: 'Gender and economic scarcity: When jobs are scarce, men should have more right to a job than women.',
    description: 'Support for workplace meritocracy and gender equality in employment opportunity.',
    pairedWith: 'Men Job: Agree'
  },
  'Corrupt: High': {
    domain: 'Economy & Corruption',
    variable: 'Corruption_Level',
    wvsQuestion: 'Q112',
    surveyQuestion: 'Perception of corruption: How widespread is bribe-taking and corruption in this country? (8-10: High).',
    description: 'Acute perception that systemic graft and state corruption severely compromise governance.',
    pairedWith: 'Corrupt: Low/Mod'
  },
  'Corrupt: Low/Mod': {
    domain: 'Economy & Corruption',
    variable: 'Corruption_Level',
    wvsQuestion: 'Q112',
    surveyQuestion: 'Perception of corruption: How widespread is bribe-taking and corruption in this country? (1-7: Low/Moderate).',
    description: 'More lenient or normalized assessment of corruption levels among public officials.',
    pairedWith: 'Corrupt: High'
  },
  'Welfare: Self-Reliance': {
    domain: 'Economy & Corruption',
    variable: 'Gov_Responsibility',
    wvsQuestion: 'Q108',
    surveyQuestion: 'Role of government vs individual: People should take more responsibility to provide for themselves (6-10).',
    description: 'Economic individualism and self-sufficiency philosophy skeptical of state welfare dependence.',
    pairedWith: 'Welfare: State'
  },
  'Welfare: State': {
    domain: 'Economy & Corruption',
    variable: 'Gov_Responsibility',
    wvsQuestion: 'Q108',
    surveyQuestion: 'Role of government vs individual: Government should take more responsibility to ensure everyone is provided for (1-5).',
    description: 'Social democratic expectation of robust government safety nets and redistributive welfare.',
    pairedWith: 'Welfare: Self-Reliance'
  }
};

const SUPPLEMENTARY_DESCRIPTIONS: Record<string, { group: DemographicGroup; description: string }> = {
  'Center': { group: 'Ideology', description: 'Self-placed at scale positions 5-6 on the 10-point Left-Right ideological spectrum.' },
  'Left': { group: 'Ideology', description: 'Self-placed at scale positions 1-4 on the Left-Right spectrum.' },
  'Right': { group: 'Ideology', description: 'Self-placed at scale positions 7-10 on the Left-Right spectrum.' },
  'No Ideology Label': { group: 'Ideology', description: 'Respondents who declined, were unsure, or rejected Left-Right self-identification (over 40% of Thais).' },
  'Female': { group: 'Gender', description: 'Female survey respondents.' },
  'Male': { group: 'Gender', description: 'Male survey respondents.' },
  'Gender.NA': { group: 'Gender', description: 'Respondents with unspecified gender recorded.' },
  '18-29': { group: 'Age', description: 'Youth cohort (ages 18-29) at the center of modern student civic movements.' },
  '30-49': { group: 'Age', description: 'Working-age adult cohort (ages 30-49).' },
  '50+': { group: 'Age', description: 'Older adult & senior cohort (ages 50 and above).' },
  'Edu: High': { group: 'Education', description: 'Tertiary education completed (university degree or post-graduate).' },
  'Edu: Mid': { group: 'Education', description: 'Secondary education completed (high school or vocational).' },
  'Edu: Low': { group: 'Education', description: 'Primary education or no formal schooling.' },
  'Education.NA': { group: 'Education', description: 'Respondents with unrecorded educational level.' }
};

function determineQuadrant(dim1: number, dim2: number): 1 | 2 | 3 | 4 {
  if (dim1 >= 0 && dim2 >= 0) return 1;
  if (dim1 < 0 && dim2 >= 0) return 2;
  if (dim1 < 0 && dim2 < 0) return 3;
  return 4;
}

export const QUADRANT_DEFINITIONS = {
  1: {
    number: 1,
    title: 'Democratic Reform & Progressive Autonomy',
    subtitle: 'Anti-Military • Gender Equality • Anti-Corruption',
    color: 'emerald',
    description: 'Strongly rejects military and strongman rule while championing gender equality, LGBTQ+ rights, state transparency, and institutional reform.',
    bgColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  2: {
    number: 2,
    title: 'Anti-Authoritarian Traditionalism',
    subtitle: 'Radical Change • Self-Reliance • Moral Conservatism',
    color: 'amber',
    description: 'Demands radical disruption of state structures and values self-reliance over welfare, yet retains patriarchal gender roles and conservative cultural views.',
    bgColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  3: {
    number: 3,
    title: 'Patriarchal Paternalism & Order',
    subtitle: 'Pro-Military • Strong Leader • Traditional Hierarchy',
    color: 'rose',
    description: 'Endorses military governance and decisive strongman leadership as necessary guardians of national stability, paired with traditional gender hierarchies.',
    bgColor: 'rgba(244, 63, 94, 0.05)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  4: {
    number: 4,
    title: 'Paternalist Modernizers & Welfare Seekers',
    subtitle: 'State Welfare • Social Autonomy • Gradual Reform',
    color: 'violet',
    description: 'Embraces progressive social autonomy (LGBTQ+ acceptance, same-sex parenting) and demands state welfare provision, while preferring gradual institutional change.',
    bgColor: 'rgba(168, 85, 247, 0.05)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  }
};

// Normalize and build active categories
export const mcaCategories: MCACategory[] = (rawJson.categories as any[]).map(item => {
  const meta = CATEGORY_METADATA[item.id] || {
    domain: (item.domain || 'Regime & Authority') as DomainType,
    variable: 'Unknown',
    wvsQuestion: 'WVS-7',
    surveyQuestion: item.id,
    description: 'Attitude item measured in WVS Wave 7 Thailand survey.'
  };

  const domain = (item.domain || meta.domain) as DomainType;

  return {
    id: item.id,
    dim1: item.dim1,
    dim2: item.dim2,
    contrib_dim1: item.contrib_dim1,
    contrib_dim2: item.contrib_dim2,
    contrib_total: Number((item.contrib_dim1 + item.contrib_dim2).toFixed(2)),
    cos2_dim1: item.cos2_dim1,
    cos2_dim2: item.cos2_dim2,
    cos2_total: Number((item.cos2_dim1 + item.cos2_dim2).toFixed(3)),
    domain,
    variableName: meta.variable,
    wvsQuestionCode: meta.wvsQuestion,
    surveyQuestion: meta.surveyQuestion,
    description: meta.description,
    pairedWith: meta.pairedWith,
    quadrant: determineQuadrant(item.dim1, item.dim2)
  };
});

// Normalize supplementary demographics
export const mcaSupplementary: SupplementaryCategory[] = (rawJson.supplementary as any[]).map(item => {
  const meta = SUPPLEMENTARY_DESCRIPTIONS[item.id] || {
    group: (item.group || 'Gender') as DemographicGroup,
    description: 'Demographic reference segment.'
  };

  const group = (item.group || meta.group) as DemographicGroup;

  return {
    id: item.id,
    dim1: item.dim1,
    dim2: item.dim2,
    vtest_dim1: item.vtest_dim1,
    vtest_dim2: item.vtest_dim2,
    group,
    description: meta.description,
    isSignificantDim1: Math.abs(item.vtest_dim1) >= 1.96,
    isSignificantDim2: Math.abs(item.vtest_dim2) >= 1.96,
    quadrant: determineQuadrant(item.dim1, item.dim2)
  };
});

export const mcaVariance = {
  dim1: rawJson.variance.dim1[0],
  dim2: rawJson.variance.dim2[0],
  total: Number((rawJson.variance.dim1[0] + rawJson.variance.dim2[0]).toFixed(2))
};

export const STORY_SLIDES: StorySlide[] = [
  {
    id: 'ideology-myth',
    badge: 'Political Sociology',
    title: 'The "Left vs. Right" Myth in Thai Politics',
    summary: 'Western ideological labels fail to map Thai beliefs. The non-ideological majority is the true engine of progressivism.',
    detail: 'Over 40% of Thais refuse or cannot identify with Western "Left" or "Right" labels. Projected on the MCA map, "No Ideology Label" is located strongly at +0.268 on Dimension 1 with an extraordinary v-test score of +5.27 (p < 0.0001), clustering right alongside high anti-corruption awareness and LGBTQ+ acceptance. Conversely, self-identified "Left" and "Right" respondents both gravitate toward conservative and patriarchal positions on Dimension 1.',
    highlightCategoryIds: ['Corrupt: High', 'Gay: Justifiable', 'Men Lead: Disagree'],
    highlightSupplementaryIds: ['No Ideology Label', 'Left', 'Right', 'Center'],
    primaryAxis: 'dim1',
    insightBadge: 'V-Test +5.27 for No Label on Dim 1',
    quote: 'In Thailand, rejecting Western ideological dogma correlates with higher demand for institutional transparency and civic equality.'
  },
  {
    id: 'regime-polarization',
    badge: 'Regime & Power',
    title: 'The Great Divide: Militarism vs. Parliamentary Democracy',
    summary: 'Dimension 2 isolates authoritarian paternalism. Strong leader rejection alone accounts for 22.6% of axis variance.',
    detail: 'The vertical axis (Dimension 2, 13.31% inertia) is dominated by attitudes toward authority. "Leader: Bad" (+1.982 coord) and "Army Rule: Bad" (+0.785 coord) pull massively upward, contributing 38.3% of the total inertia on this dimension. Directly counter-balancing them at the bottom are "Leader: Good" and "Army Rule: Good", revealing that Thai society\'s sharpest ideological tension is not economic redistribution, but the legitimacy of the military apparatus in politics.',
    highlightCategoryIds: ['Leader: Bad', 'Leader: Good', 'Army Rule: Bad', 'Army Rule: Good', 'Army Coup: Compatible', 'Army Coup: Non-Dem'],
    highlightSupplementaryIds: ['18-29', 'Male', 'Right'],
    primaryAxis: 'dim2',
    insightBadge: '38.3% Combined Contrib on Dim 2',
    quote: 'The Thai authoritarian cleavage is vertical: strongman paternalism vs uncompromising constitutionalism.'
  },
  {
    id: 'cultural-modernity',
    badge: 'Gender & Autonomy',
    title: 'LGBTQ+ Rights & Anti-Corruption Form a Single Modernity Axis',
    summary: 'Dimension 1 demonstrates that personal freedom, gender equality, and scrutiny of state graft are deeply unified.',
    detail: 'Dimension 1 (14.99% inertia) forms a coherent "Modern Democratic Culture" axis. "Gay: Justifiable" (+0.782, 15.4% contrib) and "Corrupt: High" (+0.708, 13.2% contrib) sit almost identically at the far positive pole. Opposing them are patriarchal values: "Men Job: Agree" (-0.576) and "Men Lead: Agree" (-0.463). This demonstrates that in contemporary Thailand, the demand for government accountability is inextricably linked with sexual and gender egalitarianism.',
    highlightCategoryIds: ['Gay: Justifiable', 'Gay: Never/Rarely', 'Corrupt: High', 'Corrupt: Low/Mod', 'Men Job: Agree', 'Men Lead: Agree'],
    highlightSupplementaryIds: ['Edu: High', 'Edu: Low'],
    primaryAxis: 'dim1',
    insightBadge: 'Top 2 Drivers: Gay (15.4%) & Corruption (13.2%)',
    quote: 'Personal autonomy and institutional scrutiny are two sides of the same Thai democratic modernization coin.'
  },
  {
    id: 'generational-educational-cleavage',
    badge: 'Demographics & Youth',
    title: 'Generational Revolt: Youth & Higher Education Push Q1',
    summary: 'University-educated citizens and young Thais pull together into the democratic, reformist quadrant.',
    detail: 'The demographic projections highlight an acute structural cleavage. Youth aged 18-29 are situated at (+0.185, +0.149), firmly inside Quadrant 1 (Democratic Reform & Progressive Autonomy). Tertiary-educated Thais ("Edu: High") pull even further right at (+0.301, v-test +3.64). In contrast, low-education cohorts ("Edu: Low") sit at (-0.113, v-test -5.79), explaining the generational tensions seen during the Bangkok youth protests.',
    highlightCategoryIds: ['Radical Change', 'Army Rule: Bad', 'Gay: Justifiable'],
    highlightSupplementaryIds: ['18-29', '30-49', '50+', 'Edu: High', 'Edu: Mid', 'Edu: Low'],
    primaryAxis: 'both',
    insightBadge: 'Edu: Low v-test -5.79 vs Edu: High +3.64',
    quote: 'The generational and educational sorting maps directly to the fault lines of modern Thai civic movements.'
  }
];
