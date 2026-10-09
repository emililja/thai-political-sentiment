import React, { useState } from 'react';
import { mcaCategories, mcaSupplementary, mcaVariance, DOMAIN_COLORS, DEMOGRAPHIC_COLORS } from '../data/mcaData';
import { MCACategory, SupplementaryCategory } from '../types/mca';
import { BarChart3, TrendingUp, Award, Info } from 'lucide-react';

interface DriverAnalyticsProps {
  onSelectItem: (item: MCACategory | SupplementaryCategory) => void;
}

export const DriverAnalytics: React.FC<DriverAnalyticsProps> = ({ onSelectItem }) => {
  const [activeTab, setActiveTab] = useState<'dim1' | 'dim2' | 'cos2' | 'vtest'>('dim1');

  // Cutoff for 21 categories: 100 / 21 = 4.76%
  const cutoff = 100 / mcaCategories.length;

  const sortedDim1 = [...mcaCategories].sort((a, b) => b.contrib_dim1 - a.contrib_dim1);
  const sortedDim2 = [...mcaCategories].sort((a, b) => b.contrib_dim2 - a.contrib_dim2);
  const sortedCos2 = [...mcaCategories].sort((a, b) => b.cos2_total - a.cos2_total);

  return (
    <div className="w-full space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('dim1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'dim1'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Dimension 1 Drivers ({mcaVariance.dim1}% Inertia)
          </button>

          <button
            onClick={() => setActiveTab('dim2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'dim2'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Dimension 2 Drivers ({mcaVariance.dim2}% Inertia)
          </button>

          <button
            onClick={() => setActiveTab('cos2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'cos2'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Representation Quality (Cos²)
          </button>

          <button
            onClick={() => setActiveTab('vtest')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'vtest'
                ? 'bg-blue-50 text-blue-700 border border-blue-300 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Demographic V-Tests (Significance)
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Cutoff threshold for significance: <strong className="text-slate-800">{cutoff.toFixed(2)}%</strong></span>
        </div>
      </div>

      {/* Tab: Dimension 1 Drivers */}
      {activeTab === 'dim1' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Dimension 1: The Modernity & Anti-Corruption Axis</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explains {mcaVariance.dim1}% of total active inertia. Items above {cutoff.toFixed(2)}% contribute more than average.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              10 Significant Driver Categories
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {sortedDim1.map((cat, idx) => {
              const isAboveCutoff = cat.contrib_dim1 >= cutoff;
              const maxContrib = sortedDim1[0].contrib_dim1;
              const widthPct = (cat.contrib_dim1 / maxContrib) * 100;
              const config = DOMAIN_COLORS[cat.domain];

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectItem(cat)}
                  className="group p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="w-48 shrink-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate">
                        {cat.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block pl-7">
                      {cat.domain} • Coord: {cat.dim1 > 0 ? `+${cat.dim1.toFixed(3)}` : cat.dim1.toFixed(3)}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="flex-1 h-5 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 flex items-center">
                    <div
                      className="h-full transition-all duration-500 rounded-md"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: config.fill,
                        opacity: isAboveCutoff ? 0.95 : 0.45
                      }}
                    />

                    {/* Cutoff Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                      style={{ left: `${(cutoff / maxContrib) * 100}%` }}
                      title={`Average Cutoff Threshold: ${cutoff.toFixed(2)}%`}
                    />
                  </div>

                  <div className="w-20 text-right shrink-0">
                    <span className={`text-xs font-mono font-bold ${isAboveCutoff ? 'text-red-600' : 'text-slate-400'}`}>
                      {cat.contrib_dim1.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Dimension 2 Drivers */}
      {activeTab === 'dim2' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Dimension 2: The Military & Authoritarian Cleavage</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Explains {mcaVariance.dim2}% of inertia. Dominated by rejection of strongmen and military rule.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-semibold">
              8 Significant Driver Categories
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {sortedDim2.map((cat, idx) => {
              const isAboveCutoff = cat.contrib_dim2 >= cutoff;
              const maxContrib = sortedDim2[0].contrib_dim2; // 22.62%
              const widthPct = (cat.contrib_dim2 / maxContrib) * 100;
              const config = DOMAIN_COLORS[cat.domain];

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectItem(cat)}
                  className="group p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="w-48 shrink-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                      <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 truncate">
                        {cat.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block pl-7">
                      {cat.domain} • Coord: {cat.dim2 > 0 ? `+${cat.dim2.toFixed(3)}` : cat.dim2.toFixed(3)}
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="flex-1 h-5 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 flex items-center">
                    <div
                      className="h-full transition-all duration-500 rounded-md"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: config.fill,
                        opacity: isAboveCutoff ? 0.95 : 0.45
                      }}
                    />

                    {/* Cutoff Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-600 z-10"
                      style={{ left: `${(cutoff / maxContrib) * 100}%` }}
                      title={`Average Cutoff Threshold: ${cutoff.toFixed(2)}%`}
                    />
                  </div>

                  <div className="w-20 text-right shrink-0">
                    <span className={`text-xs font-mono font-bold ${isAboveCutoff ? 'text-red-600' : 'text-slate-400'}`}>
                      {cat.contrib_dim2.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Representation Quality (Cos2) */}
      {activeTab === 'cos2' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Quality of Representation (Cos² Total)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cos² measures the squared correlation between an item and the 2D plane (higher = more faithfully depicted).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {sortedCos2.map(cat => {
              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectItem(cat)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{cat.id}</h5>
                    <span className="text-[10px] text-slate-500">{cat.domain}</span>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Cos² D1: {cat.cos2_dim1.toFixed(3)}</span>
                      <span>•</span>
                      <span>Cos² D2: {cat.cos2_dim2.toFixed(3)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-blue-700">
                      {cat.cos2_total.toFixed(3)}
                    </span>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (cat.cos2_total / 0.5) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Demographic V-Tests */}
      {activeTab === 'vtest' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Demographic & Ideological Projections (V-Test)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              V-test scores follow a standard normal distribution (Z). Scores with |v| &gt; 1.96 are statistically significant (p &lt; 0.05); scores with |v| &gt; 3.29 indicate p &lt; 0.001.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Demographic Category</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4 text-center">Dim 1 Coord</th>
                  <th className="py-3 px-4 text-center">V-Test (Dim 1)</th>
                  <th className="py-3 px-4 text-center">Dim 2 Coord</th>
                  <th className="py-3 px-4 text-center">V-Test (Dim 2)</th>
                  <th className="py-3 px-4">Significance Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {mcaSupplementary.map(sup => {
                  const isDim1Sig = Math.abs(sup.vtest_dim1) >= 1.96;
                  const isDim2Sig = Math.abs(sup.vtest_dim2) >= 1.96;
                  const config = DEMOGRAPHIC_COLORS[sup.group];

                  return (
                    <tr
                      key={sup.id}
                      onClick={() => onSelectItem(sup)}
                      className="hover:bg-slate-50 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-sans font-bold text-slate-800">
                        {sup.id}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.border} ${config.text} ${config.iconBg}`}>
                          {sup.group}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {sup.dim1 > 0 ? `+${sup.dim1.toFixed(3)}` : sup.dim1.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          isDim1Sig 
                            ? (sup.vtest_dim1 > 0 ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-red-50 text-red-800 border border-red-200') 
                            : 'text-slate-400'
                        }`}>
                          {sup.vtest_dim1 > 0 ? `+${sup.vtest_dim1}` : sup.vtest_dim1}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700">
                        {sup.dim2 > 0 ? `+${sup.dim2.toFixed(3)}` : sup.dim2.toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          isDim2Sig 
                            ? (sup.vtest_dim2 > 0 ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-red-50 text-red-800 border border-red-200') 
                            : 'text-slate-400'
                        }`}>
                          {sup.vtest_dim2 > 0 ? `+${sup.vtest_dim2}` : sup.vtest_dim2}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600 text-[11px]">
                        {sup.id === 'No Ideology Label' && 'Massive alignment with progressive modernity (p < 0.0001)'}
                        {sup.id === 'Edu: Low' && 'Severe pull toward traditional patriarchal pole (p < 0.0001)'}
                        {sup.id === 'Edu: High' && 'Significant pull toward progressive autonomy & reform'}
                        {sup.id === 'Left' && 'Conservative skew on Dim 1; pro-welfare on Dim 2'}
                        {sup.id === 'Right' && 'Conservative on Dim 1; strongly anti-strongman on Dim 2'}
                        {sup.id === '18-29' && 'Youth cohort pulls toward Q1 (democratic & progressive)'}
                        {sup.id === '30-49' && 'Paternalist stability and state welfare bias'}
                        {sup.id === 'Male' && 'Slightly conservative on Dim 1; pro-democracy on Dim 2'}
                        {sup.id === 'Female' && 'Significantly progressive on Dim 1; pro-welfare on Dim 2'}
                        {sup.id === 'Center' && 'Centrist moderates leaning toward gradual state welfare'}
                        {sup.id === '50+' && 'Slight traditional skew'}
                        {sup.id.includes('.NA') && 'Unspecified demographic responses'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
