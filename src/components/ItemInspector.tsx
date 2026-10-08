import React from 'react';
import { MCACategory, SupplementaryCategory } from '../types/mca';
import { 
  DOMAIN_COLORS, 
  DEMOGRAPHIC_COLORS, 
  QUADRANT_DEFINITIONS,
  mcaCategories 
} from '../data/mcaData';
import { 
  X, 
  HelpCircle, 
  Target, 
  ArrowLeftRight, 
  Sparkles, 
  Compass, 
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface ItemInspectorProps {
  item: MCACategory | SupplementaryCategory | null;
  onClose: () => void;
  onSelectItem: (item: MCACategory | SupplementaryCategory) => void;
}

export const ItemInspector: React.FC<ItemInspectorProps> = ({
  item,
  onClose,
  onSelectItem
}) => {
  if (!item) return null;

  const isCategory = 'domain' in item;
  const quadrantInfo = QUADRANT_DEFINITIONS[item.quadrant];

  // Find paired opposite if active category
  const pairedItem = isCategory && (item as MCACategory).pairedWith
    ? mcaCategories.find(c => c.id === (item as MCACategory).pairedWith)
    : null;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
              isCategory 
                ? `${DOMAIN_COLORS[(item as MCACategory).domain].badgeBg} ${DOMAIN_COLORS[(item as MCACategory).domain].text} border ${DOMAIN_COLORS[(item as MCACategory).domain].badgeBorder}`
                : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
            }`}>
              {isCategory ? (item as MCACategory).domain : `${(item as SupplementaryCategory).group} Demographic`}
            </span>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              Quadrant {item.quadrant}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            {item.id}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Description & Interpretation */}
      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <p className="font-medium text-slate-200">{item.description}</p>

        {isCategory && (
          <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">
              Survey Question ({item.wvsQuestionCode}):
            </span>
            <span className="italic">"{item.surveyQuestion}"</span>
          </div>
        )}
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Dimension 1</span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {item.dim1 > 0 ? `+${item.dim1.toFixed(3)}` : item.dim1.toFixed(3)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {item.dim1 > 0 ? 'Progressive Pole' : 'Traditional Pole'}
          </span>
        </div>

        <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
          <span className="text-[10px] text-slate-500 block uppercase font-medium">Dimension 2</span>
          <span className="text-sm font-mono font-bold text-slate-200">
            {item.dim2 > 0 ? `+${item.dim2.toFixed(3)}` : item.dim2.toFixed(3)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {item.dim2 > 0 ? 'Anti-Military' : 'Paternalist'}
          </span>
        </div>

        {isCategory ? (
          <>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Contrib Total</span>
              <span className="text-sm font-mono font-bold text-rose-400">
                {(item as MCACategory).contrib_total}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                D1: {(item as MCACategory).contrib_dim1}% | D2: {(item as MCACategory).contrib_dim2}%
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Cos² Quality</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {(item as MCACategory).cos2_total.toFixed(3)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                D1: {(item as MCACategory).cos2_dim1} | D2: {(item as MCACategory).cos2_dim2}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">V-Test Dim 1</span>
              <span className={`text-sm font-mono font-bold ${(item as SupplementaryCategory).isSignificantDim1 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {(item as SupplementaryCategory).vtest_dim1 > 0 ? `+${(item as SupplementaryCategory).vtest_dim1}` : (item as SupplementaryCategory).vtest_dim1}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {(item as SupplementaryCategory).isSignificantDim1 ? 'Significant (p < 0.05)' : 'Not Significant'}
              </span>
            </div>

            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">V-Test Dim 2</span>
              <span className={`text-sm font-mono font-bold ${(item as SupplementaryCategory).isSignificantDim2 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {(item as SupplementaryCategory).vtest_dim2 > 0 ? `+${(item as SupplementaryCategory).vtest_dim2}` : (item as SupplementaryCategory).vtest_dim2}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {(item as SupplementaryCategory).isSignificantDim2 ? 'Significant (p < 0.05)' : 'Not Significant'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Quadrant Placement Info */}
      <div className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 font-medium">Located in: </span>
          <strong className="text-slate-100">{quadrantInfo.title}</strong>
          <span className="text-slate-400 block text-[11px] mt-0.5">{quadrantInfo.subtitle}</span>
        </div>
      </div>

      {/* Opposing Pole Link */}
      {pairedItem && (
        <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px] block">Contrasting Value Pole:</span>
              <span className="font-bold text-indigo-200">{pairedItem.id}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectItem(pairedItem)}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 transition"
          >
            Inspect Opposite
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
