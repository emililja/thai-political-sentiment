import React from 'react';
import { STORY_SLIDES } from '../data/mcaData';
import { StorySlide } from '../types/mca';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Compass, 
  Quote, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface StoryModeProps {
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onApplyHighlight: (categoryIds: string[], supplementaryIds: string[]) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({
  currentSlideIndex,
  onSelectSlide,
  onApplyHighlight
}) => {
  const currentSlide = STORY_SLIDES[currentSlideIndex];

  const handleNext = () => {
    const nextIdx = (currentSlideIndex + 1) % STORY_SLIDES.length;
    onSelectSlide(nextIdx);
    onApplyHighlight(STORY_SLIDES[nextIdx].highlightCategoryIds, STORY_SLIDES[nextIdx].highlightSupplementaryIds);
  };

  const handlePrev = () => {
    const prevIdx = (currentSlideIndex - 1 + STORY_SLIDES.length) % STORY_SLIDES.length;
    onSelectSlide(prevIdx);
    onApplyHighlight(STORY_SLIDES[prevIdx].highlightCategoryIds, STORY_SLIDES[prevIdx].highlightSupplementaryIds);
  };

  const handleJump = (index: number) => {
    onSelectSlide(index);
    onApplyHighlight(STORY_SLIDES[index].highlightCategoryIds, STORY_SLIDES[index].highlightSupplementaryIds);
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Story Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {STORY_SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              onClick={() => handleJump(idx)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-rose-500/15 border-rose-500/60 shadow-lg shadow-rose-950/40 translate-y-[-2px]' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                  isCurrent ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  Insight 0{idx + 1} • {slide.badge}
                </span>
                <h4 className={`text-xs font-semibold line-clamp-1 ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                  {slide.title}
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 line-clamp-1">
                {slide.insightBadge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Narrative Feature Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle accent blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
              Sociological Revelation {currentSlideIndex + 1} of {STORY_SLIDES.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {currentSlide.insightBadge}
            </span>
          </div>
        </div>

        {/* Story Body */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentSlide.title}
            </h3>

            <p className="text-base text-rose-200/90 font-medium leading-relaxed">
              {currentSlide.summary}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {currentSlide.detail}
            </p>

            {currentSlide.quote && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start space-x-3 text-slate-300 text-xs italic">
                <Quote className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <p>"{currentSlide.quote}"</p>
              </div>
            )}
          </div>

          {/* Focal Points Sidebar */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              Highlighted Nodes on Biplot
            </h5>

            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 font-medium">Active Value Items:</div>
              <div className="flex flex-wrap gap-1.5">
                {currentSlide.highlightCategoryIds.map(id => (
                  <span
                    key={id}
                    className="text-xs px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 font-medium"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>

            {currentSlide.highlightSupplementaryIds.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500 font-medium">Demographic Anchors:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentSlide.highlightSupplementaryIds.map(id => (
                    <span
                      key={id}
                      className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-medium"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => onApplyHighlight(currentSlide.highlightCategoryIds, currentSlide.highlightSupplementaryIds)}
                className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                Focus Points in Biplot
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous Insight
          </button>

          <div className="flex items-center space-x-1.5">
            {STORY_SLIDES.map((_, i) => (
              <span
                key={i}
                onClick={() => handleJump(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition ${
                  i === currentSlideIndex ? 'bg-rose-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition"
          >
            Next Insight
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
