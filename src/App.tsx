import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Biplot } from './components/Biplot';
import { RespondentScatterplot } from './components/RespondentScatterplot';
import { DriverAnalytics } from './components/DriverAnalytics';
import { DataTable } from './components/DataTable';
import { ItemInspector } from './components/ItemInspector';
import { MethodologyModal } from './components/MethodologyModal';
import { 
  mcaCategories, 
  mcaSupplementary, 
  mcaVariance, 
  mcaIndividuals,
  QUADRANT_DEFINITIONS 
} from './data/mcaData';
import { MCACategory, SupplementaryCategory } from './types/mca';
import { 
  Compass, 
  TrendingUp, 
  Users, 
  Layers, 
  Sparkles, 
  Info, 
  ChevronRight
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'biplot' | 'scatterplot' | 'analytics' | 'data'>('biplot');
  const [selectedItem, setSelectedItem] = useState<MCACategory | SupplementaryCategory | null>(null);
  const [highlightCategoryIds, setHighlightCategoryIds] = useState<string[]>([]);
  const [highlightSupplementaryIds, setHighlightSupplementaryIds] = useState<string[]>([]);
  const [activeQuadrantFilter, setActiveQuadrantFilter] = useState<number | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  const handleSelectQuadrant = (q: number | null) => {
    setActiveQuadrantFilter(q);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Metric Bar / Hero Summary */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Total 2D Inertia</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">{mcaVariance.total}%</span>
                <span className="text-[10px] text-slate-500">D1 {mcaVariance.dim1}% • D2 {mcaVariance.dim2}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Active Value Items</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">{mcaCategories.length}</span>
                <span className="text-[10px] text-slate-500">10 Dichotomized Questions</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Respondent Sample</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">{mcaIndividuals.length.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500">{mcaSupplementary.length} Demog. Categories</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">Data Source</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">WVS Wave 7</span>
                <span className="text-[10px] text-slate-500">Thailand (2017–2022)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Interactive Biplot Map */}
        {activeTab === 'biplot' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              <Biplot
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                highlightCategoryIds={highlightCategoryIds}
                highlightSupplementaryIds={highlightSupplementaryIds}
                activeQuadrantFilter={activeQuadrantFilter}
                onSelectQuadrant={handleSelectQuadrant}
              />
            </div>

            {/* Side Column: Inspector or Quadrant Guide */}
            <div className="lg:col-span-4 space-y-4">
              {selectedItem ? (
                <ItemInspector
                  item={selectedItem}
                  onClose={() => setSelectedItem(null)}
                  onSelectItem={setSelectedItem}
                />
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-blue-700" />
                      Political Quadrants
                    </h3>
                    <span className="text-[11px] text-slate-400">Click to filter</span>
                  </div>

                  <div className="space-y-2.5">
                    {([1, 2, 3, 4] as const).map(qNum => {
                      const q = QUADRANT_DEFINITIONS[qNum];
                      const isFiltered = activeQuadrantFilter === qNum;

                      return (
                        <div
                          key={qNum}
                          onClick={() => handleSelectQuadrant(isFiltered ? null : qNum)}
                          className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                            isFiltered
                              ? 'bg-blue-50 border-blue-500 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">
                                {qNum}
                              </span>
                              {q.title}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 transition ${isFiltered ? 'rotate-90 text-blue-700' : 'text-slate-400'}`} />
                          </div>

                          <div className="text-[11px] text-blue-800 font-medium mt-1">
                            {q.subtitle}
                          </div>

                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {q.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Teaser to Scatterplot */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('scatterplot')}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-700 to-red-600 hover:from-blue-800 hover:to-red-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-900/10"
                    >
                      <Sparkles className="w-4 h-4" />
                      Explore Respondent Scatterplot ({mcaIndividuals.length} Samples)
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Interpretation Guide Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-2 shadow-sm">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  How to Read This MCA Map
                </h4>
                <p className="text-[11px] leading-relaxed">
                  Multiple Correspondence Analysis projects qualitative attitudes into a continuous Cartesian space where proximity indicates high co-occurrence in survey responses.
                </p>
                <div className="space-y-1 text-[11px] pt-1 text-slate-700">
                  <div>• <strong>Horizontal (Dim 1)</strong>: Progressive Modernity (+) vs Patriarchal Conservatism (-)</div>
                  <div>• <strong>Vertical (Dim 2)</strong>: Anti-Military Governance (+) vs Authoritarian Paternalism (-)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Respondent Scatterplot (Replaced 4 insight section) */}
        {activeTab === 'scatterplot' && (
          <RespondentScatterplot />
        )}

        {/* Tab 3: Driver Analytics */}
        {activeTab === 'analytics' && (
          <DriverAnalytics
            onSelectItem={(item) => {
              setSelectedItem(item);
              setActiveTab('biplot');
            }}
          />
        )}

        {/* Tab 4: Data Explorer & Export */}
        {activeTab === 'data' && (
          <DataTable
            onSelectItem={(item) => {
              setSelectedItem(item);
              setActiveTab('biplot');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Methodology & Documentation Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
}

export default App;
