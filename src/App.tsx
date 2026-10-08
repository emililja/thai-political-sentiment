import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Biplot } from './components/Biplot';
import { StoryMode } from './components/StoryMode';
import { DriverAnalytics } from './components/DriverAnalytics';
import { DataTable } from './components/DataTable';
import { ItemInspector } from './components/ItemInspector';
import { MethodologyModal } from './components/MethodologyModal';
import { 
  mcaCategories, 
  mcaSupplementary, 
  mcaVariance, 
  QUADRANT_DEFINITIONS,
  STORY_SLIDES 
} from './data/mcaData';
import { MCACategory, SupplementaryCategory } from './types/mca';
import { 
  Compass, 
  TrendingUp, 
  Users, 
  Layers, 
  Sparkles, 
  Info, 
  ChevronRight,
  HelpCircle,
  BarChart3
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'biplot' | 'stories' | 'analytics' | 'data'>('biplot');
  const [selectedItem, setSelectedItem] = useState<MCACategory | SupplementaryCategory | null>(null);
  const [highlightCategoryIds, setHighlightCategoryIds] = useState<string[]>([]);
  const [highlightSupplementaryIds, setHighlightSupplementaryIds] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [activeQuadrantFilter, setActiveQuadrantFilter] = useState<number | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);

  // When story highlights are triggered
  const handleApplyStoryHighlight = (catIds: string[], supIds: string[]) => {
    setHighlightCategoryIds(catIds);
    setHighlightSupplementaryIds(supIds);
    setSelectedItem(null);
  };

  const handleSelectQuadrant = (q: number | null) => {
    setActiveQuadrantFilter(q);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
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
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Total 2D Inertia</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-white font-mono">{mcaVariance.total}%</span>
                <span className="text-[10px] text-slate-400">D1 {mcaVariance.dim1}% • D2 {mcaVariance.dim2}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Active Value Items</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-white font-mono">{mcaCategories.length}</span>
                <span className="text-[10px] text-slate-400">10 Dichotomized Questions</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Demographic Markers</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-white font-mono">{mcaSupplementary.length}</span>
                <span className="text-[10px] text-slate-400">Ideology, Age, Gender, Edu</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">Representative Sample</span>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-extrabold text-white font-mono">N ≈ 1,500</span>
                <span className="text-[10px] text-slate-400">WVS Wave 7 (Thailand)</span>
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
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-rose-400" />
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
                              ? 'bg-rose-500/15 border-rose-500/60 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-[10px] flex items-center justify-center font-mono">
                                {qNum}
                              </span>
                              {q.title}
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 transition ${isFiltered ? 'rotate-90 text-rose-400' : 'text-slate-500'}`} />
                          </div>

                          <div className="text-[11px] text-rose-300/80 font-medium mt-1">
                            {q.subtitle}
                          </div>

                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                            {q.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Teaser to Story Walkthrough */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTab('stories')}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-rose-950/40"
                    >
                      <Sparkles className="w-4 h-4" />
                      Take the Guided 4-Insight Tour
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Interpretation Guide Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-rose-400" />
                  How to Read This MCA Map
                </h4>
                <p className="text-[11px] leading-relaxed">
                  Multiple Correspondence Analysis projects qualitative attitudes into a continuous Cartesian space where proximity indicates high co-occurrence in survey responses.
                </p>
                <div className="space-y-1 text-[11px] font-mono pt-1 text-slate-300">
                  <div>• <strong>Horizontal (Dim 1)</strong>: Progressive Modernity (+) vs Patriarchal Conservatism (-)</div>
                  <div>• <strong>Vertical (Dim 2)</strong>: Anti-Military Governance (+) vs Authoritarian Paternalism (-)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: The 4 Core Revelations (Story Mode) */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <StoryMode
              currentSlideIndex={currentSlideIndex}
              onSelectSlide={setCurrentSlideIndex}
              onApplyHighlight={handleApplyStoryHighlight}
            />

            {/* Embedded Biplot with Story Focus */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-rose-400" />
                  Live Biplot View: Synchronized to Current Story
                </span>
                <span className="text-xs text-rose-400 font-medium">
                  {STORY_SLIDES[currentSlideIndex].title}
                </span>
              </div>

              <Biplot
                selectedItem={selectedItem}
                onSelectItem={setSelectedItem}
                highlightCategoryIds={STORY_SLIDES[currentSlideIndex].highlightCategoryIds}
                highlightSupplementaryIds={STORY_SLIDES[currentSlideIndex].highlightSupplementaryIds}
                activeQuadrantFilter={null}
              />
            </div>
          </div>
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
