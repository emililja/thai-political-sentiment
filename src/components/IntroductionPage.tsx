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
  TrendingUp,
  FileText,
  Info,
  ChevronRight,
  HelpCircle,
  Vote,
  HeartHandshake
} from 'lucide-react';
import { mcaVariance, QUADRANT_DEFINITIONS } from '../data/mcaData';

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
              Empirical Research Report
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              WVS Wave 7 • Thailand Sample
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              N ≈ 1,500 Respondents
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Thailand Sociocultural Value Dimensions
          </h1>

          <div className="text-sm sm:text-base font-semibold text-slate-700 flex items-center gap-2">
            <span>By <strong className="text-blue-700 font-bold">Emily Suwanasing</strong></span>
            <span>•</span>
            <span className="text-slate-500 font-normal">Multiple Correspondence Analysis (FactoMineR)</span>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
            An empirical investigation into the underlying sociocultural, moral, and political cleavages within the Thai electorate. 
            Moving beyond conventional binary narratives of establishment versus anti-establishment or left versus right, this study maps the multidimensional value space shaping voter alignments and parliamentary coalition tensions.
          </p>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
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

      {/* Executive Summary Card */}
      <section className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 text-blue-900">
          <div className="p-2 rounded-xl bg-blue-700 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">Executive Summary</h2>
            <p className="text-xs text-blue-800/80 font-medium">Core Findings & Empirical Takeaways</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
          <p className="font-medium text-slate-800">
            This report examines the underlying sociocultural and political value dimensions within the Thai electorate using 
            <strong> Multiple Correspondence Analysis (MCA)</strong> on <strong>Wave 7 World Values Survey (WVS)</strong> data. 
            Rather than reducing political dynamics to a simple binary division, the findings highlight two key axes shaping voter attitudes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Dimension 1 • {mcaVariance.dim1}% Inertia
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Horizontal</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Progressive Liberalism & Anti-Corruption vs. Traditional Conservatism
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Separates modern social autonomy (acceptance of same-sex relations, rejection of male political dominance, state transparency) from moral traditionalism, breadwinner role enforcement, and low perception of corruption.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  Dimension 2 • {mcaVariance.dim2}% Inertia
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">Vertical</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Democratic Anti-Militarism vs. Authoritarian Paternalism
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Isolates governance and authority convictions: rejection of military junta rule and strongman governance on the democratic pole, contrasted against defense of military intervention, strong leaders, and institutional paternalism.
              </p>
            </div>
          </div>

          <p className="pt-2">
            Demographic patterns show strong alignments: <strong>highly educated respondents</strong> gravitate disproportionately toward socially progressive yet paternalistic stances (<strong className="text-indigo-700">45.4% in Quadrant IV</strong>), while <strong>younger cohorts (18–29)</strong> demonstrate greater dispersion across reformist quadrants while sharply rejecting patriarchal authoritarianism. These multidimensional insights help explain the broader ideological tensions and coalition shifts within modern Thai politics.
          </p>
        </div>
      </section>

      {/* Introduction & Political Context */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            <Vote className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Introduction & Political Landscape</h2>
            <p className="text-xs text-slate-500">The 2023 Electoral Crisis & Institutional Resistance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs sm:text-sm text-slate-700 leading-relaxed items-start">
          <div className="md:col-span-7 space-y-3">
            <p>
              Thai politics has gained intense attention from both the country’s citizens and international media. The <strong>2023 general election</strong> in particular was a historic spectacle, culminating in controversy stemming from the <strong>Move Forward Party’s</strong> inability to form a government coalition despite winning the plurality of seats, and its subsequent disbandment by the Constitutional Court.
            </p>
            <p>
              The struggles these political entities face when confronting Thai institutions have created an international media narrative of a <em>"democratic movement being resisted by an illiberal establishment."</em> However, the substantive issues citizens vote for are far more multi-faceted:
            </p>
            <ul className="space-y-1.5 pl-2 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>Debates over systemic graft, bribe-taking, and anti-corruption scrutiny.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>LGBTQ+ equality, marriage rights, and same-sex parenting legitimacy.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>State welfare guarantees versus individual and familial self-reliance.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span>The legitimate role the military and unelected figures should play in a democratic society.</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>World Values Survey Wave 7 Context</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The World Values Survey (WVS) studies values, beliefs, and cultural attitudes globally with a 294-question instrument. In Thailand, Wave 7 surveyed approximately <strong>1,500 respondents between 2017 and 2022</strong>.
            </p>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block mb-1">A Critical Historical Baseline:</strong>
              While captured prior to 2026, Wave 7 captures a vital snapshot of political beliefs during the COVID-19 pandemic and the twilight of Prime Minister Prayuth Chan-o-cha’s second term—the very pressures that gave rise to today’s political environment.
            </div>
            <p className="text-[11px] text-slate-500 italic">
              "In this project, we set out to provide a cursory glance at the issues and values which divide Thai politics beyond left vs. right or pro- vs. anti-establishment, getting a better understanding of the tension within the electorate which drives the political conflicts within parliament today."
            </p>
          </div>
        </div>
      </section>

      {/* The Four Sociocultural Quadrants */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-700" />
              The Four Sociocultural Quadrants (Figure 1)
            </h2>
            <p className="text-xs text-slate-500">
              Derived from the intersection of Dimension 1 (Progressive-Traditional) and Dimension 2 (Democratic-Paternalist)
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
              Consistently rejects military rule and strongman governance while actively championing gender parity in politics, LGBTQ+ equality, and heightened anti-corruption vigilance. Attracts <strong>25.2% of youth (18–29)</strong>.
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
              Demands radical structural change and rejects military governance, yet upholds conservative cultural values, traditional gender hierarchies, and economic self-reliance over welfare. Captures <strong>25.8% of youth</strong>.
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
              Views military governance and strong leader figures as necessary for societal stability. Prioritizes male jobs and conservative social norms. Remarkably holds <strong>44.3% of self-identified "Left"</strong> respondents.
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
              Pairs socially progressive values (LGBTQ+ acceptance, same-sex parenting) with expectations of state welfare and gradual institutional reform. Dominates tertiary-educated citizens (<strong className="text-indigo-700">45.4%</strong>).
            </p>
          </div>
        </div>
      </section>

      {/* Results & Interpretation: Deep-Dive Empirical Findings */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Key Analytical Insights & Societal Nuances</h2>
            <p className="text-xs text-slate-500">Unpacking counterintuitive voter attitudes from Emily Suwanasing's report</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insight 1: State Welfare Paradox */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-800 font-bold text-xs">
              <Scale className="w-4 h-4" />
              <span className="uppercase tracking-wider">1. The State Welfare Paradox (Dim 1+ / Dim 2-)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Welfare Support Correlates with Progressive Views and Institutional Paternalism
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Agreeing with state welfare correlates with the positive end of <strong>Dimension 1</strong> (+0.408) and the negative end of <strong>Dimension 2</strong> (-0.421). In Thailand, support for state welfare stems from both socially progressive attitudes and institutional trust that expects the state to provide social protection.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              <strong>The Radical Contrast:</strong> Conversely, respondents who desire radical change and strongly oppose military rule often view centralized state aid with suspicion, reinforcing an ethos of community or familial self-reliance (<code className="text-slate-800 font-mono text-[11px]">Welfare: Self-Reliance</code> loads at +0.492 on Dim 2).
            </p>
          </div>

          {/* Insight 2: Same-Sex Parenthood & Red Shirt Speculation */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span className="uppercase tracking-wider">2. Same-Sex Parenthood & Rural Isan Dynamics</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Why Gay Parenthood Loads on Dimension 2 Rather Than Dimension 1
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              While general acceptance of homosexuality (<code className="text-blue-700 font-mono text-[11px]">Gay: Justifiable</code>) is the primary driver of Dimension 1 (15.4% contribution), same-sex parenting (<code className="text-blue-700 font-mono text-[11px]">Gay Parents: Agree</code>) loads heavily on Dimension 2 (10.2% contribution at coordinate -0.575).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              <strong>The "Red Shirt" Heritage:</strong> Speculatively, this may reflect the former "red shirts" who opposed military rule yet possessed a strong rural Isan base, retaining cultural conservatism and drawing a sharp line between general social tolerance and the formal restructuring of the traditional family unit.
            </p>
          </div>

          {/* Insight 3: The Higher Education Concentration */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
              <span className="uppercase tracking-wider">3. The Tertiary Education Concentration (Figure 2)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              45.4% of University-Educated Citizens Converge on Quadrant IV
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Those with tertiary education (<code className="text-indigo-700 font-mono text-[11px]">Edu: High</code>, v-test +3.64 on Dim 1, -2.10 on Dim 2) are significantly more likely to fall into the fourth quadrant than any other demographic group, combining socially progressive autonomy with expectations of government-provided welfare and gradual reform.
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q1</span>
                <span className="font-bold text-slate-700">20.0%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q2</span>
                <span className="font-bold text-slate-700">17.7%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Q3</span>
                <span className="font-bold text-slate-700">16.9%</span>
              </div>
              <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200 text-indigo-900">
                <span className="text-indigo-500 block text-[10px]">Q4</span>
                <span className="font-extrabold">45.4%</span>
              </div>
            </div>
          </div>

          {/* Insight 4: The Thai Left Ideology Paradox */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span className="uppercase tracking-wider">4. The "Thai Left" Paradox (Figure 4)</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              44.3% of Self-Identified "Left" Fall into Patriarchal Paternalism (Q3)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Counterintuitive to Western political spectrums, <strong>44.3%</strong> of Thais who self-identify as politically on the "Left" fall into Quadrant III—the quadrant characterized by pro-military sentiment, belief in strongman leaders, and traditional gender roles.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              <strong>Ideological Misalignment:</strong> This confirms that Western labels like "Left" vs "Right" do not map cleanly onto Thai politics. Furthermore, over 40% of Thais reject ideological labels altogether, clustering on Dimension 1 (+0.268, v-test +5.27).
            </p>
          </div>
        </div>
      </section>

      {/* Youth vs Older Cohorts */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Generational Cleavages: Youth Dispersal (Figure 3)</h2>
            <p className="text-xs text-slate-500">How 18–29 year olds diverge from older Thai cohorts</p>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
          <p>
            Younger Thais aged between 18 and 29 display a decisive rejection of <strong>Quadrant III (Patriarchal Paternalism & Order)</strong>, with only <strong>17.8%</strong> falling into this category compared to 29.6% among citizens aged 30–49 and 26.8% among those 50 and older.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Ages 18–29 (Youth)</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">17.8% <span className="text-xs text-slate-500 font-normal">in Q3</span></div>
              <p className="text-[11px] text-slate-600 leading-snug">Dispersed across Q1 (25.2%), Q2 (25.8%), and Q4 (31.3%).</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Ages 30–49 (Working Age)</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">29.6% <span className="text-xs text-slate-500 font-normal">in Q3</span></div>
              <p className="text-[11px] text-slate-600 leading-snug">Highest concentration in Q4 (28.6%) and Q3 (29.6%).</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Ages 50+ (Older Cohort)</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">26.8% <span className="text-xs text-slate-500 font-normal">in Q3</span></div>
              <p className="text-[11px] text-slate-600 leading-snug">Evenly distributed across all 4 quadrants (22.7% to 26.8%).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion from Report */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Research Conclusion</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Beyond Binary Cleavages in Modern Thailand
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          In conclusion, this MCA analysis reveals that Thai political attitudes are shaped by a complex interplay of social values, institutional trust, and demographic factors that extend beyond a simple binary division. 
          The clear alignment of highly educated respondents with progressive social views, coupled with nuanced splits across age groups regarding paternalism and reform, highlights how generational and educational shifts continue to reconfigure the electorate.
        </p>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Understanding these multidimensional dynamics provides critical insight into the ongoing political tensions and coalition-building challenges observed within Thailand's parliamentary system today.
        </p>

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

