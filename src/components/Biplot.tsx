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
  Download, 
  Layers, 
  Crosshair, 
  Sparkles,
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
  const [focusCore, setFocusCore] = useState<boolean>(false);
  const [sizeMetric, setSizeMetric] = useState<'contrib' | 'cos2' | 'equal'>('contrib');
  const [showSupplementary, setShowSupplementary] = useState<boolean>(true);
  const [showConnectingVectors, setShowConnectingVectors] = useState<boolean>(true);
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
  const [visibleGroups] = useState<Record<DemographicGroup, boolean>>({
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

  // Scales: Map theoretical MCA coordinates to SVG pixels
  const xScale = (val: number): number => {
    return margin.left + ((val - bounds.xMin) / (bounds.xMax - bounds.xMin)) * innerWidth;
  };

  const yScale = (val: number): number => {
    // In SVG, y=0 is at top, so higher Dim 2 coordinates should map to smaller pixel y
    return margin.top + ((bounds.yMax - val) / (bounds.yMax - bounds.yMin)) * innerHeight;
  };

  const originX = xScale(0);
  const originY = yScale(0);

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return mcaCategories.filter(cat => {
      // Domain filter
      if (!visibleDomains[cat.domain]) return false;

      // Quadrant filter
      if (activeQuadrantFilter !== null && cat.quadrant !== activeQuadrantFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          cat.id.toLowerCase().includes(query) ||
          cat.domain.toLowerCase().includes(query) ||
          cat.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [visibleDomains, activeQuadrantFilter, searchQuery]);

  // Filter Supplementary Variables
  const filteredSupplementary = useMemo(() => {
    if (!showSupplementary) return [];

    return mcaSupplementary.filter(sup => {
      // Group filter
      if (!visibleGroups[sup.group]) return false;

      // Quadrant filter
      if (activeQuadrantFilter !== null && sup.quadrant !== activeQuadrantFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          sup.id.toLowerCase().includes(query) ||
          sup.group.toLowerCase().includes(query) ||
          sup.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [showSupplementary, visibleGroups, activeQuadrantFilter, searchQuery]);

  // Paired items for connecting vector lines
  const pairedVectors = useMemo(() => {
    if (!showConnectingVectors) return [];

    const pairs: Array<{ from: MCACategory; to: MCACategory }> = [];
    const processed = new Set<string>();

    mcaCategories.forEach(cat => {
      if (cat.pairedWith && !processed.has(cat.id)) {
        const opposing = mcaCategories.find(c => c.id === cat.pairedWith);
        if (opposing && visibleDomains[cat.domain] && visibleDomains[opposing.domain]) {
          pairs.push({ from: cat, to: opposing });
          processed.add(cat.id);
          processed.add(opposing.id);
        }
      }
    });

    return pairs;
  }, [showConnectingVectors, visibleDomains]);

  // Calculate bubble radius based on active metric
  const getCategoryRadius = (cat: MCACategory): number => {
    if (sizeMetric === 'equal') return 6.5;

    if (sizeMetric === 'cos2') {
      // cos2 ranges from ~0.008 to ~0.435. Map to [4, 16]
      const minR = 4;
      const maxR = 17;
      const normalized = Math.min(1, Math.max(0, cat.cos2_total / 0.5));
      return minR + normalized * (maxR - minR);
    }

    // sizeMetric === 'contrib'
    // contrib_total ranges from ~0.04 to ~23.09. Map to [4.5, 18]
    const minR = 4.5;
    const maxR = 19;
    const normalized = Math.min(1, Math.max(0, cat.contrib_total / 24));
    return minR + normalized * (maxR - minR);
  };

  // Check if item is highlighted
  const hasAnyHighlight = highlightCategoryIds.length > 0 || highlightSupplementaryIds.length > 0;

  const isItemActive = (id: string, isCat: boolean): boolean => {
    if (selectedItem?.id === id) return true;
    if (isCat && highlightCategoryIds.includes(id)) return true;
    if (!isCat && highlightSupplementaryIds.includes(id)) return true;
    return false;
  };

  // Axis grid ticks
  const xTicks = [-0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8];
  const yTicks = focusCore 
    ? [-0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8]
    : [-0.6, -0.4, -0.2, 0.2, 0.4, 0.6, 0.8, 1.2, 1.6, 2.0];

  // SVG Export Handler
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thai-mca-biplot-${new Date().toISOString().slice(0, 10)}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // PNG Export Handler
  const handleExportPng = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const img = new Image();
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2;
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `thai-mca-biplot-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Control Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Metric Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-blue-700" />
            Bubble Size:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setSizeMetric('contrib')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                sizeMetric === 'contrib' 
                  ? 'bg-blue-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Size bubbles by total percentage contribution to the two dimensions"
            >
              Contribution %
            </button>
            <button
              onClick={() => setSizeMetric('cos2')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                sizeMetric === 'cos2' 
                  ? 'bg-blue-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Size bubbles by Cos2 (quality of 2D representation)"
            >
              Cos² Quality
            </button>
            <button
              onClick={() => setSizeMetric('equal')}
              className={`px-2.5 py-1 rounded-md transition font-semibold ${
                sizeMetric === 'equal' 
                  ? 'bg-blue-700 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
              focusCore
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle between full axis (with Leader: Bad outlier) and zoomed core space"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {focusCore ? 'View All (Include Outliers)' : 'Focus Core Space'}
          </button>

          <button
            onClick={() => setShowConnectingVectors(!showConnectingVectors)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
              showConnectingVectors
                ? 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Draw vector lines between opposing question responses"
          >
            <Layers className="w-3.5 h-3.5" />
            Opposing Vectors
          </button>

          <button
            onClick={() => setShowSupplementary(!showSupplementary)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
              showSupplementary
                ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
            className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white w-44"
          />

          <div className="flex items-center space-x-1 border-l border-slate-200 pl-2">
            <button
              onClick={handleExportSvg}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition text-xs font-semibold flex items-center gap-1 shadow-sm"
              title="Download high-resolution SVG"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              SVG
            </button>
            <button
              onClick={handleExportPng}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition text-xs font-semibold flex items-center gap-1 shadow-sm"
              title="Download rasterized PNG image"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              PNG
            </button>
          </div>
        </div>
      </div>

      {/* Domain & Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Active Domains:</span>
          {(Object.keys(DOMAIN_COLORS) as DomainType[]).map(domain => {
            const config = DOMAIN_COLORS[domain];
            const isVisible = visibleDomains[domain];
            return (
              <button
                key={domain}
                onClick={() => setVisibleDomains(prev => ({ ...prev, [domain]: !prev[domain] }))}
                className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1.5 ${
                  isVisible 
                    ? `${config.badgeBg} ${config.badgeBorder} ${config.text} font-semibold shadow-xs` 
                    : 'bg-white border-slate-200 text-slate-400 line-through opacity-60'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: isVisible ? config.fill : '#94A3B8' }} 
                />
                {domain}
              </button>
            );
          })}
        </div>

        {/* Quadrant Quick Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs text-slate-500 font-semibold">Quadrant:</span>
          <button
            onClick={() => onSelectQuadrant?.(null)}
            className={`text-xs px-2 py-0.5 rounded border transition ${
              activeQuadrantFilter === null 
                ? 'bg-blue-700 text-white border-blue-700 font-semibold shadow-xs' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
                    ? 'bg-blue-700 text-white border-blue-700 font-semibold shadow-xs' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
      <div className="relative bg-[#FAFCFF] border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Refined Multiple Correspondence Analysis Biplot for Thai Political Values"
        >
          <defs>
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
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" fillOpacity="0.7" />
            </marker>
          </defs>

          {/* Quadrant Background Shading */}
          <rect
            x={originX}
            y={margin.top}
            width={width - margin.right - originX}
            height={originY - margin.top}
            fill="rgba(29, 78, 216, 0.035)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 1 ? 1 : 0.2}
          />
          <rect
            x={margin.left}
            y={margin.top}
            width={originX - margin.left}
            height={originY - margin.top}
            fill="rgba(217, 119, 6, 0.03)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 2 ? 1 : 0.2}
          />
          <rect
            x={margin.left}
            y={originY}
            width={originX - margin.left}
            height={height - margin.bottom - originY}
            fill="rgba(220, 38, 38, 0.035)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 3 ? 1 : 0.2}
          />
          <rect
            x={originX}
            y={originY}
            width={width - margin.right - originX}
            height={height - margin.bottom - originY}
            fill="rgba(79, 70, 229, 0.03)"
            opacity={activeQuadrantFilter === null || activeQuadrantFilter === 4 ? 1 : 0.2}
          />

          {/* Quadrant Descriptive Labels in Corners */}
          <g className="text-xs pointer-events-none select-none opacity-60">
            {/* Q1 Top-Right */}
            <text x={width - margin.right - 10} y={margin.top + 22} textAnchor="end" fill="#1D4ED8" fontWeight="700" fontSize="13">
              Q1: Progressive Anti-Authoritarian
            </text>
            <text x={width - margin.right - 10} y={margin.top + 38} textAnchor="end" fill="#64748B" fontSize="10">
              Anti-Military • Gender Equality • Anti-Corruption
            </text>

            {/* Q2 Top-Left */}
            <text x={margin.left + 10} y={margin.top + 22} textAnchor="start" fill="#D97706" fontWeight="700" fontSize="13">
              Q2: Anti-Authoritarian Traditionalists
            </text>
            <text x={margin.left + 10} y={margin.top + 38} textAnchor="start" fill="#64748B" fontSize="10">
              Radical Change • Self-Reliance • Moral Conservatism
            </text>

            {/* Q3 Bottom-Left */}
            <text x={margin.left + 10} y={height - margin.bottom - 26} textAnchor="start" fill="#DC2626" fontWeight="700" fontSize="13">
              Q3: Patriarchal Paternalism & Order
            </text>
            <text x={margin.left + 10} y={height - margin.bottom - 12} textAnchor="start" fill="#64748B" fontSize="10">
              Pro-Military • Strong Leader • Traditional Hierarchy
            </text>

            {/* Q4 Bottom-Right */}
            <text x={width - margin.right - 10} y={height - margin.bottom - 26} textAnchor="end" fill="#4F46E5" fontWeight="700" fontSize="13">
              Q4: Paternalist Modernizers & Welfare
            </text>
            <text x={width - margin.right - 10} y={height - margin.bottom - 12} textAnchor="end" fill="#64748B" fontSize="10">
              State Welfare • LGBTQ+ Autonomy • Gradual Reform
            </text>
          </g>

          {/* Minor Grid Lines */}
          <g stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3,3">
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
          <g stroke="#94A3B8" strokeWidth="1.5">
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
          <g fontSize="10" fill="#94A3B8" fontFamily="monospace">
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
              className="text-xs font-bold fill-slate-800"
            >
              Dimension 1 ({mcaVariance.dim1}% Inertia) — Progressive Liberalism & Anti-Corruption vs Traditional Conservatism
            </text>

            {/* Dimension 2 Y-Axis Label */}
            <text
              transform={`rotate(-90) translate(${-(margin.top + height - margin.bottom) / 2}, 20)`}
              textAnchor="middle"
              className="text-xs font-bold fill-slate-800"
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
                  stroke={isPairActive ? '#DC2626' : '#94A3B8'}
                  strokeWidth={isPairActive ? 2 : 1.2}
                  strokeDasharray="4,4"
                  opacity={isPairActive ? 0.95 : hasAnyHighlight ? 0.2 : 0.6}
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
                opacity={isActive ? 0.95 : hasAnyHighlight ? 0.15 : 0.4}
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
              ? (isActive || isHovered ? 1 : 0.25)
              : 0.9;

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
                  fillOpacity={0.85}
                  stroke="#FFFFFF"
                  strokeWidth={isActive ? 2.5 : 1.5}
                  opacity={opacity}
                />

                {/* Demographic Text Label */}
                <text
                  x={cx}
                  y={cy - size - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isActive ? "700" : "600"}
                  fill={config.fill}
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  opacity={opacity}
                  className="pointer-events-none drop-shadow-xs"
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
              ? (isActive || isHovered ? 1 : 0.25)
              : 0.95;

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
                  fillOpacity={0.88}
                  stroke="#FFFFFF"
                  strokeWidth={isActive || isHovered ? 2.5 : 1.5}
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

                {/* Text Label with crisp white halo */}
                <text
                  x={cx}
                  y={cy + radius + 13}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isActive || isHovered ? "700" : "600"}
                  fill="#0F172A"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  paintOrder="stroke"
                  strokeLinejoin="round"
                  opacity={opacity}
                  className="pointer-events-none drop-shadow-xs"
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
            className="absolute z-30 pointer-events-none bg-white border border-slate-200 rounded-xl p-3 shadow-xl max-w-xs transition-all duration-75 text-xs text-slate-800"
            style={{
              left: Math.min(width - 240, Math.max(16, tooltipPos.x + 12)),
              top: Math.min(height - 180, Math.max(16, tooltipPos.y + 12)),
            }}
          >
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-sm">{hoveredItem.id}</span>
              {'domain' in hoveredItem ? (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${DOMAIN_COLORS[hoveredItem.domain].badgeBg} ${DOMAIN_COLORS[hoveredItem.domain].text} border ${DOMAIN_COLORS[hoveredItem.domain].badgeBorder}`}>
                  {hoveredItem.domain}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  {hoveredItem.group}
                </span>
              )}
            </div>

            <p className="mt-1.5 text-slate-600 text-[11px] leading-relaxed">
              {hoveredItem.description}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
              <div>
                <span className="text-slate-400 block">Coordinates:</span>
                <span className="font-mono text-slate-900 font-semibold">
                  [{hoveredItem.dim1 > 0 ? `+${hoveredItem.dim1.toFixed(3)}` : hoveredItem.dim1.toFixed(3)}, {hoveredItem.dim2 > 0 ? `+${hoveredItem.dim2.toFixed(3)}` : hoveredItem.dim2.toFixed(3)}]
                </span>
              </div>

              {'contrib_total' in hoveredItem ? (
                <div>
                  <span className="text-slate-400 block">Combined Contrib:</span>
                  <span className="font-mono font-bold text-red-600">
                    {hoveredItem.contrib_total}%
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-slate-400 block">V-Test (Dim 1 / 2):</span>
                  <span className="font-mono text-blue-700 font-semibold">
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
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
            <span>Active Survey Attitude</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-blue-600 inline-block" />
            <span>Projected Demographic Group</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-6 border-b border-dashed border-slate-400 inline-block" />
            <span>Opposing Value Pole</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-slate-500">
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
