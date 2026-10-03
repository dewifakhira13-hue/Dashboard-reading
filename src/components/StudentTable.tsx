import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { Search, Filter, Eye, Calendar, RotateCcw } from 'lucide-react';

interface Props {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (student: Student) => void;
  onViewStudentDetail: (student: Student) => void;
  externalDateFilter?: string;
  onDateFilterChange?: (date: string) => void;
}

export const StudentTable: React.FC<Props> = ({
  students,
  selectedStudentId,
  onSelectStudent,
  onViewStudentDetail,
  externalDateFilter,
  onDateFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>(externalDateFilter || 'All');
  const [customDate, setCustomDate] = useState<string>('');

  // Sync with externalDateFilter if passed
  useEffect(() => {
    if (externalDateFilter !== undefined) {
      setDateFilter(externalDateFilter);
    }
  }, [externalDateFilter]);

  // Extract unique available dates from student records sorted descending
  const uniqueDates = Array.from(new Set(students.map((s) => s.date).filter(Boolean))).sort().reverse();

  const handleDateChange = (val: string) => {
    setDateFilter(val);
    if (onDateFilterChange) onDateFilterChange(val);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || s.level === levelFilter;

    let matchesDate = true;
    if (dateFilter === 'Custom' && customDate) {
      matchesDate = s.date === customDate;
    } else if (dateFilter !== 'All') {
      matchesDate = s.date === dateFilter;
    }

    return matchesSearch && matchesLevel && matchesDate;
  });

  const getScoreBadgeClass = (score: number) => {
    if (score >= 85) return 'bg-[#E8F8F3] text-[#1E9B73] font-bold';
    if (score >= 70) return 'bg-[#EBF3FF] text-[#1677E8] font-bold';
    if (score >= 55) return 'bg-[#FFF7E8] text-[#D98200] font-bold';
    return 'bg-[#FDEEF1] text-[#E03158] font-bold';
  };

  const getAnxietyBadgeClass = (anx: number) => {
    if (anx <= 2.2) return 'bg-[#E8F8F3] text-[#1E9B73] font-semibold';
    if (anx <= 3.2) return 'bg-[#FEF6EB] text-[#C97A00] font-semibold';
    return 'bg-[#FDEEF1] text-[#D9385C] font-bold';
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Excellent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8F3] text-[#1E9B73]">Excellent</span>;
      case 'Good':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3FF] text-[#1677E8]">Good</span>;
      case 'Fair':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF7E8] text-[#D98200]">Fair</span>;
      case 'Needs Support':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FDEEF1] text-[#E03158]">Needs Support</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">{level}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden flex flex-col">
      {/* Header & Quick Filter */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1677E8] flex items-center justify-center font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-800 text-sm">Student Performance</h3>
              {dateFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1677E8] border border-blue-200">
                  <Calendar className="w-3 h-3" />
                  {dateFilter}
                  <button onClick={() => handleDateChange('All')} className="hover:text-blue-900 ml-0.5">✕</button>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or ID..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-36 sm:w-48 transition-all font-medium"
            />
          </div>

          {/* Level Filter dropdown */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filter by performance level"
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Needs Support">Needs Support</option>
          </select>

          {(levelFilter !== 'All' || searchTerm !== '') && (
            <button
              onClick={() => {
                setLevelFilter('All');
                setSearchTerm('');
              }}
              title="Reset Table Search"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">
              <th className="py-2.5 px-3">No.</th>
              <th className="py-2.5 px-3">Student ID</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-2">Class</th>
              <th className="py-2.5 px-3 text-center">Reading Score</th>
              <th className="py-2.5 px-2 text-center">Main Idea</th>
              <th className="py-2.5 px-2 text-center">Specific Info</th>
              <th className="py-2.5 px-2 text-center">Inference</th>
              <th className="py-2.5 px-2 text-center">Vocabulary</th>
              <th className="py-2.5 px-2 text-center">Engagement</th>
              <th className="py-2.5 px-2 text-center">Confidence</th>
              <th className="py-2.5 px-2 text-center">Anxiety</th>
              <th className="py-2.5 px-2 text-center">Active</th>
              <th className="py-2.5 px-3 text-center">Level</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={16} className="py-8 text-center text-slate-400">
                  No students found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => {
                const isSelected = s.id === selectedStudentId;
                return (
                  <tr
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-[#1677E8]'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1677E8]">{s.id}</td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateChange(s.date);
                        }}
                        title="Click to filter by this Date"
                        className="font-mono text-[11px] text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap"
                      >
                        {s.date}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">{s.name}</td>
                    <td className="py-2.5 px-2 text-slate-500 font-semibold">{s.class}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block w-9 py-0.5 rounded-sm ${getScoreBadgeClass(s.readingScore)}`}>
                        {s.readingScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.mainIdea}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.specificInfo}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.inference}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.vocabulary}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.engagement}</td>
                    <td className="py-2.5 px-2 text-center text-slate-700 font-medium">{s.confidence}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${getAnxietyBadgeClass(s.anxiety)}`}>
                        {s.anxiety}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          s.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {s.active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">{getLevelBadge(s.level)}</td>
                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewStudentDetail(s)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#1677E8] bg-blue-50 hover:bg-[#1677E8] hover:text-white rounded-md transition-all shadow-2xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
