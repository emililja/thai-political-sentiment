import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  FileText, 
  Code2, 
  Database, 
  Table2, 
  Compass, 
  BarChart2, 
  Sparkles,
  Users
} from 'lucide-react';
import { mcaVariance } from '../data/mcaData';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  const [modalTab, setModalTab] = useState<'overview' | 'questions' | 'appendix'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Research Methodology & Statistical Framework
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 hidden sm:inline-block">
                  By Emily Suwanasing
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Multiple Correspondence Analysis (MCA) on World Values Survey Wave 7 (Thailand Sample, Conducted in 2018)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-100 bg-slate-50/50 flex space-x-2 shrink-0 text-xs">
          <button
            onClick={() => setModalTab('overview')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              modalTab === 'overview'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            MCA Rationale & Dimensions
          </button>

          <button
            onClick={() => setModalTab('questions')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              modalTab === 'questions'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Questionnaire & Dichotomization (10 Items)
          </button>

          <button
            onClick={() => setModalTab('appendix')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              modalTab === 'appendix'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            Statistical Appendix & Tables
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed overflow-y-auto flex-1">
          {/* TAB 1: OVERVIEW */}
          {modalTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Technical Definition */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-700" />
                  1. Multiple Correspondence Analysis (MCA)
                </h4>
                <p>
                  Multiple Correspondence Analysis (MCA) is an extension of standard correspondence analysis (CA) designed to uncover underlying structures in datasets containing three or more nominal or ordinal categorical variables.
                </p>
                <p>
                  For a survey whose answers consist of numerical ranges (e.g., 1–10 rating scales) and nominal Yes/No or choice questions, MCA is uniquely suited to visualizing which stances on key issues divide respondents the most by computing which variables contribute the most variance along Cartesian axes.
                </p>
                <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-200/80 text-blue-900 space-y-1">
                  <div className="font-semibold text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    Geometric Interpretation:
                  </div>
                  <p className="text-[11px] text-slate-700">
                    Individuals and categories are mapped as points in a low-dimensional Euclidean space through singular value decomposition of the normalized indicator/Burt matrix. Proximity between two category points indicates that respondents who select one are statistically much more likely to select the other.
                  </p>
                </div>
              </div>

              {/* Two Core Dimensions */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-red-600" />
                  2. Interpretation of the Two Primary Axes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-blue-200 bg-white space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Dimension 1 • {mcaVariance.dim1}% Inertia
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Progressive Liberalism & Anti-Corruption vs. Traditional Conservatism
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Determined primarily by views on same-sex relationships, perception of corruption, and gender roles. Anchored by <code className="text-blue-700 font-mono text-[10px]">Gay: Justifiable</code> (+0.782, 15.4% contrib) and <code className="text-blue-700 font-mono text-[10px]">Corrupt: High</code> (+0.708, 13.2% contrib).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-red-200 bg-white space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      Dimension 2 • {mcaVariance.dim2}% Inertia
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Democratic Anti-Militarism vs. Authoritarian Paternalism
                    </h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Determined primarily by attitudes toward strong leadership, military coups/army governance, and same-sex parenthood. Anchored by rejection of strong leaders (<code className="text-red-700 font-mono text-[10px]">Leader: Bad</code>, +1.980, 22.6% contrib) and military rule (<code className="text-red-700 font-mono text-[10px]">Army Rule: Bad</code>, +0.785, 15.7% contrib).
                    </p>
                  </div>
                </div>
              </div>

              {/* The 4 Quadrants */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  3. Contextualizing the 4 Value Quadrants
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-semibold">Quadrant I (Dim 1+ / Dim 2+):</strong>
                    <div className="text-blue-800 font-medium">Progressive Anti-Authoritarian / Democratic Reform</div>
                    <p className="text-slate-600">Rejects military intervention, champions LGBTQ+ rights, gender equality, and anti-corruption vigilance.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-semibold">Quadrant II (Dim 1- / Dim 2+):</strong>
                    <div className="text-amber-800 font-medium">Anti-Authoritarian Traditionalism</div>
                    <p className="text-slate-600">Demands radical societal change and rejects army rule, but maintains moral conservatism and economic self-reliance.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-semibold">Quadrant III (Dim 1- / Dim 2-):</strong>
                    <div className="text-red-800 font-medium">Patriarchal Paternalism & Order</div>
                    <p className="text-slate-600">Supports army rule and strongman governance for stability; upholds traditional patriarchal gender roles.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-semibold">Quadrant IV (Dim 1+ / Dim 2-):</strong>
                    <div className="text-indigo-800 font-medium">Paternalist Modernizers & Welfare Seekers</div>
                    <p className="text-slate-600">Socially progressive on gay rights and family diversity, but embraces institutional trust and state welfare provision.</p>
                  </div>
                </div>
              </div>

              {/* Dataset Provenance */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-700" />
                  4. Dataset Provenance & Timing
                </h4>
                <p>
                  The dataset is drawn from the <strong>World Values Survey (WVS) Wave 7</strong> cross-national dataset, filtering specifically for the Thailand representative sample surveyed in <strong>2018</strong> (<code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-200">B_COUNTRY == 764</code> / <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-200">THA</code>).
                </p>
                <p>
                  The Thai sample comprises approximately 1,500 adult respondents interviewed through stratified multistage probability sampling. Complete cases for the 10 active items yield <strong>1,186 individual respondents</strong>. 
                  Conducted in 2018, it provides a critical snapshot of political beliefs during Prime Minister Prayuth’s administration under the military junta following the 2014 coup, prior to the 2019 general election transition and the COVID-19 pandemic that began in late 2019, which together gave rise to today's political landscape.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS & DICHOTOMIZATION */}
          {modalTab === 'questions' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-700" />
                  1. Rationale for Systematic Dichotomization
                </h4>
                <p>
                  In survey research—particularly across Asian and Thai cultural contexts—respondents frequently exhibit a pronounced <em>acquiescence bias</em> or propensity to select midpoint/neutral categories (e.g., "Neither agree nor disagree", score 5 on a 1–10 scale) to avoid conflict or uncertainty.
                </p>
                <p>
                  In standard MCA, uncollapsed neutral options inevitably cluster at the centroid (0,0) and compress ideological variance, producing artificial "response-style" axes. To isolate high-signal substantive convictions and reduce correlated noise, 10 active questions were selected from the 294 survey items and systematically dichotomized:
                </p>
              </div>

              {/* The 10 Active Survey Items */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  The 10 Active Survey Questions (Emily Suwanasing Report)
                </h5>

                <div className="space-y-2 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-[11px]">
                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">1. Society Reform (Q42):</span>
                      <span className="text-slate-600">Attitude toward society reform</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1 (Radical Change), 2 (Gradual Reform), 3 (Defend Society)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">2. Army Rule (Q237):</span>
                      <span className="text-slate-600">Having armed forces govern the country</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–2 (Army Rule: Good) vs 3–4 (Army Rule: Bad)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">3. Strong Leader (Q235):</span>
                      <span className="text-slate-600">Leader who does not bother with parliament/elections</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–2 (Leader: Good) vs 3–4 (Leader: Bad)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">4. Army Democratic (Q245):</span>
                      <span className="text-slate-600">Army takeover when government is incompetent</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–5 (Army Coup: Non-Dem) vs 6–10 (Army Coup: Compatible)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">5. LGBTQ Justifiable (Q182):</span>
                      <span className="text-slate-600">Justifiability of homosexuality</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–4 (Gay: Never/Rarely) vs 5–10 (Gay: Justifiable)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">6. Same-Sex Parents (Q36):</span>
                      <span className="text-slate-600">Homosexual couples are as good parents as other couples</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–2 (Gay Parents: Agree) vs 3–5 (Gay Parents: Disagree/Neutral)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">7. Men Better Leaders (Q29):</span>
                      <span className="text-slate-600">On the whole, men make better political leaders than women</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–2 (Men Lead: Agree) vs 3–4 (Men Lead: Disagree)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">8. Men Job Priority (Q33):</span>
                      <span className="text-slate-600">When jobs are scarce, men have more right to a job than women</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–2 (Men Job: Agree) vs 3–5 (Men Job: Disagree/Neutral)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">9. Corruption Level (Q112):</span>
                      <span className="text-slate-600">Perception of how widespread corruption is in the country</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      8–10 (Corrupt: High) vs 1–7 (Corrupt: Low/Mod)
                    </code>
                  </div>

                  <div className="p-3 bg-white hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 mr-2">10. Gov Responsibility (Q108):</span>
                      <span className="text-slate-600">State welfare vs personal responsibility to provide for oneself</span>
                    </div>
                    <code className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono text-[10px] shrink-0">
                      1–5 (Welfare: State) vs 6–10 (Welfare: Self-Reliance)
                    </code>
                  </div>
                </div>
              </div>

              {/* Supplementary Demographic Variables */}
              <div className="space-y-3 pt-2">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Supplementary Demographic Variables (Projected Passively)
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-semibold block">Gender (Q260):</strong>
                    <p className="text-slate-600"><code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">1 (Male)</code> or <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">2 (Female)</code></p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-semibold block">Age Group (Q262):</strong>
                    <p className="text-slate-600"><code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">&lt;30 (18–29)</code>, <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">30–49</code>, or <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">&gt;=50 (50+)</code></p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-semibold block">Education Level (Q275):</strong>
                    <p className="text-slate-600"><code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">0–2 (Edu: Low)</code>, <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">3–5 (Edu: Mid)</code>, or <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">6–8 (Edu: High)</code></p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-semibold block">Ideology Left/Right (Q240):</strong>
                    <p className="text-slate-600"><code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">1–4 (Left)</code>, <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">5–6 (Center)</code>, <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">7–10 (Right)</code>, or <code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-slate-200">NA (No Label)</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATISTICAL APPENDIX */}
          {modalTab === 'appendix' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Table 1: Eigenvalues & Inertia */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-blue-700" />
                  Eigenvalues & Explained Inertia (Appendix Page 6)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Dimension</th>
                        <th className="p-2.5">Eigenvalue</th>
                        <th className="p-2.5">Variance (%)</th>
                        <th className="p-2.5">Cumulative (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr className="bg-blue-50/50 font-bold text-blue-900">
                        <td className="p-2.5">Dim 1</td>
                        <td className="p-2.5">0.165</td>
                        <td className="p-2.5">14.992%</td>
                        <td className="p-2.5">14.992%</td>
                      </tr>
                      <tr className="bg-blue-50/30 font-bold text-blue-900">
                        <td className="p-2.5">Dim 2</td>
                        <td className="p-2.5">0.146</td>
                        <td className="p-2.5">13.313%</td>
                        <td className="p-2.5">28.305%</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="p-2.5">Dim 3</td>
                        <td className="p-2.5">0.113</td>
                        <td className="p-2.5">10.293%</td>
                        <td className="p-2.5">38.598%</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="p-2.5">Dim 4</td>
                        <td className="p-2.5">0.107</td>
                        <td className="p-2.5">9.741%</td>
                        <td className="p-2.5">48.339%</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="p-2.5">Dim 5</td>
                        <td className="p-2.5">0.098</td>
                        <td className="p-2.5">8.932%</td>
                        <td className="p-2.5">57.271%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: Top Drivers Dim 1 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-700" />
                  Top Drivers: Dimension 1 (Progressive Liberalism vs Traditional Conservatism)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Coordinate</th>
                        <th className="p-2.5">Contribution (%)</th>
                        <th className="p-2.5">Cos² Quality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Gay: Justifiable</td><td className="p-2 text-blue-700 font-semibold">+0.782</td><td className="p-2 font-bold text-slate-900">15.4%</td><td className="p-2">0.435</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Corrupt: High</td><td className="p-2 text-blue-700 font-semibold">+0.708</td><td className="p-2 font-bold text-slate-900">13.2%</td><td className="p-2">0.386</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Gay: Never/Rarely</td><td className="p-2 text-red-600 font-semibold">-0.557</td><td className="p-2 font-bold text-slate-900">11.0%</td><td className="p-2">0.435</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Corrupt: Low/Mod</td><td className="p-2 text-red-600 font-semibold">-0.545</td><td className="p-2 font-bold text-slate-900">10.2%</td><td className="p-2">0.386</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Men Job: Agree</td><td className="p-2 text-red-600 font-semibold">-0.576</td><td className="p-2 font-bold text-slate-900">6.46%</td><td className="p-2">0.157</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Men Lead: Agree</td><td className="p-2 text-red-600 font-semibold">-0.463</td><td className="p-2 font-bold text-slate-900">6.36%</td><td className="p-2">0.205</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Welfare: Self-Reliance</td><td className="p-2 text-red-600 font-semibold">-0.476</td><td className="p-2 font-bold text-slate-900">6.34%</td><td className="p-2">0.194</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Radical Change</td><td className="p-2 text-red-600 font-semibold">-0.567</td><td className="p-2 font-bold text-slate-900">6.19%</td><td className="p-2">0.150</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Men Lead: Disagree</td><td className="p-2 text-blue-700 font-semibold">+0.443</td><td className="p-2 font-bold text-slate-900">6.08%</td><td className="p-2">0.205</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Welfare: State</td><td className="p-2 text-blue-700 font-semibold">+0.408</td><td className="p-2 font-bold text-slate-900">5.43%</td><td className="p-2">0.194</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 3: Top Drivers Dim 2 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-red-600" />
                  Top Drivers: Dimension 2 (Democratic Anti-Militarism vs Authoritarian Paternalism)
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Coordinate</th>
                        <th className="p-2.5">Contribution (%)</th>
                        <th className="p-2.5">Cos² Quality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Leader: Bad</td><td className="p-2 text-blue-700 font-semibold">+1.980</td><td className="p-2 font-bold text-slate-900">22.60%</td><td className="p-2">0.362</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Army Rule: Bad</td><td className="p-2 text-blue-700 font-semibold">+0.785</td><td className="p-2 font-bold text-slate-900">15.70%</td><td className="p-2">0.367</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Gay Parents: Agree</td><td className="p-2 text-red-600 font-semibold">-0.575</td><td className="p-2 font-bold text-slate-900">10.20%</td><td className="p-2">0.271</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Army Rule: Good</td><td className="p-2 text-red-600 font-semibold">-0.468</td><td className="p-2 font-bold text-slate-900">9.36%</td><td className="p-2">0.367</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Gay Parents: Disagree/Neutral</td><td className="p-2 text-blue-700 font-semibold">+0.471</td><td className="p-2 font-bold text-slate-900">8.34%</td><td className="p-2">0.271</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Welfare: Self-Reliance</td><td className="p-2 text-blue-700 font-semibold">+0.492</td><td className="p-2 font-bold text-slate-900">7.62%</td><td className="p-2">0.207</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Welfare: State</td><td className="p-2 text-red-600 font-semibold">-0.421</td><td className="p-2 font-bold text-slate-900">6.53%</td><td className="p-2">0.207</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Radical Change</td><td className="p-2 text-blue-700 font-semibold">+0.493</td><td className="p-2 font-bold text-slate-900">5.28%</td><td className="p-2">0.113</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Gradual Reform</td><td className="p-2 text-red-600 font-semibold">-0.307</td><td className="p-2 font-bold text-slate-900">3.54%</td><td className="p-2">0.115</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Leader: Good</td><td className="p-2 text-red-600 font-semibold">-0.183</td><td className="p-2 font-bold text-slate-900">2.08%</td><td className="p-2">0.362</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 4: Supplementary Demographics & Ideology v-tests */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Supplementary Demographics & Ideology: Coordinates & V-Tests
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                      <tr>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Dim 1 Coord</th>
                        <th className="p-2.5">Dim 1 v-test</th>
                        <th className="p-2.5">Dim 2 Coord</th>
                        <th className="p-2.5">Dim 2 v-test</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Center</td><td className="p-2">+0.033</td><td className="p-2">0.97</td><td className="p-2">-0.099</td><td className="p-2 text-red-600 font-semibold">-2.87</td></tr>
                      <tr className="bg-red-50/30"><td className="p-2 font-sans font-medium text-slate-900">Left</td><td className="p-2 text-red-600">-0.349</td><td className="p-2 text-red-600 font-semibold">-3.77</td><td className="p-2 text-red-600">-0.258</td><td className="p-2 text-red-600 font-semibold">-2.78</td></tr>
                      <tr className="bg-blue-50/30"><td className="p-2 font-sans font-medium text-slate-900">No Ideology Label</td><td className="p-2 text-blue-700 font-semibold">+0.268</td><td className="p-2 text-blue-700 font-bold">+5.27</td><td className="p-2">+0.061</td><td className="p-2">1.20</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Right</td><td className="p-2 text-red-600">-0.197</td><td className="p-2 text-red-600 font-semibold">-3.89</td><td className="p-2 text-blue-700">+0.199</td><td className="p-2 text-blue-700 font-semibold">+3.93</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Female</td><td className="p-2">+0.074</td><td className="p-2 text-blue-700 font-semibold">+2.65</td><td className="p-2">-0.088</td><td className="p-2 text-red-600 font-semibold">-3.14</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Male</td><td className="p-2">-0.077</td><td className="p-2 text-red-600 font-semibold">-2.52</td><td className="p-2">+0.102</td><td className="p-2 text-blue-700 font-semibold">+3.35</td></tr>
                      <tr className="bg-blue-50/20"><td className="p-2 font-sans font-medium text-slate-900">18–29</td><td className="p-2 text-blue-700">+0.185</td><td className="p-2 text-blue-700 font-semibold">+2.54</td><td className="p-2 text-blue-700">+0.149</td><td className="p-2 text-blue-700 font-semibold">+2.05</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">30–49</td><td className="p-2">-0.040</td><td className="p-2">-1.23</td><td className="p-2">-0.096</td><td className="p-2 text-red-600 font-semibold">-2.92</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">50+</td><td className="p-2">-0.018</td><td className="p-2">-0.54</td><td className="p-2">+0.051</td><td className="p-2">1.51</td></tr>
                      <tr className="bg-indigo-50/30"><td className="p-2 font-sans font-medium text-slate-900">Edu: High</td><td className="p-2 text-blue-700 font-semibold">+0.301</td><td className="p-2 text-blue-700 font-bold">+3.64</td><td className="p-2 text-red-600">-0.174</td><td className="p-2 text-red-600 font-semibold">-2.10</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Edu: Low</td><td className="p-2 text-red-600">-0.113</td><td className="p-2 text-red-600 font-bold">-5.79</td><td className="p-2">+0.043</td><td className="p-2 text-blue-700 font-semibold">+2.19</td></tr>
                      <tr><td className="p-2 font-sans font-medium text-slate-900">Edu: Mid</td><td className="p-2 text-blue-700">+0.214</td><td className="p-2 text-blue-700 font-semibold">+3.54</td><td className="p-2">-0.032</td><td className="p-2">-0.52</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Academic References */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              Academic & Data Citations
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Suwanasing, E. (2026). <em>Thailand Sociocultural Value Dimensions: A Multiple Correspondence Analysis of Wave 7 World Values Survey</em>. Research Report.</li>
              <li>• World Values Survey Association (2018). <em>World Values Survey Wave 7 (Thailand Country Survey)</em>. Fieldwork conducted in 2018.</li>
              <li>• Greenacre, M., & Blasius, J. (2006). <em>Multiple Correspondence Analysis and Related Methods</em>. Chapman and Hall/CRC.</li>
              <li>• Le Roux, B., & Rouanet, H. (2010). <em>Multiple Correspondence Analysis</em>. SAGE Publications.</li>
              <li>• Husson, F., Josse, J., Le, S., & Mazet, J. (2020). <em>FactoMineR: Multivariate Exploratory Data Analysis and Data Mining</em>. R package version 2.4.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Author: <strong className="text-slate-700">Emily Suwanasing</strong> • Script: <code className="text-slate-600 font-mono">politics_analytics.R</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition shadow-sm"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
