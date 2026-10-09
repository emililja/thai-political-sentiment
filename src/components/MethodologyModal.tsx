import React from 'react';
import { X, BookOpen, Layers, FileText, Code2, Database } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Research Methodology & Mathematical Foundation</h3>
              <p className="text-xs text-slate-500">Multiple Correspondence Analysis (MCA) on World Values Survey Wave 7</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Dataset Provenance */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-700" />
              1. Dataset Provenance & Sample Selection
            </h4>
            <p>
              Data is drawn from the <strong>World Values Survey (WVS) Wave 7 (2017–2022)</strong> cross-national dataset (Version 6.0), filtering specifically for the Thailand representative sample (<code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-200">B_COUNTRY == 764</code> / <code className="text-blue-700 font-mono bg-blue-50 px-1 py-0.5 rounded border border-blue-200">THA</code>). The Thai sample comprises approximately 1,500 adult respondents interviewed through stratified multistage probability sampling across all geographical regions of Thailand (Central, North, Northeast, and South).
            </p>
          </div>

          {/* Neutral Fence-Sitter Dichotomization */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              2. Eliminating "Fence-Sitter" Artifacts (Dichotomization)
            </h4>
            <p>
              In Asian survey research—and particularly in Thai social psychology—respondents exhibit a pronounced <em>acquiescence bias</em> and high propensity to choose midpoint or neutral categories (e.g., "Neither agree nor disagree", score 5 on a 10-point scale) to avoid conflict. In standard MCA, uncollapsed neutral options cluster near the centroid (0,0) and compress the ideological variance, creating misleading "response-style" axes rather than true ideological divisions.
            </p>
            <p>
              To isolate high-signal substantive convictions, the 10 active items were systematically dichotomized:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Army Rule (Q237)</strong>: 1-2 (Good) vs 3-4 (Bad)</li>
              <li><strong>Strong Leader (Q235)</strong>: 1-2 (Good) vs 3-4 (Bad)</li>
              <li><strong>Military Coup Compatibility (Q245)</strong>: 1-5 (Non-Democratic) vs 6-10 (Compatible with Democracy)</li>
              <li><strong>LGBTQ+ Morality (Q182)</strong>: 1-4 (Never/Rarely Justifiable) vs 5-10 (Justifiable)</li>
              <li><strong>Gender Leadership & Employment (Q29, Q33)</strong>: Agree vs Disagree/Neutral</li>
              <li><strong>Corruption Perception (Q112)</strong>: 8-10 (High Perception) vs 1-7 (Low/Moderate)</li>
              <li><strong>State Welfare vs Individual Responsibility (Q108)</strong>: 1-5 (State Responsibility) vs 6-10 (Self-Reliance)</li>
              <li><strong>Society Reform (Q42)</strong>: Retained as a 3-category trichotomy (Radical Change, Gradual Reform, Defend Society)</li>
            </ul>
          </div>

          {/* Mathematical Foundations of MCA */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              3. Multiple Correspondence Analysis (FactoMineR)
            </h4>
            <p>
              The statistical model was computed using the <code className="text-indigo-700 font-mono bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200">FactoMineR</code> package in R. MCA represents individuals and categories as points in a low-dimensional Euclidean space through singular value decomposition of the normalized Burt matrix.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-800">
              <div>• <strong>Variance Explained:</strong> Dim 1 = 14.99% inertia, Dim 2 = 13.31% inertia. Combined 2D subspace = 28.30% of total inertia.</div>
              <div>• <strong>Contribution Threshold (100 / K):</strong> With K = 21 active categories, the average expected contribution is 100 / 21 = <strong>4.76%</strong>. Items exceeding this cutoff are structural drivers.</div>
              <div>• <strong>V-Test (Supplementary Variables):</strong> Test-values measure the statistical distance of demographic barycenters from the origin in units of standard deviations. Scores with |v| &gt; 1.96 correspond to p &lt; 0.05.</div>
            </div>
          </div>

          {/* Academic References */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              4. Key References
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px]">
              <li>• Greenacre, M., & Blasius, J. (2006). <em>Multiple Correspondence Analysis and Related Methods</em>. Chapman and Hall/CRC.</li>
              <li>• Le Roux, B., & Rouanet, H. (2010). <em>Multiple Correspondence Analysis</em>. SAGE Publications.</li>
              <li>• World Values Survey Wave 7 (2020). Thailand Country Survey Report, World Values Survey Association.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Source analysis: <code className="text-slate-600 font-mono">politics_analytics.R</code>
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
