import React from 'react';
import { 
  Users, 
  BookOpen, 
  Map, 
  BarChart2, 
  Table2,
  FileText
} from 'lucide-react';
import { mcaVariance } from '../data/mcaData';

interface HeaderProps {
  activeTab: 'intro' | 'biplot' | 'scatterplot' | 'analytics' | 'data';
  onChangeTab: (tab: 'intro' | 'biplot' | 'scatterplot' | 'analytics' | 'data') => void;
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenMethodology
}) => {
  return (
    <header className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Title & Context */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-red-600 flex items-center justify-center shadow-md shadow-blue-900/10 shrink-0">
            <span className="text-xl">🇹🇭</span>
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Thailand Sociocultural Value Dimensions
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 hidden sm:inline-block">
                WVS Wave 7 (2018)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Report by <strong className="text-slate-700 font-semibold">Emily Suwanasing</strong> • {mcaVariance.total}% Total 2D Inertia
            </p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => onChangeTab('intro')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'intro'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Introduction
          </button>

          <button
            onClick={() => onChangeTab('biplot')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'biplot'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Interactive Map
          </button>

          <button
            onClick={() => onChangeTab('scatterplot')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'scatterplot'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Respondent Scatterplot
          </button>

          <button
            onClick={() => onChangeTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Driver Analytics
          </button>

          <button
            onClick={() => onChangeTab('data')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            Data & Export
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onOpenMethodology}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            title="Read research methodology and survey documentation"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-700" />
            Methodology
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition shadow-sm"
            title="View on GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
