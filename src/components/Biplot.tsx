import React, { useState, useRef, useMemo } from 'react';
import { 
  MCACategory, 
  SupplementaryCategory, 
  DomainType, 
  DemographicGroup 
} from '../types/mca';
import { 
  DOMAIN_COLORS, 
  DEMOGRAPHIC_COLORS, 
  QUADRANT_DEFINITIONS,
  mcaCategories,
  mcaSupplementary,
  mcaVariance
} from '../data/mcaData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Layers, 
  Filter, 
  Crosshair, 
  Eye, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

interface BiplotProps {
  selectedItem: MCACategory | SupplementaryCategory | null;
  onSelectItem: (item: MCACategory | SupplementaryCategory | null) => void;
  highlightCategoryIds?: string[];
  highlightSupplementaryIds?: string[];
  activeQuadrantFilter?: number | null;
  onSelectQuadrant?: (q: number | null) => void;
}

export const Biplot: React.FC<BiplotProps> = ({
  selectedItem,
  onSelectItem,
  highlightCategoryIds = [],
  highlightSupplementaryIds = [],
  activeQuadrantFilter = null,
  onSelectQuadrant
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // View & Filter states
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [focusCore, setFocusCore] = useState<boolean>(false);
  const [sizeMetric, setSizeMetric] = useState<'contrib' | 'cos2' | 'equal'>('contrib');
  const [showSupplementary, setShowSupplementary] = useState<boolean>(true);
  const [showConnectingVectors, setShowConnectingVectors] = useState<boolean>(true);
  const [showRaysToOrigin, setShowRaysToOrigin] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<MCACategory | SupplementaryCategory | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Domain visibility filters
  const [visibleDomains, setVisibleDomains] = useState<Record<DomainType, boolean>>({
    'Regime & Authority': true,
    'Personal & LGBTQ+ Autonomy': true,
    'Gender Hierarchy': true,
    'Economy & Corruption': true,
  });

  // Demographic group visibility
  const [visibleGroups, setVisibleGroups] = useState<Record<DemographicGroup, boolean>>({
    'Ideology': true,
    'Age': true,
    'Gender': true,
    'Education': true,
  });

  // SVG Dimensions & Margins
  const width = 880;
  const height = 660;
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Coordinate Domain bounds
  const bounds = useMemo(() => {
    if (focusCore) {
      // Focus dense center region
      return {
        xMin: -0.75,
        xMax: 0.95,
        yMin: -0.75,
        yMax: 0.95,
      };
    }
    // Full view including 'Leader: Bad' at y=+1.982
    return {
      xMin: -0.75,
      xMax: 0.95,
      yMin: -0.75,
      yMax: 2.15,
    };
  }, [focusCore]);

  // Scale functions (coordinate to SVG pixels)
  const xScale = (val: number) => {
    const range = bounds.xMax - bounds.xMin;
    const factor = (val - bounds.xMin) / range;
    return margin.left + factor * innerWidth;
  };

  const yScale = (val: number) => {
    // Invert for SVG (top is min y, bottom is max y)
    const range = bounds.yMax - bounds.yMin;
    const factor = (val - bounds.yMin) / range;
    return margin.top + (1 - factor) * innerHeight;
  };

  const originX = xScale(0);
  const originY = yScale(0);

  // Compute point radius
  const getCategoryRadius = (cat: MCACategory) => {
    if (sizeMetric === 'equal') return 8;
    if (sizeMetric === 'contrib') {
      // contrib ranges from ~0.5 to 22.62
      const base = Math.sqrt(cat.contrib_total);
      return Math.max(6, Math.min(22, base * 3.8));
    }
    // cos2 ranges from ~0.02 to 0.48
    return Math.max(6, Math.min(22, Math.sqrt(cat.cos2_total) * 26));
  };

  // Filter items
  const filteredCategories = useMemo(() => {
    return mcaCategories.filter(cat => {
      if (!visibleDomains[cat.domain]) return false;
      if (activeQuadrantFilter && cat.quadrant !== activeQuadrantFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          cat.id.toLowerCase().includes(q) ||
          cat.domain.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [visibleDomains, activeQuadrantFilter, searchQuery]);

  const filteredSupplementary = useMemo(() => {
    if (!showSupplementary) return [];
    return mcaSupplementary.filter(sup => {
      if (!visibleGroups[sup.group]) return false;
      if (activeQuadrantFilter && sup.quadrant !== activeQuadrantFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          sup.id.toLowerCase().includes(q) ||
          sup.group.toLowerCase().includes(q) ||
          sup.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [showSupplementary, visibleGroups, activeQuadrantFilter, searchQuery]);

  // Opposing pairs for connecting lines
  const pairedVectors = useMemo(() => {
    if (!showConnectingVectors) return [];
    const pairs: Array<{ from: MCACategory; to: MCACategory; label: string }> = [];
    const seen = new Set<string>();

    mcaCategories.forEach(cat => {
      if (cat.pairedWith && !seen.has(cat.id)) {
        const partner = mcaCategories.find(c => c.id === cat.pairedWith);
        if (partner) {
          seen.add(cat.id);
          seen.add(partner.id);
          // Only show if at least one domain is visible
          if (visibleDomains[cat.domain] || visibleDomains[partner.domain]) {
            pairs.push({ from: cat, to: partner, label: cat.variableName });
          }
        }
      }
    });

    return pairs;
  }, [showConnectingVectors, visibleDomains]);

  // Export SVG / PNG
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thai-political-mca-biplot.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = width * 2; // High resolution retina
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'thai-political-mca-biplot.png';
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Helper to test if item is highlighted by story or selection
  const isItemActive = (id: string, isCategory: boolean) => {
    if (selectedItem?.id === id) return true;
    if (isCategory && highlightCategoryIds.length > 0) {
      return highlightCategoryIds.includes(id);
    }
    if (!isCategory && highlightSupplementaryIds.length > 0) {
      return highlightSupplementaryIds.includes(id);
    }
    return false;
  };

  const hasAnyHighlight = 
    selectedItem !== null || 
    highlightCategoryIds.length > 0 || 
    highlightSupplementaryIds.length > 0;

  // Grid tick values
  const xTicks = [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8];
  const yTicks = focusCore ? [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8] : [-0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Metric Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            Bubble Size:
          </span>
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSizeMetric('contrib')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                sizeMetric === 'contrib' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Size bubbles by total percentage contribution to the two dimensions"
            >
              Contribution %
            </button>
            <button
              onClick={() => setSizeMetric('cos2')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                sizeMetric === 'cos2' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Size bubbles by Cos2 (quality of 2D representation)"
            >
              Cos² Quality
            </button>
            <button
              onClick={() => setSizeMetric('equal')}
              className={`px-2.5 py-1 rounded-md transition font-medium ${
                sizeMetric === 'equal' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Uniform
            </button>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFocusCore(!focusCore)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              focusCore
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle between full axis (with Leader: Bad outlier) and zoomed core space"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {focusCore ? 'View All (Include Outliers)' : 'Focus Core Space'}
          </button>

          <button
            onClick={() => setShowConnectingVectors(!showConnectingVectors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              showConnectingVectors
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
            }`}
            title="Draw vector lines between opposing question responses"
          >
            <Layers className="w-3.5 h-3.5" />
            Opposing Vectors
          </button>

          <button
            onClick={() => setShowSupplementary(!showSupplementary)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              showSupplementary
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle projected demographic & ideological categories"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Demographics
          </button>
        </div>

        {/* Search & Export */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search attitude or demo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60 w-44"
          />

          <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
            <button
              onClick={handleExportSvg}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
              title="Download high-resolution SVG"
            >
              <Download className="w-3.5 h-3.5" />
              SVG
            </button>
            <button
              onClick={handleExportPng}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1"
              title="Download rasterized PNG image"
            >
              <Download className="w-3.5 h-3.5" />
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* Domain & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Active Domains:</span>
          {(Object.keys(DOMAIN_COLORS) as DomainType[]).map(domain => {
            const config = DOMAIN_COLORS[domain];
            const isVisible = visibleDomains[domain];
            return (
              <button
                key={domain}
                onClick={() => setVisibleDomains(prev => ({ ...prev, [domain]: !prev[domain] }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  isVisible 
                    ? `${config.badgeBg} ${config.badgeBorder} ${config.text} font-medium shadow-sm` 
                    : 'bg-slate-900 border-slate-800 text-slate-500 line-through opacity-60'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: isVisible ? config.fill : '#64748b' }} 
                />
                {domain}
              </button>
            );
          })}
        </div>

        {/* Quadrant Quick Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-slate-400 font-medium">Quadrant:</span>
          <button
            onClick={() => onSelectQuadrant?.(null)}
            className={`text-xs px-2 py-0.5 rounded border transition ${
              activeQuadrantFilter === null 
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {[1, 2, 3, 4].map(q => {
            const isSelected = activeQuadrantFilter === q;
            return (
              <button
                key={q}
                onClick={() => onSelectQuadrant?.(isSelected ? null : q)}
                className={`text-xs px-2 py-0.5 rounded border transition ${
                  isSelected 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold shadow' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={`Filter to Quadrant ${q}: ${QUADRANT_DEFINITIONS[q as 1|2|3|4].title}`}
              >
                Q{q}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main SVG Visualization Canvas */}
      <div className="relative bg-slate-950 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Refined Multiple Correspondence Analysis Biplot for Thai Political Values"
        >
          <defs>
            {/* Subtle quadrant background gradients */}
            <linearGradient id="q1Gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.07" />
            </linearGradient>
            <linearGradient id="q2Gradient" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.07" />
            </linearGradient>
            <linearGradient id="q3Gradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.07" />
            </linearGradient>
            <linearGradient id="q4Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.07" />
            </linearGradient>

            {/* Marker arrow for connecting vectors */}
            <marker
              id="vectorArrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" fillOpacity="0.6" />
            </marker>
          </defs>

          {/* Quadrant Background Shading */}
          <rect
            x={originX}
            y={margin.top}
            width={width - margin.right - originX}
            height={originY - margin.top}
            fill="url(#q1Gradient)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 1 ? 1 : 0.2}
          />
          <rect
            x={margin.left}
            y={margin.top}
            width={originX - margin.left}
            height={originY - margin.top}
            fill="url(#q2Gradient)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 2 ? 1 : 0.2}
          />
          <rect
            x={margin.left}
            y={originY}
            width={originX - margin.left}
            height={height - margin.bottom - originY}
            fill="url(#q3Gradient)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 3 ? 1 : 0.2}
          />
          <rect
            x={originX}
            y={originY}
            width={width - margin.right - originX}
            height={height - margin.bottom - originY}
            fill="url(#q4Gradient)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 4 ? 1 : 0.2}
          />

          {/* Quadrant Descriptive Labels in Corners */}
          <g className="text-xs pointer-events-none select-none opacity-40">
            {/* Q1 Top-Right */}
            <text x={width - margin.right - 10} y={margin.top + 22} textAnchor="end" fill="#10B981" fontWeight="700" fontSize="13">
              Q1: Progressive Anti-Authoritarian
            </text>
            <text x={width - margin.right - 10} y={margin.top + 38} textAnchor="end" fill="#94A3B8" fontSize="10">
              Anti-Military • Gender Equality • Anti-Corruption
            </text>

            {/* Q2 Top-Left */}
            <text x={margin.left + 10} y={margin.top + 22} textAnchor="start" fill="#F59E0B" fontWeight="700" fontSize="13">
              Q2: Anti-Authoritarian Traditionalists
            </text>
            <text x={margin.left + 10} y={margin.top + 38} textAnchor="start" fill="#94A3B8" fontSize="10">
              Radical Change • Self-Reliance • Moral Conservatism
            </text>

            {/* Q3 Bottom-Left */}
            <text x={margin.left + 10} y={height - margin.bottom - 26} textAnchor="start" fill="#F43F5E" fontWeight="700" fontSize="13">
              Q3: Patriarchal Paternalism & Order
            </text>
            <text x={margin.left + 10} y={height - margin.bottom - 12} textAnchor="start" fill="#94A3B8" fontSize="10">
              Pro-Military • Strong Leader • Traditional Hierarchy
            </text>

            {/* Q4 Bottom-Right */}
            <text x={width - margin.right - 10} y={height - margin.bottom - 26} textAnchor="end" fill="#A855F7" fontWeight="700" fontSize="13">
              Q4: Paternalist Modernizers & Welfare
            </text>
            <text x={width - margin.right - 10} y={height - margin.bottom - 12} textAnchor="end" fill="#94A3B8" fontSize="10">
              State Welfare • LGBTQ+ Autonomy • Gradual Reform
            </text>
          </g>

          {/* Minor Grid Lines */}
          <g stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3">
            {xTicks.map(val => (
              <line 
                key={`xtick-${val}`} 
                x1={xScale(val)} 
                y1={margin.top} 
                x2={xScale(val)} 
                y2={height - margin.bottom} 
              />
            ))}
            {yTicks.map(val => (
              <line 
                key={`ytick-${val}`} 
                x1={margin.left} 
                y1={yScale(val)} 
                x2={width - margin.right} 
                y2={yScale(val)} 
              />
            ))}
          </g>

          {/* Major Zero Axes (Crosshairs) */}
          <g stroke="#475569" strokeWidth="1.5">
            {/* X-axis (Dim 1 = 0) */}
            <line 
              x1={margin.left} 
              y1={originY} 
              x2={width - margin.right} 
              y2={originY} 
            />
            {/* Y-axis (Dim 2 = 0) */}
            <line 
              x1={originX} 
              y1={margin.top} 
              x2={originX} 
              y2={height - margin.bottom} 
            />
          </g>

          {/* Axis Labels & Values */}
          <g fontSize="10" fill="#64748B" fontFamily="monospace">
            {xTicks.map(val => (
              <text key={`xval-${val}`} x={xScale(val)} y={height - margin.bottom + 16} textAnchor="middle">
                {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
              </text>
            ))}
            {yTicks.map(val => (
              <text key={`yval-${val}`} x={margin.left - 8} y={yScale(val) + 3} textAnchor="end">
                {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
              </text>
            ))}
          </g>

          {/* Main Axis Title Descriptions */}
          <g>
            {/* Dimension 1 X-Axis Label */}
            <text
              x={(margin.left + width - margin.right) / 2}
              y={height - 16}
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-300"
            >
              Dimension 1 ({mcaVariance.dim1}% Inertia) — Progressive Liberalism & Anti-Corruption vs Traditional Conservatism
            </text>

            {/* Dimension 2 Y-Axis Label */}
            <text
              transform={`rotate(-90) translate(${-(margin.top + height - margin.bottom) / 2}, 20)`}
              textAnchor="middle"
              className="text-xs font-semibold fill-slate-300"
            >
              Dimension 2 ({mcaVariance.dim2}% Inertia) — Democratic Anti-Militarism vs Authoritarian Paternalism
            </text>
          </g>

          {/* Connecting Vectors Between Paired Polarity Poles */}
          {pairedVectors.map((pair, idx) => {
            const x1 = xScale(pair.from.dim1);
            const y1 = yScale(pair.from.dim2);
            const x2 = xScale(pair.to.dim1);
            const y2 = yScale(pair.to.dim2);

            const isPairActive = 
              isItemActive(pair.from.id, true) || 
              isItemActive(pair.to.id, true) || 
              hoveredItem?.id === pair.from.id || 
              hoveredItem?.id === pair.to.id;

            return (
              <g key={`vector-${idx}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isPairActive ? '#F43F5E' : '#475569'}
                  strokeWidth={isPairActive ? 2 : 1.2}
                  strokeDasharray="4,4"
                  opacity={isPairActive ? 0.9 : hasAnyHighlight ? 0.15 : 0.45}
                />
              </g>
            );
          })}

          {/* Dashed Rays from Origin to Supplementary Demographics */}
          {showSupplementary && filteredSupplementary.map(sup => {
            const x = xScale(sup.dim1);
            const y = yScale(sup.dim2);
            const isActive = isItemActive(sup.id, false) || hoveredItem?.id === sup.id;

            return (
              <line
                key={`ray-${sup.id}`}
                x1={originX}
                y1={originY}
                x2={x}
                y2={y}
                stroke={DEMOGRAPHIC_COLORS[sup.group].fill}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray="3,3"
                opacity={isActive ? 0.9 : hasAnyHighlight ? 0.1 : 0.3}
              />
            );
          })}

          {/* Supplementary Demographic Points (Plotted as Rhombuses/Diamonds) */}
          {showSupplementary && filteredSupplementary.map(sup => {
            const cx = xScale(sup.dim1);
            const cy = yScale(sup.dim2);
            const isActive = isItemActive(sup.id, false);
            const isHovered = hoveredItem?.id === sup.id;
            const config = DEMOGRAPHIC_COLORS[sup.group];
            const size = 8;

            const opacity = hasAnyHighlight 
              ? (isActive || isHovered ? 1 : 0.2)
              : 0.85;

            return (
              <g
                key={`sup-${sup.id}`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectItem(sup)}
                onMouseEnter={(e) => {
                  setHoveredItem(sup);
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setTooltipPos(null);
                }}
              >
                {/* Diamond Shape */}
                <polygon
                  points={`${cx},${cy - size - (isActive ? 3 : 0)} ${cx + size + (isActive ? 3 : 0)},${cy} ${cx},${cy + size + (isActive ? 3 : 0)} ${cx - size - (isActive ? 3 : 0)},${cy}`}
                  fill={config.fill}
                  fillOpacity={0.8}
                  stroke="#FFFFFF"
                  strokeWidth={isActive ? 2.5 : 1.2}
                  opacity={opacity}
                />

                {/* Demographic Text Label */}
                <text
                  x={cx}
                  y={cy - size - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isActive ? "700" : "500"}
                  fill={isActive ? "#FFFFFF" : config.fill}
                  opacity={opacity}
                  className="pointer-events-none drop-shadow"
                >
                  {sup.id}
                </text>
              </g>
            );
          })}

          {/* Active Categories Points (Circles) */}
          {filteredCategories.map(cat => {
            const cx = xScale(cat.dim1);
            const cy = yScale(cat.dim2);
            const radius = getCategoryRadius(cat);
            const isActive = isItemActive(cat.id, true);
            const isHovered = hoveredItem?.id === cat.id;
            const config = DOMAIN_COLORS[cat.domain];

            const opacity = hasAnyHighlight 
              ? (isActive || isHovered ? 1 : 0.2)
              : 0.9;

            return (
              <g
                key={`cat-${cat.id}`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectItem(cat)}
                onMouseEnter={(e) => {
                  setHoveredItem(cat);
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  const rect = svgRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setTooltipPos(null);
                }}
              >
                {/* Glow ring if active */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 6}
                    fill="none"
                    stroke={config.fill}
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                    strokeDasharray="4,2"
                    className="animate-spin"
                    style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '8s' }}
                  />
                )}

                {/* Main Point Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={config.fill}
                  fillOpacity={0.82}
                  stroke="#FFFFFF"
                  strokeWidth={isActive || isHovered ? 2.5 : 1.2}
                  opacity={opacity}
                  className="biplot-point"
                />

                {/* Core dot for precision */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={2}
                  fill="#FFFFFF"
                  opacity={opacity}
                />

                {/* Text Label */}
                <text
                  x={cx}
                  y={cy + radius + 13}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isActive || isHovered ? "700" : "500"}
                  fill={isActive ? "#FFFFFF" : isHovered ? "#F8FAFC" : "#E2E8F0"}
                  opacity={opacity}
                  className="pointer-events-none drop-shadow-md"
                >
                  {cat.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Tooltip Card Overlay */}
        {hoveredItem && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs transition-all duration-75 text-xs text-slate-200"
            style={{
              left: Math.min(width - 240, Math.max(16, tooltipPos.x + 12)),
              top: Math.min(height - 180, Math.max(16, tooltipPos.y + 12)),
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">{hoveredItem.id}</span>
              {'domain' in hoveredItem ? (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${DOMAIN_COLORS[hoveredItem.domain].badgeBg} ${DOMAIN_COLORS[hoveredItem.domain].text} border ${DOMAIN_COLORS[hoveredItem.domain].badgeBorder}`}>
                  {hoveredItem.domain}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
                  {hoveredItem.group}
                </span>
              )}
            </div>

            <p className="mt-1.5 text-slate-300 text-[11px] leading-relaxed">
              {hoveredItem.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div>
                <span className="text-slate-500 block">Coordinates:</span>
                <span className="font-mono text-slate-200">
                  [{hoveredItem.dim1 > 0 ? `+${hoveredItem.dim1.toFixed(3)}` : hoveredItem.dim1.toFixed(3)}, {hoveredItem.dim2 > 0 ? `+${hoveredItem.dim2.toFixed(3)}` : hoveredItem.dim2.toFixed(3)}]
                </span>
              </div>

              {'contrib_total' in hoveredItem ? (
                <div>
                  <span className="text-slate-500 block">Combined Contrib:</span>
                  <span className="font-mono font-semibold text-rose-400">
                    {hoveredItem.contrib_total}%
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-slate-500 block">V-Test (Dim 1 / 2):</span>
                  <span className="font-mono text-cyan-400">
                    {hoveredItem.vtest_dim1 > 0 ? `+${hoveredItem.vtest_dim1}` : hoveredItem.vtest_dim1} / {hoveredItem.vtest_dim2 > 0 ? `+${hoveredItem.vtest_dim2}` : hoveredItem.vtest_dim2}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 text-[10px] text-slate-400 italic">
              Click node to open complete breakdown & survey question
            </div>
          </div>
        )}
      </div>

      {/* Legend & Guide Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span>Active Survey Attitude</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-cyan-400 inline-block" />
            <span>Projected Demographic Group</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-6 border-b border-dashed border-slate-400 inline-block" />
            <span>Opposing Value Pole</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <span>Quadrant 1: Top-Right</span>
          <span>•</span>
          <span>Quadrant 2: Top-Left</span>
          <span>•</span>
          <span>Quadrant 3: Bottom-Left</span>
          <span>•</span>
          <span>Quadrant 4: Bottom-Right</span>
        </div>
      </div>
    </div>
  );
};
