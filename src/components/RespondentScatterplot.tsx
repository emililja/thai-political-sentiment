import React, { useState, useMemo, useRef } from 'react';
import { 
  mcaIndividuals, 
  mcaScatterplotConfig, 
  mcaCategories, 
  mcaVariance, 
  QUADRANT_DEFINITIONS 
} from '../data/mcaData';
import { MCAIndividual, MCACategory } from '../types/mca';
import { 
  Users, 
  Filter, 
  RotateCcw, 
  Download, 
  Layers, 
  Eye, 
  Info, 
  Target, 
  Compass, 
  BarChart3, 
  Sparkles,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { downloadSvg, downloadPng } from '../utils/exportChart';

type ColorByField = 'age_group' | 'education' | 'ideology' | 'gender';

const COLOR_PALETTES: Record<ColorByField, Record<string, { label: string; color: string; bg: string; border: string }>> = {
  age_group: {
    '18-29': { label: 'Youth (18–29)', color: '#1D4ED8', bg: 'bg-blue-50', border: 'border-blue-300' },
    '30-49': { label: 'Adult (30–49)', color: '#6366F1', bg: 'bg-indigo-50', border: 'border-indigo-300' },
    '50+': { label: 'Senior (50+)', color: '#DC2626', bg: 'bg-red-50', border: 'border-red-300' },
  },
  education: {
    'Edu: High': { label: 'Tertiary / Higher', color: '#1D4ED8', bg: 'bg-blue-50', border: 'border-blue-300' },
    'Edu: Mid': { label: 'Secondary / Mid', color: '#0284C7', bg: 'bg-sky-50', border: 'border-sky-300' },
    'Edu: Low': { label: 'Primary / Low', color: '#DC2626', bg: 'bg-red-50', border: 'border-red-300' },
    'Unspecified': { label: 'Not Recorded', color: '#94A3B8', bg: 'bg-slate-100', border: 'border-slate-300' },
  },
  ideology: {
    'Left': { label: 'Left (1–4)', color: '#EF4444', bg: 'bg-red-50', border: 'border-red-300' },
    'Center': { label: 'Center (5–6)', color: '#1D4ED8', bg: 'bg-blue-50', border: 'border-blue-300' },
    'Right': { label: 'Right (7–10)', color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-300' },
    'No Ideology Label': { label: 'No Label / Unsure', color: '#059669', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  },
  gender: {
    'Female': { label: 'Female', color: '#E11D48', bg: 'bg-rose-50', border: 'border-rose-300' },
    'Male': { label: 'Male', color: '#1D4ED8', bg: 'bg-blue-50', border: 'border-blue-300' },
    'Unspecified': { label: 'Not Recorded', color: '#94A3B8', bg: 'bg-slate-100', border: 'border-slate-300' },
  }
};

export const RespondentScatterplot: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Filter & Color controls
  const [colorBy, setColorBy] = useState<ColorByField>('age_group');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [activeQuadrantFilter, setActiveQuadrantFilter] = useState<number | null>(null);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);
  const [showCentroids, setShowCentroids] = useState<boolean>(true);
  const [pointSize, setPointSize] = useState<number>(3.5);
  const [pointOpacity, setPointOpacity] = useState<number>(0.65);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Inspection states
  const [hoveredRespondent, setHoveredRespondent] = useState<MCAIndividual | null>(null);
  const [selectedRespondent, setSelectedRespondent] = useState<MCAIndividual | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // SVG Dimension Constants
  const width = 850;
  const height = 620;
  const margin = { top: 35, right: 35, bottom: 65, left: 65 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Domain extents
  const baseExtent = {
    xMin: -1.05,
    xMax: 1.05,
    yMin: -0.85,
    yMax: 1.35
  };

  const extent = useMemo(() => {
    const xSpan = (baseExtent.xMax - baseExtent.xMin) / zoomLevel;
    const ySpan = (baseExtent.yMax - baseExtent.yMin) / zoomLevel;
    const xMid = 0;
    const yMid = 0.25;
    return {
      xMin: xMid - xSpan / 2,
      xMax: xMid + xSpan / 2,
      yMin: yMid - ySpan / 2,
      yMax: yMid + ySpan / 2,
    };
  }, [zoomLevel]);

  // Coordinate projection functions
  const getSvgX = (x: number) => {
    return margin.left + ((x - extent.xMin) / (extent.xMax - extent.xMin)) * innerWidth;
  };

  const getSvgY = (y: number) => {
    return margin.top + ((extent.yMax - y) / (extent.yMax - extent.yMin)) * innerHeight;
  };

  const originX = getSvgX(0);
  const originY = getSvgY(0);

  // Helper to extract demographic key
  const getDemographicValue = (item: MCAIndividual, field: ColorByField): string => {
    if (field === 'age_group') return item.age_group || 'Unspecified';
    if (field === 'education') return item.education || 'Unspecified';
    if (field === 'ideology') return item.ideology || 'No Ideology Label';
    if (field === 'gender') return item.gender || 'Unspecified';
    return 'Unspecified';
  };

  // Helper to get color for an individual
  const getItemColor = (item: MCAIndividual): string => {
    const val = getDemographicValue(item, colorBy);
    const palette = COLOR_PALETTES[colorBy];
    return palette[val]?.color || '#94A3B8';
  };

  // Filtered respondents
  const filteredIndividuals = useMemo(() => {
    return mcaIndividuals.filter(ind => {
      if (activeQuadrantFilter !== null && ind.quadrant !== activeQuadrantFilter) {
        return false;
      }
      if (activeCategoryFilter !== null) {
        const val = getDemographicValue(ind, colorBy);
        if (val !== activeCategoryFilter) return false;
      }
      return true;
    });
  }, [colorBy, activeCategoryFilter, activeQuadrantFilter]);

  // Demographic centroids calculation
  const centroids = useMemo(() => {
    const groups: Record<string, { sumX: number; sumY: number; count: number }> = {};
    mcaIndividuals.forEach(ind => {
      const val = getDemographicValue(ind, colorBy);
      if (!groups[val]) {
        groups[val] = { sumX: 0, sumY: 0, count: 0 };
      }
      groups[val].sumX += ind.dim1;
      groups[val].sumY += ind.dim2;
      groups[val].count += 1;
    });

    return Object.entries(groups).map(([groupVal, data]) => ({
      group: groupVal,
      label: COLOR_PALETTES[colorBy][groupVal]?.label || groupVal,
      color: COLOR_PALETTES[colorBy][groupVal]?.color || '#64748B',
      x: data.sumX / data.count,
      y: data.sumY / data.count,
      count: data.count,
    }));
  }, [colorBy]);

  // Quadrant distribution statistics
  const quadrantStats = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    filteredIndividuals.forEach(ind => {
      if (ind.quadrant) counts[ind.quadrant]++;
    });
    const total = filteredIndividuals.length || 1;
    return {
      1: { count: counts[1], pct: ((counts[1] / total) * 100).toFixed(1) },
      2: { count: counts[2], pct: ((counts[2] / total) * 100).toFixed(1) },
      3: { count: counts[3], pct: ((counts[3] / total) * 100).toFixed(1) },
      4: { count: counts[4], pct: ((counts[4] / total) * 100).toFixed(1) },
      total: filteredIndividuals.length
    };
  }, [filteredIndividuals]);

  // Handle export data to CSV
  const handleExportCSV = () => {
    const headers = ['id', 'dim1', 'dim2', 'quadrant', 'age_group', 'education', 'ideology', 'gender'];
    const rows = filteredIndividuals.map(i => [
      i.id,
      i.dim1,
      i.dim2,
      i.quadrant,
      `"${i.age_group || ''}"`,
      `"${i.education || ''}"`,
      `"${i.ideology || ''}"`,
      `"${i.gender || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `thai_mca_respondents_${colorBy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Export Handler
  const handleExportSvg = () => {
    if (!svgRef.current) return;
    downloadSvg(
      svgRef.current,
      `thai-mca-respondents-${colorBy}-${new Date().toISOString().slice(0, 10)}`,
      width,
      height
    );
  };

  // PNG Export Handler
  const handleExportPng = () => {
    if (!svgRef.current) return;
    downloadPng(
      svgRef.current,
      `thai-mca-respondents-${colorBy}-${new Date().toISOString().slice(0, 10)}`,
      width,
      height,
      2
    );
  };

  const currentPalette = COLOR_PALETTES[colorBy];

  return (
    <div className="space-y-6">
      {/* Title & Introduction Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-700" />
                Microdata Layer
              </span>
              <span className="text-xs font-semibold text-slate-500">
                WVS Wave 7 • Representative Thai Sample
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Thai Population Value Space: Respondent Scatterplot
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl">
              Distribution of <strong>{mcaIndividuals.length.toLocaleString()} individual survey respondents</strong> projected across the two primary MCA dimensions.
              Observe how demographic subgroups sort into distinct ideological and cultural quadrants.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              onClick={handleExportSvg}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Download high-resolution vector SVG of full scatterplot"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              SVG
            </button>
            <button
              onClick={handleExportPng}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Download full high-resolution raster PNG (never cropped)"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              PNG
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
              title="Download filtered respondent coordinates as CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-700" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Chart Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-4">
            {/* Toolbar & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 text-xs">
              {/* Variable to color by */}
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-blue-700" />
                  Color Subgroups:
                </span>
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    onClick={() => { setColorBy('age_group'); setActiveCategoryFilter(null); }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      colorBy === 'age_group'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Age Cohort
                  </button>
                  <button
                    onClick={() => { setColorBy('education'); setActiveCategoryFilter(null); }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      colorBy === 'education'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Education
                  </button>
                  <button
                    onClick={() => { setColorBy('ideology'); setActiveCategoryFilter(null); }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      colorBy === 'ideology'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Ideology Label
                  </button>
                  <button
                    onClick={() => { setColorBy('gender'); setActiveCategoryFilter(null); }}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      colorBy === 'gender'
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Gender
                  </button>
                </div>
              </div>

              {/* View toggles */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCentroids(!showCentroids)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                    showCentroids
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Toggle average group barycenters"
                >
                  <Target className="w-3.5 h-3.5" />
                  Centroids
                </button>

                <button
                  onClick={() => setShowLandmarks(!showLandmarks)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition flex items-center gap-1.5 ${
                    showLandmarks
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Overlay active MCA value categories as anchors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  MCA Anchors
                </button>

                {/* Zoom buttons */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 2.5))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.8))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setActiveQuadrantFilter(null);
                      setActiveCategoryFilter(null);
                      setSelectedRespondent(null);
                    }}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition"
                    title="Reset view"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Export in Toolbar */}
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
                    title="Download rasterized PNG image (full plot)"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-700" />
                    PNG
                  </button>
                </div>
              </div>
            </div>

            {/* Clickable Legend Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-semibold text-slate-500">Legend (click to isolate):</span>
              {Object.entries(currentPalette).map(([valKey, info]) => {
                const isSelected = activeCategoryFilter === valKey;
                const count = mcaIndividuals.filter(ind => getDemographicValue(ind, colorBy) === valKey).length;
                return (
                  <button
                    key={valKey}
                    onClick={() => setActiveCategoryFilter(isSelected ? null : valKey)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1.5 ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-sm ' + info.bg + ' ' + info.border
                        : activeCategoryFilter !== null
                        ? 'opacity-40 bg-white border-slate-200 text-slate-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                    <span>{info.label}</span>
                    <span className="text-[10px] font-mono text-slate-400">({count})</span>
                  </button>
                );
              })}

              {activeCategoryFilter && (
                <button
                  onClick={() => setActiveCategoryFilter(null)}
                  className="text-xs font-bold text-blue-700 hover:underline ml-2"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Scatterplot SVG Container */}
            <div className="relative bg-[#FAFCFF] border border-slate-200 rounded-xl overflow-hidden shadow-inner">
              <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                style={{ maxHeight: '72vh' }}
              >
                {/* Quadrant Background Tints */}
                <rect
                  x={originX}
                  y={margin.top}
                  width={width - margin.right - originX}
                  height={originY - margin.top}
                  fill="rgba(29, 78, 216, 0.035)"
                  className="transition duration-300"
                />
                <rect
                  x={margin.left}
                  y={margin.top}
                  width={originX - margin.left}
                  height={originY - margin.top}
                  fill="rgba(217, 119, 6, 0.03)"
                  className="transition duration-300"
                />
                <rect
                  x={margin.left}
                  y={originY}
                  width={originX - margin.left}
                  height={height - margin.bottom - originY}
                  fill="rgba(220, 38, 38, 0.035)"
                  className="transition duration-300"
                />
                <rect
                  x={originX}
                  y={originY}
                  width={width - margin.right - originX}
                  height={height - margin.bottom - originY}
                  fill="rgba(79, 70, 229, 0.03)"
                  className="transition duration-300"
                />

                {/* Grid lines */}
                {[-1.0, -0.5, 0.5, 1.0].map(val => {
                  const xPos = getSvgX(val);
                  if (xPos < margin.left || xPos > width - margin.right) return null;
                  return (
                    <g key={`grid-x-${val}`}>
                      <line
                        x1={xPos}
                        y1={margin.top}
                        x2={xPos}
                        y2={height - margin.bottom}
                        stroke="#E2E8F0"
                        strokeDasharray="3,3"
                        strokeWidth="1"
                      />
                      <text
                        x={xPos}
                        y={height - margin.bottom + 16}
                        fill="#94A3B8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {[-0.5, 0.5, 1.0].map(val => {
                  const yPos = getSvgY(val);
                  if (yPos < margin.top || yPos > height - margin.bottom) return null;
                  return (
                    <g key={`grid-y-${val}`}>
                      <line
                        x1={margin.left}
                        y1={yPos}
                        x2={width - margin.right}
                        y2={yPos}
                        stroke="#E2E8F0"
                        strokeDasharray="3,3"
                        strokeWidth="1"
                      />
                      <text
                        x={margin.left - 8}
                        y={yPos + 3.5}
                        fill="#94A3B8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Primary Axes (Origin: 0, 0) */}
                <line
                  x1={margin.left}
                  y1={originY}
                  x2={width - margin.right}
                  y2={originY}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />
                <line
                  x1={originX}
                  y1={margin.top}
                  x2={originX}
                  y2={height - margin.bottom}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                />

                {/* Quadrant Watermark Badges */}
                <g opacity="0.65" pointerEvents="none">
                  {/* Q1 Top-Right */}
                  <text x={width - margin.right - 10} y={margin.top + 22} textAnchor="end" fill="#1D4ED8" fontSize="12" fontWeight="bold">
                    Q1: Democratic Reform & Autonomy
                  </text>
                  {/* Q2 Top-Left */}
                  <text x={margin.left + 10} y={margin.top + 22} textAnchor="start" fill="#D97706" fontSize="12" fontWeight="bold">
                    Q2: Anti-Authoritarian Traditionalism
                  </text>
                  {/* Q3 Bottom-Left */}
                  <text x={margin.left + 10} y={height - margin.bottom - 12} textAnchor="start" fill="#DC2626" fontSize="12" fontWeight="bold">
                    Q3: Patriarchal Paternalism & Order
                  </text>
                  {/* Q4 Bottom-Right */}
                  <text x={width - margin.right - 10} y={height - margin.bottom - 12} textAnchor="end" fill="#4F46E5" fontSize="12" fontWeight="bold">
                    Q4: Welfare Seekers & Gradual Reform
                  </text>
                </g>

                {/* Individual Points */}
                {mcaIndividuals.map(ind => {
                  const isFiltered = filteredIndividuals.includes(ind);
                  const isHovered = hoveredRespondent?.id === ind.id;
                  const isSelected = selectedRespondent?.id === ind.id;
                  const cx = getSvgX(ind.dim1);
                  const cy = getSvgY(ind.dim2);
                  const color = getItemColor(ind);

                  return (
                    <circle
                      key={ind.id}
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7 : isHovered ? 6 : isFiltered ? pointSize : 2}
                      fill={color}
                      opacity={isSelected ? 1 : isHovered ? 1 : isFiltered ? pointOpacity : 0.08}
                      stroke={isSelected ? '#0F172A' : isHovered ? '#FFFFFF' : 'none'}
                      strokeWidth={isSelected ? 2.5 : isHovered ? 1.5 : 0}
                      className="cursor-pointer transition-transform duration-150"
                      onMouseEnter={(e) => {
                        setHoveredRespondent(ind);
                        const rect = svgRef.current?.getBoundingClientRect();
                        if (rect) {
                          setTooltipPos({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                          });
                        }
                      }}
                      onMouseMove={(e) => {
                        const rect = svgRef.current?.getBoundingClientRect();
                        if (rect) {
                          setTooltipPos({
                            x: e.clientX - rect.left,
                            y: e.clientY - rect.top
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredRespondent(null);
                        setTooltipPos(null);
                      }}
                      onClick={() => setSelectedRespondent(isSelected ? null : ind)}
                    />
                  );
                })}

                {/* Overlay Landmark MCA Attitude Categories */}
                {showLandmarks && mcaCategories.map(cat => {
                  const cx = getSvgX(cat.dim1);
                  const cy = getSvgY(cat.dim2);
                  return (
                    <g key={`landmark-${cat.id}`} className="pointer-events-none select-none">
                      <line
                        x1={originX}
                        y1={originY}
                        x2={cx}
                        y2={cy}
                        stroke="#64748B"
                        strokeDasharray="2,2"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      <circle cx={cx} cy={cy} r="4.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
                      <rect
                        x={cx + 6}
                        y={cy - 9}
                        width={cat.id.length * 6.2 + 8}
                        height="16"
                        rx="4"
                        fill="rgba(15, 23, 42, 0.85)"
                      />
                      <text
                        x={cx + 10}
                        y={cy + 3}
                        fill="#FFFFFF"
                        fontSize="9.5"
                        fontWeight="600"
                      >
                        {cat.id}
                      </text>
                    </g>
                  );
                })}

                {/* Demographic Centroids / Group Averages */}
                {showCentroids && centroids.map(c => {
                  const cx = getSvgX(c.x);
                  const cy = getSvgY(c.y);
                  return (
                    <g key={`centroid-${c.group}`} className="pointer-events-none select-none">
                      {/* Outer pulse ring */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="12"
                        fill="none"
                        stroke={c.color}
                        strokeWidth="2"
                        strokeDasharray="3,2"
                        opacity="0.75"
                      />
                      {/* Inner star / diamond dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="5"
                        fill={c.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Centroid Label pill */}
                      <rect
                        x={cx - (c.label.length * 3.4 + 10)}
                        y={cy - 26}
                        width={c.label.length * 6.8 + 20}
                        height="18"
                        rx="9"
                        fill="#FFFFFF"
                        stroke={c.color}
                        strokeWidth="1.5"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      />
                      <text
                        x={cx}
                        y={cy - 14}
                        fill="#0F172A"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ★ {c.label}
                      </text>
                    </g>
                  );
                })}

                {/* Axis Labels & Directional Indicators */}
                <g className="select-none">
                  {/* X Axis Center Label */}
                  <text
                    x={originX}
                    y={height - 20}
                    fill="#1E293B"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {mcaScatterplotConfig.x.label} ({mcaVariance.dim1}% Inertia)
                  </text>
                  <text
                    x={margin.left}
                    y={height - 20}
                    fill="#DC2626"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="start"
                  >
                    ← Traditional Agrarian Conservatism
                  </text>
                  <text
                    x={width - margin.right}
                    y={height - 20}
                    fill="#1D4ED8"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    Cosmopolitan Modernity →
                  </text>

                  {/* Y Axis Center Label (Rotated) */}
                  <text
                    transform={`rotate(-90)`}
                    x={-originY}
                    y={22}
                    fill="#1E293B"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {mcaScatterplotConfig.y.label} ({mcaVariance.dim2}% Inertia)
                  </text>
                </g>
              </svg>

              {/* Interactive Floating Tooltip */}
              {hoveredRespondent && tooltipPos && (
                <div
                  className="absolute pointer-events-none z-30 bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-xs space-y-1.5 min-w-[210px]"
                  style={{
                    left: `${Math.min(tooltipPos.x + 14, width - 230)}px`,
                    top: `${Math.max(tooltipPos.y - 70, 10)}px`,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-900 font-mono">{hoveredRespondent.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Quadrant {hoveredRespondent.quadrant}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-0.5">
                    <div>
                      <span className="text-slate-400">Dim 1:</span>{' '}
                      <span className="font-mono font-semibold text-slate-800">
                        {hoveredRespondent.dim1 > 0 ? `+${hoveredRespondent.dim1}` : hoveredRespondent.dim1}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Dim 2:</span>{' '}
                      <span className="font-mono font-semibold text-slate-800">
                        {hoveredRespondent.dim2 > 0 ? `+${hoveredRespondent.dim2}` : hoveredRespondent.dim2}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Age:</span>{' '}
                      <span className="font-medium text-slate-800">{hoveredRespondent.age_group || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Gender:</span>{' '}
                      <span className="font-medium text-slate-800">{hoveredRespondent.gender || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Education:</span>{' '}
                      <span className="font-medium text-slate-800">{hoveredRespondent.education || 'N/A'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Ideology:</span>{' '}
                      <span className="font-medium text-slate-800">{hoveredRespondent.ideology || 'No Label'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Slider & Density Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span>Point Opacity:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={pointOpacity}
                    onChange={(e) => setPointOpacity(parseFloat(e.target.value))}
                    className="w-24 accent-blue-700"
                  />
                  <span className="font-mono">{Math.round(pointOpacity * 100)}%</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span>Point Size:</span>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.5"
                    value={pointSize}
                    onChange={(e) => setPointSize(parseFloat(e.target.value))}
                    className="w-20 accent-blue-700"
                  />
                  <span className="font-mono">{pointSize}px</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Rendering {filteredIndividuals.length} / {mcaIndividuals.length} sample points
              </div>
            </div>
          </div>
        </div>

        {/* Side Column: Quadrant Stats & Selected Respondent Profile */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Respondent Inspector */}
          {selectedRespondent ? (
            <div className="bg-white border-2 border-blue-500/80 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
                    ID
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-mono">{selectedRespondent.id}</h3>
                    <span className="text-[11px] text-slate-500">Individual Respondent Sample</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRespondent(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md hover:bg-slate-100"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3">
                  <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Quadrant Classification</div>
                  <div className="text-sm font-bold text-blue-950 mt-0.5">
                    Quadrant {selectedRespondent.quadrant}: {QUADRANT_DEFINITIONS[selectedRespondent.quadrant || 1].title}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {QUADRANT_DEFINITIONS[selectedRespondent.quadrant || 1].description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 block">Dimension 1 (X)</span>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedRespondent.dim1 > 0 ? `+${selectedRespondent.dim1}` : selectedRespondent.dim1}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                    <span className="text-[10px] text-slate-500 block">Dimension 2 (Y)</span>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedRespondent.dim2 > 0 ? `+${selectedRespondent.dim2}` : selectedRespondent.dim2}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Survey Demographics</div>
                  <div className="space-y-1.5 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age Cohort:</span>
                      <span className="font-semibold text-slate-900">{selectedRespondent.age_group || 'Unrecorded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Education Level:</span>
                      <span className="font-semibold text-slate-900">{selectedRespondent.education || 'Unrecorded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Gender:</span>
                      <span className="font-semibold text-slate-900">{selectedRespondent.gender || 'Unrecorded'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Left-Right Self Placement:</span>
                      <span className="font-semibold text-slate-900">{selectedRespondent.ideology || 'No Label'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Quadrant Sample Breakdown */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-700" />
                  Quadrant Sample Breakdown
                </h3>
                <span className="text-[11px] text-slate-400">Click to isolate</span>
              </div>

              <div className="space-y-2.5">
                {([1, 2, 3, 4] as const).map(qNum => {
                  const q = QUADRANT_DEFINITIONS[qNum];
                  const stat = quadrantStats[qNum];
                  const isFiltered = activeQuadrantFilter === qNum;

                  return (
                    <div
                      key={qNum}
                      onClick={() => setActiveQuadrantFilter(isFiltered ? null : qNum)}
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
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-blue-700">{stat.pct}%</span>
                          <span className="text-[10px] text-slate-400 ml-1 font-mono">({stat.count})</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full ${
                            qNum === 1 ? 'bg-blue-600' :
                            qNum === 2 ? 'bg-amber-500' :
                            qNum === 3 ? 'bg-red-600' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${stat.pct}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {q.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeQuadrantFilter && (
                <button
                  onClick={() => setActiveQuadrantFilter(null)}
                  className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Reset Quadrant Filter
                </button>
              )}
            </div>
          )}

          {/* Demographic Centroid Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-700" />
              Subgroup Barycenters ({colorBy.replace('_', ' ')})
            </h4>

            <div className="space-y-2 text-xs">
              {centroids.map(c => (
                <div key={c.group} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-semibold text-slate-800">{c.label}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 space-x-2">
                    <span>X: <strong>{c.x > 0 ? `+${c.x.toFixed(2)}` : c.x.toFixed(2)}</strong></span>
                    <span>Y: <strong>{c.y > 0 ? `+${c.y.toFixed(2)}` : c.y.toFixed(2)}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
              💡 <strong>Interpretation:</strong> A positive Dimension 1 centroid indicates progressive social values (gender equality, LGBTQ+ acceptance). A positive Dimension 2 centroid indicates anti-authoritarian stance (rejection of military and strongman rule).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

