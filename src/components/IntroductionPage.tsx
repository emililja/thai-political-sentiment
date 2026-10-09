import React from 'react';
import { 
  Compass, 
  Map, 
  Users, 
  BarChart2, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  GraduationCap, 
  Calendar, 
  ChevronRight,
  Vote,
  HeartHandshake
} from 'lucide-react';
import { mcaVariance } from '../data/mcaData';

interface IntroductionPageProps {
  onNavigateTab: (tab: 'biplot' | 'scatterplot' | 'analytics' | 'data', quadrant?: number | null) => void;
  onOpenMethodology: () => void;
}

export const IntroductionPage: React.FC<IntroductionPageProps> = ({
  onNavigateTab,
  onOpenMethodology
}) => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Hero Header */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/80 via-red-50/40 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5 shadow-sm">
              <Compass className="w-3.5 h-3.5 text-blue-700" />
              MCA Research Report
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              WVS Wave 7 • Conducted in 2018 (Thailand)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              N ≈ 1,500 Respondents (1,186 Complete Cases)
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Thailand Sociocultural Value Dimensions
            </h1>
            <p className="text-base sm:text-xl font-semibold text-blue-800 tracking-tight">
              A Multiple Correspondence Analysis of Wave 7 World Values Survey
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span>By <strong className="text-blue-700 font-bold">Emily Suwanasing</strong></span>
            <span>•</span>
            <span className="text-slate-500 font-normal">Multiple Correspondence Analysis (FactoMineR)</span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1">
            An empirical investigation into the underlying sociocultural, moral, and political cleavages within the Thai electorate. 
            Moving beyond conventional binary narratives of establishment versus anti-establishment or left versus right, this study maps the multidimensional value space shaping voter alignments, ideological tensions, and parliamentary coalition shifts.
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('biplot')}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-md shadow-blue-900/10"
            >
              <Map className="w-4 h-4" />
              Explore Interactive Map (Biplot)
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => onNavigateTab('scatterplot')}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm"
            >
              <Users className="w-4 h-4 text-blue-700" />
              Respondent Scatterplot (1,186 Samples)
            </button>

            <button
              onClick={onOpenMethodology}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              Methodology
            </button>
          </div>
        </div>
      </section>

      {/* Abstract (Faithfully matching report) */}
      <section className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-blue-900">
          <div className="p-2 rounded-xl bg-blue-700 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Abstract</h2>
            <p className="text-xs text-blue-800/80 font-medium">From Emily Suwanasing's Research Report</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
          <p className="italic bg-white p-4 rounded-2xl border border-blue-200/70 shadow-xs text-slate-800 leading-relaxed">
            "While Thai politics is often imagined as a struggle between the institutional establishment and a democratic movement demanding change, within the electorate, issues are more complex. Outside of stances on institutional trust, there exists lively debate on matters such as corruption, social progress, welfare, and much more. To gain a better understanding of how the Thai population is split based on these issues, we took the World Values Survey’s data on Thai respondents and picked questions of interest to analyze using Multiple Correspondence Analysis. We found that, when reduced to two dimensions accounting for 28.3% of variance, the two axes are a general measure of <strong>Progressive Liberalism & Anti-Corruption vs. Traditional Conservatism</strong> and <strong>Democratic Anti-Militarism vs. Authoritarian Paternalism</strong>. Other findings in the demographic data show that <strong>44.3% of those who identified as being politically on the left in Thailand place within the more Paternalistic and Traditionally Conservative area</strong>, showing that Thai politics cannot be collapsed into a simple binary based on Western frameworks."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Dimension 1 • {mcaVariance.dim1}% Variance
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Horizontal Axis</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Progressive Liberalism & Anti-Corruption vs. Traditional Conservatism
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determined by stances on same-sex relationships, perceptions of corruption, and gender roles, alongside state welfare support and radical societal reform.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  Dimension 2 • {mcaVariance.dim2}% Variance
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Vertical Axis</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Democratic Anti-Militarism vs. Authoritarian Paternalism
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determined by views on strong leadership, army rule and coups, and gay parenthood, alongside views on state welfare and radical change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction & 2018 Survey Context */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Vote className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Introduction: Beyond Binary Frameworks</h2>
            <p className="text-xs text-slate-500">Historical placement under the 2018 junta administration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed items-start">
          <div className="md:col-span-7 space-y-3">
            <p>
              Thai politics has gained much attention from both the country’s citizens and international media. The struggle liberal and progressive parties face when confronting Thai institutions has created an image of a democratic movement being resisted by the establishment. But the issues citizens vote for appear much more multi-faceted, including debates on the matter of corruption, LGBTQ+ rights, and state welfare: beyond the role the army and other unelected figures should play in a democratic society.
            </p>
            <p>
              The World Values Survey (WVS) studies people's values, beliefs, and cultural attitudes from multiple nations across the globe with a 294-question questionnaire spanning social values, ethics, economics, and political culture.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Calendar className="w-4 h-4 text-red-600" />
                The 2018 Survey Timing & Historical Significance:
              </div>
              <p className="leading-relaxed">
                In Thailand, Wave 7 of the survey consisted of responses from approximately <strong>1,500 respondents in 2018</strong>. 
                While this is perhaps outdated for the political issues of 2026, it provides us with a <strong>snapshot of political beliefs during Prime Minister Prayuth’s administration under the military junta following the 2014 coup</strong>, prior to the 2019 general election transition and the COVID-19 pandemic that began in late 2019, which together gave rise to the Thai political environment we live in today.
              </p>
            </div>
            <p className="italic text-slate-600">
              "In this project, we set out to provide a cursory glance at the issues and values that divide Thai politics beyond left vs. right or pro- vs. anti-establishment, with the goal of getting a better understanding of the tension within the electorate that drives the political conflicts we see within parliament today."
            </p>
          </div>

          <div className="md:col-span-5 bg-blue-50/40 border border-blue-200/80 rounded-2xl p-5 space-y-3">
            <div className="font-bold text-xs uppercase tracking-wider text-blue-900">
              Key Methodological Setup
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              From the 294 survey questions, <strong>10 active questions</strong> were systematically selected and dichotomized to eliminate neutral "fence-sitter" response bias and isolate high-signal substantive convictions:
            </p>
            <ul className="text-[11px] space-y-1.5 text-slate-700 font-mono">
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q42:</strong> Society Reform (Radical / Gradual / Defend)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q237:</strong> Army Rule (Good vs Bad)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q235:</strong> Strong Leader (Good vs Bad)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q245:</strong> Army Coup (Non-Dem vs Compatible)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q182:</strong> LGBTQ+ Justifiable (Never/Rarely vs Justifiable)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q36:</strong> Same-Sex Parents (Agree vs Disagree/Neutral)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q29 & Q33:</strong> Men Better Leaders & Job Priority
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q112:</strong> Corruption Level (High vs Low/Mod)
              </li>
              <li className="bg-white p-2 rounded-lg border border-slate-200">
                <strong>Q108:</strong> Welfare Responsibility (State vs Self-Reliance)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The Four Sociocultural Quadrants */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-700" />
              The Four Sociocultural Quadrants (Figure 1 in Report)
            </h2>
            <p className="text-xs text-slate-500">
              Contextualizing how Thai voters cluster across the two MCA dimensions
            </p>
          </div>
          <span className="text-xs text-blue-700 font-semibold">Click any quadrant to view in Biplot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quadrant 1 */}
          <div 
            onClick={() => onNavigateTab('biplot', 1)}
            className="bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 p-5 rounded-2xl shadow-sm transition cursor-pointer group space-y-2.5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center font-mono">
                  Q1
                </span>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Dim 1+ / Dim 2+
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
              Progressive Anti-Authoritarian / Democratic Reform
            </h3>
            <div className="text-xs font-semibold text-blue-800">
              Anti-Military • Gender Equality • Anti-Corruption
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strongly rejects strong leadership and army rule while championing gender equality, LGBTQ+ rights, state transparency, and institutional reform. Reflects anti-establishment sentiment leading into the 2019 election (aligned with Future Forward / Pheu Thai).
            </p>
          </div>

          {/* Quadrant 2 */}
          <div 
            onClick={() => onNavigateTab('biplot', 2)}
            className="bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-300 p-5 rounded-2xl shadow-sm transition cursor-pointer group space-y-2.5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center font-mono">
                  Q2
                </span>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Dim 1- / Dim 2+
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition">
              Anti-Authoritarian Traditionalism
            </h3>
            <div className="text-xs font-semibold text-amber-800">
              Radical Change • Self-Reliance • Moral Conservatism
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shares rejection of strong leadership and military governance, demanding radical overhaul of society and valuing self-reliance over welfare, yet maintains conservative cultural convictions and traditional gender roles.
            </p>
          </div>

          {/* Quadrant 3 */}
          <div 
            onClick={() => onNavigateTab('biplot', 3)}
            className="bg-white hover:bg-red-50/40 border border-slate-200 hover:border-red-300 p-5 rounded-2xl shadow-sm transition cursor-pointer group space-y-2.5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-red-100 text-red-800 text-xs font-bold flex items-center justify-center font-mono">
                  Q3
                </span>
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider">
                  Dim 1- / Dim 2-
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-700 transition group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition">
              Patriarchal Paternalism & Order
            </h3>
            <div className="text-xs font-semibold text-red-800">
              Pro-Military • Strong Leader • Traditional Hierarchy
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Represents individuals holding socially conservative values alongside positive views of military rule and strong leadership; favored measures that maintained societal harmony and order. Holds <strong>44.3% of self-identified "Left"</strong> voters.
            </p>
          </div>

          {/* Quadrant 4 */}
          <div 
            onClick={() => onNavigateTab('biplot', 4)}
            className="bg-white hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 p-5 rounded-2xl shadow-sm transition cursor-pointer group space-y-2.5 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center font-mono">
                  Q4
                </span>
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                  Dim 1+ / Dim 2-
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 transition group-hover:translate-x-0.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition">
              Paternalist Modernizers & Welfare Seekers
            </h3>
            <div className="text-xs font-semibold text-indigo-800">
              State Welfare • Social Autonomy • Gradual Reform
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Respondents did not oppose strong leadership figures or army rule as strongly, yet felt there was high corruption and supported socially progressive causes (LGBTQ+ acceptance, same-sex parenting) and state welfare. Concentrates <strong>45.4% of tertiary-educated</strong> Thais.
            </p>
          </div>
        </div>
      </section>

      {/* Results & Interpretation: Deep-Dive Empirical Findings from the Report */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Results & Interpretation: Key Findings</h2>
            <p className="text-xs text-slate-500">Unpacking societal nuances directly from Emily Suwanasing's analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Finding 1: Anti-Establishment Sentiment Leading up to 2019 */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
              <Vote className="w-4 h-4" />
              <span className="uppercase tracking-wider">1. Anti-Establishment Sentiment & 2019 Alignment</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Strong Leadership Rejection as the Prime Driver of Dimension 2
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The item that immediately draws our attention is the belief that strong leadership is bad, which contributes significantly to Dimension 2's positive values (<strong>22.60% contribution</strong>, coordinate +1.980). This suggests that <strong>Quadrants I and II might reflect aspects of the anti-establishment sentiment leading up to the 2019 election</strong>, which potentially aligned with supporters of Future Forward or Pheu Thai."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              <strong>Modernization vs Democratic Conviction:</strong> "Respondents in Quadrant IV did not oppose strong leadership figures or army rule as strongly, yet felt there was a high amount of corruption or supported socially progressive causes. Speculatively, this group might have leaned toward anti-establishment parties like Future Forward out of a <em>desire for modernization rather than democratic convictions</em>."
            </p>
          </div>

          {/* Finding 2: The State Welfare Correlates */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-800 font-bold text-xs">
              <Scale className="w-4 h-4" />
              <span className="uppercase tracking-wider">2. The State Welfare Alignment</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Welfare Support Correlates with Progressive Views and Institutional Trust
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "It is noteworthy that agreeing with state welfare correlates with the positive end of Dimension 1 (+0.408) and the negative end of Dimension 2 (-0.421). In Thailand, stances on state welfare stem from both the socially progressive view on the right side of Dimension 1 (disagreeing that male leadership is better and accepting same-sex relationships) and Dimension 2 being negative, which indicates a degree of trust toward the government and naturally lends toward care being provided by institutions."
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              <strong>Suspicion of Centralized Aid:</strong> "Conversely, a lack of trust in institutions and more conservative economic beliefs would lead to a belief in self-reliance. Respondents who strongly oppose military rule and desire radical change often view centralized state aid with suspicion, reinforcing an ethos of community or familial self-reliance."
            </p>
          </div>

          {/* Finding 3: Same-Sex Parenthood & Red Shirt Speculation */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span className="uppercase tracking-wider">3. Same-Sex Parenthood & Former "Red Shirts"</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Distinguishing Societal Acceptance from Redefining Familial Structures
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Regarding same-sex parenthood being placed on Dimension 2 rather than Dimension 1, speculatively, this could be reflective of the former <strong>'red shirts'</strong> who, at the time of the survey, opposed military rule and had a significant base in the rural Isan region, which could explain a degree of cultural conservatism distinguishing societal acceptance from redefining familial structures. Further analysis would be needed to find real causation."
            </p>
          </div>

          {/* Finding 4: The Left-Right Dichotomy Breakdown */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span className="uppercase tracking-wider">4. The "Thai Left" Paradox (Figure 4)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              44.3% of Self-Identified "Left" Land in Patriarchal Paternalism (Q3)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Lastly, as seen in Figure 4, <strong>44.3% of those who identified as politically on the left in Thailand fall under the third quadrant</strong>, which, counterintuitively to the common understanding of left vs. right internationally, leans paternalistic and socially conservative. This shows that applying such a dichotomy to Thai politics is a difficult exercise."
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q1</span>
                <span className="font-bold text-slate-700">17.0%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q2</span>
                <span className="font-bold text-slate-700">21.7%</span>
              </div>
              <div className="bg-red-50 p-2 rounded-lg border border-red-200 text-red-900 font-extrabold">
                <span className="text-red-500 block text-[10px]">Q3 (Left)</span>
                <span>44.3%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q4</span>
                <span className="font-bold text-slate-700">17.0%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demographics: Education & Age Figures */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Demographic Alignments: Education & Age (Figures 2 & 3)</h2>
            <p className="text-xs text-slate-500">Empirical distribution of respondents across the four quadrants</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Figure 2: Education */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Figure 2: Breakdown for Demographic with Tertiary Education
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "In terms of demographics, we also find that those with tertiary education are much more likely to fall into the fourth quadrant, being liberally progressive and paternalistic (<strong>45.4%</strong>), than any other group, as seen in Figure 2."
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q1</span>
                <span className="font-bold text-slate-700">20.0%</span>
                <span className="text-[10px] text-slate-400 block">(26)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q2</span>
                <span className="font-bold text-slate-700">17.7%</span>
                <span className="text-[10px] text-slate-400 block">(23)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q3</span>
                <span className="font-bold text-slate-700">16.9%</span>
                <span className="text-[10px] text-slate-400 block">(22)</span>
              </div>
              <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200 text-indigo-900 font-extrabold shadow-xs">
                <span className="text-indigo-600 block text-[10px]">Q4</span>
                <span className="text-sm">45.4%</span>
                <span className="text-[10px] text-indigo-500 block">(59)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              Tertiary-educated Thais are potentially supportive of, or at least ambivalent toward, prioritizing institutional order over democratic confrontation while seeking state modernization.
            </p>
          </div>

          {/* Figure 3: Age */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Figure 3: Breakdown for Demographic Aged Between 18 and 29
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "In terms of age, while showing less of a difference, those aged between 18 and 29 are less likely to fall into the third quadrant (i.e., paternalistic and socially conservative) than other quadrants, as seen in Figure 3."
            </p>
            <div className="grid grid-cols-4 gap-2 pt-2 text-center font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q1</span>
                <span className="font-bold text-slate-700">25.2%</span>
                <span className="text-[10px] text-slate-400 block">(41)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q2</span>
                <span className="font-bold text-slate-700">25.8%</span>
                <span className="text-[10px] text-slate-400 block">(42)</span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300 text-slate-600">
                <span className="text-slate-400 block text-[10px]">Q3 (Low)</span>
                <span className="font-bold">17.8%</span>
                <span className="text-[10px] text-slate-400 block">(29)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q4</span>
                <span className="font-bold text-slate-700">31.3%</span>
                <span className="text-[10px] text-slate-400 block">(51)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              Youth disperse across reformist and modernization quadrants, with only 17.8% endorsing Quadrant III compared to 29.6% among ages 30–49 and 26.8% among ages 50+.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusion (Exact from Report) */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Report Conclusion</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Conclusion: Beyond Binary Models of Thai Politics
        </h2>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl space-y-3 font-normal">
          <p>
            "In our analysis, we have found that the responses to the selected questions map onto two distinct axes when using MCA: <strong>Progressive Liberalism & Anti-Corruption vs. Traditional Conservatism</strong> and <strong>Democratic Anti-Militarism vs. Authoritarian Paternalism</strong>. This indicates that, unlike binary models, beliefs regarding LGBTQ+ rights, gender roles, and the role of the state in welfare exist independently of anti-authoritarian sentiment."
          </p>
          <p>
            "Furthering this point, nearly half (44.3%) of the respondents who identify as being on the political left land within the socially conservative and paternalistic quadrant, while a plurality (45.4%) of those with higher education are potentially supportive of, or at least ambivalent toward, prioritising institutional order over democratic confrontation. It is evident that Thai politics extends far beyond progressive democratic movements and institutional establishments at the time of the WVS Wave 7 survey."
          </p>
          <p className="text-blue-200">
            "Further exploration of how these tensions evolved through the pandemic into partisanship during the 2023 election and, eventually, the collapse of the Pheu Thai-led coalition government in late 2025, would bring a better understanding of where the Thai political landscape is heading."
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('biplot')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 shadow-md shadow-blue-500/20"
          >
            <Map className="w-4 h-4" />
            Launch Interactive MCA Biplot
          </button>

          <button
            onClick={() => onNavigateTab('scatterplot')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-2 backdrop-blur-sm"
          >
            <Users className="w-4 h-4" />
            Inspect 1,186 Respondent Points
          </button>
        </div>
      </section>
    </div>
  );
};
