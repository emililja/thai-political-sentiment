import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-400">
            Thai Political Values & Societal Cleavages • Multiple Correspondence Analysis
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Based on the World Values Survey (WVS) Wave 7 cross-national dataset (Thailand, N≈1,500). Computed via FactoMineR in R.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Hosted on GitHub Pages
          </span>
          <span>•</span>
          <span>React + Vite + Tailwind CSS</span>
          <span>•</span>
          <span>Open Source Research</span>
        </div>
      </div>
    </footer>
  );
};
