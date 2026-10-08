import React, { useState, useMemo } from 'react';
import { mcaCategories, mcaSupplementary, DOMAIN_COLORS } from '../data/mcaData';
import { MCACategory, SupplementaryCategory } from '../types/mca';
import { Download, Search, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface DataTableProps {
  onSelectItem: (item: MCACategory | SupplementaryCategory) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ onSelectItem }) => {
  const [activeDataset, setActiveDataset] = useState<'categories' | 'supplementary'>('categories');
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('contrib_total');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Handle sort toggle
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // Filtered & Sorted Categories
  const processedCategories = useMemo(() => {
    return mcaCategories
      .filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.wvsQuestionCode.toLowerCase().includes(q)
        );
      })
      .sort((a: any, b: any) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [search, sortField, sortDir]);

  // Filtered & Sorted Supplementary
  const processedSupplementary = useMemo(() => {
    return mcaSupplementary
      .filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          s.id.toLowerCase().includes(q) ||
          s.group.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      })
      .sort((a: any, b: any) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [search, sortField, sortDir]);

  // CSV Export
  const handleDownloadCsv = () => {
    let csvContent = '';
    if (activeDataset === 'categories') {
      const headers = ['ID', 'Domain', 'WVS_Question', 'Dim1_Coord', 'Dim2_Coord', 'Contrib_Dim1', 'Contrib_Dim2', 'Contrib_Total', 'Cos2_Dim1', 'Cos2_Dim2', 'Cos2_Total', 'Quadrant', 'Description'];
      const rows = mcaCategories.map(c => [
        `"${c.id}"`,
        `"${c.domain}"`,
        `"${c.wvsQuestionCode}"`,
        c.dim1,
        c.dim2,
        c.contrib_dim1,
        c.contrib_dim2,
        c.contrib_total,
        c.cos2_dim1,
        c.cos2_dim2,
        c.cos2_total,
        c.quadrant,
        `"${c.description.replace(/"/g, '""')}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      const headers = ['ID', 'Group', 'Dim1_Coord', 'Dim2_Coord', 'VTest_Dim1', 'VTest_Dim2', 'IsSig_Dim1', 'IsSig_Dim2', 'Quadrant', 'Description'];
      const rows = mcaSupplementary.map(s => [
        `"${s.id}"`,
        `"${s.group}"`,
        s.dim1,
        s.dim2,
        s.vtest_dim1,
        s.vtest_dim2,
        s.isSignificantDim1,
        s.isSignificantDim2,
        s.quadrant,
        `"${s.description.replace(/"/g, '""')}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thai_mca_${activeDataset}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-2">
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => {
                setActiveDataset('categories');
                setSortField('contrib_total');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeDataset === 'categories'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active Survey Attitudes ({mcaCategories.length})
            </button>
            <button
              onClick={() => {
                setActiveDataset('supplementary');
                setSortField('vtest_dim1');
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeDataset === 'supplementary'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Supplementary Demographics ({mcaSupplementary.length})
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60 w-52"
            />
          </div>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium flex items-center gap-1.5"
            title="Download table data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {activeDataset === 'categories' ? (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
                <tr>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('domain')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Domain</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-2 text-center">Item</th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('dim1')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Dim 1</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('dim2')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Dim 2</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('contrib_dim1')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Contrib D1</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('contrib_dim2')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Contrib D2</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('contrib_total')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Total Contrib</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('cos2_total')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Cos²</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">Quad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {processedCategories.map(cat => {
                  const config = DOMAIN_COLORS[cat.domain];
                  return (
                    <tr
                      key={cat.id}
                      onClick={() => onSelectItem(cat)}
                      className="hover:bg-slate-800/60 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-sans font-bold text-slate-100">
                        {cat.id}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.badgeBg} ${config.badgeBorder} ${config.text}`}>
                          {cat.domain}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-400 font-sans text-[11px]">
                        {cat.wvsQuestionCode}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {cat.dim1 > 0 ? `+${cat.dim1.toFixed(3)}` : cat.dim1.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {cat.dim2 > 0 ? `+${cat.dim2.toFixed(3)}` : cat.dim2.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {cat.contrib_dim1.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {cat.contrib_dim2.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-400">
                        {cat.contrib_total.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center text-amber-400">
                        {cat.cos2_total.toFixed(3)}
                      </td>
                      <td className="py-3 px-3 text-center font-sans font-semibold text-slate-400">
                        Q{cat.quadrant}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 select-none">
                <tr>
                  <th 
                    className="py-3 px-4 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Demographic Category</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('group')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Group</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('dim1')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Dim 1</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('dim2')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Dim 2</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('vtest_dim1')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>V-Test (Dim 1)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-3 text-center cursor-pointer hover:text-slate-200"
                    onClick={() => handleSort('vtest_dim2')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>V-Test (Dim 2)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">Quad</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-mono">
                {processedSupplementary.map(sup => (
                  <tr
                    key={sup.id}
                    onClick={() => onSelectItem(sup)}
                    className="hover:bg-slate-800/60 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-sans font-bold text-slate-100">
                      {sup.id}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {sup.group}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">
                      {sup.dim1 > 0 ? `+${sup.dim1.toFixed(3)}` : sup.dim1.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">
                      {sup.dim2 > 0 ? `+${sup.dim2.toFixed(3)}` : sup.dim2.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={sup.isSignificantDim1 ? 'text-emerald-400' : 'text-slate-500'}>
                        {sup.vtest_dim1 > 0 ? `+${sup.vtest_dim1}` : sup.vtest_dim1}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={sup.isSignificantDim2 ? 'text-emerald-400' : 'text-slate-500'}>
                        {sup.vtest_dim2 > 0 ? `+${sup.vtest_dim2}` : sup.vtest_dim2}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-sans font-semibold text-slate-400">
                      Q{sup.quadrant}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-400 text-[11px]">
                      {sup.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
