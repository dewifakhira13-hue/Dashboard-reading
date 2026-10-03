import React, { useState } from 'react';
import { Student } from '../types';
import {
  Search,
  UserPlus,
  Filter,
  Users,
  Award,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';

interface Props {
  students: Student[];
  onOpenAddStudent: () => void;
  onViewStudentDetail: (student: Student) => void;
  selectedClass?: string;
  onToggleActive?: (studentId: string) => void;
  initialDateFilter?: string;
}

export const StudentsView: React.FC<Props> = ({
  students,
  onOpenAddStudent,
  onViewStudentDetail,
  selectedClass = 'All',
  onToggleActive,
  initialDateFilter = 'All',
}) => {
  // Master Schema Filters: Student_ID, Date, Student_Name, School, Class, Grade, Teacher_Name, Active
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>(initialDateFilter);
  const [customDate, setCustomDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [schoolFilter, setSchoolFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>(selectedClass !== 'All' ? selectedClass : 'All');
  const [gradeFilter, setGradeFilter] = useState<string>('All');
  const [teacherFilter, setTeacherFilter] = useState<string>('All');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  const [sortBy, setSortBy] = useState<'date' | 'id' | 'name' | 'score'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Extract unique filter options from dataset
  const uniqueDates = Array.from(new Set(students.map((s) => s.date).filter(Boolean))).sort().reverse();
  const uniqueSchools = Array.from(new Set(students.map((s) => s.school).filter(Boolean))).sort();
  const uniqueClasses = Array.from(new Set(students.map((s) => s.class).filter(Boolean))).sort();
  const uniqueGrades = Array.from(new Set(students.map((s) => s.grade).filter(Boolean))).sort();
  const uniqueTeachers = Array.from(new Set(students.map((s) => s.teacherName).filter(Boolean))).sort();

  // Filter logic across all 8 master fields + performance level
  const filtered = students
    .filter((s) => {
      // 1. Student_ID and Student_Name search
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        s.school.toLowerCase().includes(term) ||
        s.teacherName.toLowerCase().includes(term);

      // 2. Date filter (Exact, Range, or Custom)
      let matchDate = true;
      if (startDate || endDate) {
        if (startDate && s.date < startDate) matchDate = false;
        if (endDate && s.date > endDate) matchDate = false;
      } else if (dateFilter === 'Custom' && customDate) {
        matchDate = s.date === customDate;
      } else if (dateFilter !== 'All') {
        matchDate = s.date === dateFilter;
      }

      // 3. School filter
      const matchSchool = schoolFilter === 'All' || s.school === schoolFilter;

      // 4. Class filter
      const matchClass = classFilter === 'All' || s.class === classFilter;

      // 5. Grade filter
      const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter;

      // 6. Teacher_Name filter
      const matchTeacher = teacherFilter === 'All' || s.teacherName === teacherFilter;

      // 7. Active filter (Yes / No)
      let matchActive = true;
      if (activeFilter === 'Active') matchActive = s.active === true;
      if (activeFilter === 'Inactive') matchActive = s.active === false;

      // 8. Performance Level filter
      const matchLevel = levelFilter === 'All' || s.level === levelFilter;

      return (
        matchSearch &&
        matchDate &&
        matchSchool &&
        matchClass &&
        matchGrade &&
        matchTeacher &&
        matchActive &&
        matchLevel
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') comparison = (a.date || '').localeCompare(b.date || '');
      else if (sortBy === 'id') comparison = a.id.localeCompare(b.id);
      else if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortBy === 'score') comparison = a.readingScore - b.readingScore;

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Calculate quick stats
  const totalCount = students.length;
  const activeCount = students.filter((s) => s.active).length;
  const inactiveCount = students.filter((s) => !s.active).length;
  const excellentCount = students.filter((s) => s.level === 'Excellent').length;
  const goodCount = students.filter((s) => s.level === 'Good').length;
  const needsSupportCount = students.filter((s) => s.level === 'Needs Support').length;

  // Active filters count
  const activeFilterCount = [
    searchTerm !== '',
    dateFilter !== 'All' || customDate !== '' || startDate !== '' || endDate !== '',
    schoolFilter !== 'All',
    classFilter !== 'All',
    gradeFilter !== 'All',
    teacherFilter !== 'All',
    activeFilter !== 'All',
    levelFilter !== 'All',
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSearchTerm('');
    setDateFilter('All');
    setCustomDate('');
    setStartDate('');
    setEndDate('');
    setSchoolFilter('All');
    setClassFilter('All');
    setGradeFilter('All');
    setTeacherFilter('All');
    setActiveFilter('All');
    setLevelFilter('All');
  };

  // Export CSV matching exact schema
  const handleExportCSV = () => {
    const headers = [
      'Student_ID',
      'Date',
      'Student_Name',
      'School',
      'Class',
      'Grade',
      'Teacher_Name',
      'Active',
      'Reading_Score',
      'Main_Idea',
      'Specific_Info',
      'Inference',
      'Vocabulary',
      'Level',
    ];

    const rows = filtered.map((s) => [
      `"${s.id}"`,
      `"${s.date || ''}"`,
      `"${s.name}"`,
      `"${s.school}"`,
      `"${s.class}"`,
      `"${s.grade}"`,
      `"${s.teacherName}"`,
      s.active ? 'Yes' : 'No',
      s.readingScore,
      s.mainIdea,
      s.specificInfo,
      s.inference,
      s.vocabulary,
      `"${s.level}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Teacher_Student_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Students Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#1677E8] border border-blue-100">
              {filtered.length} of {totalCount} Students
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Student master record • <span className="text-slate-700 font-mono text-[11px]">Student_ID | Date | Student_Name | School | Class | Grade | Teacher_Name | Active</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddStudent}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1677E8] text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* 2. Four Neat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Registered</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              <span className="text-emerald-600 font-bold">{activeCount} Active</span> • {inactiveCount} Inactive
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677E8] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Excellent */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Excellent (85–100)</span>
            <p className="text-2xl font-extrabold text-[#1E9B73] mt-1">{excellentCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {Math.round((excellentCount / (totalCount || 1)) * 100)}% of class
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1E9B73] flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Good */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Good (70–84)</span>
            <p className="text-2xl font-extrabold text-[#1677E8] mt-1">{goodCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              {Math.round((goodCount / (totalCount || 1)) * 100)}% of class
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1677E8] flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Needs Support */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Needs Support (&lt;55)</span>
            <p className="text-2xl font-extrabold text-[#E03158] mt-1">{needsSupportCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Require targeted reading aid</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E03158] flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Streamlined Clean Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Main Toolbar Row */}
        <div className="p-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or ID..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Selectors Group */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#1677E8]" />
              <span className="text-slate-400">Date:</span>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Dates</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
              {dateFilter === 'Custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-white border border-blue-300 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none ml-1"
                />
              )}
            </div>

            {/* Class Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700">
              <span className="text-slate-400">Class:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status Segmented */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveFilter('All')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'All' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('Active')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeFilter === 'Active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active
              </button>
              <button
                onClick={() => setActiveFilter('Inactive')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'Inactive' ? 'bg-slate-700 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Inactive
              </button>
            </div>

            {/* Toggle More Filters Drawer */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'bg-blue-50 text-[#1677E8] border-blue-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#1677E8] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={`w-3 h-3 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-0.5 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-white text-[#1677E8] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-white text-[#1677E8] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible More Filters (School, Grade, Teacher, Level, Date Range) */}
        {showAdvancedFilters && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">School</label>
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Schools</option>
                {uniqueSchools.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Grade</label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Grades</option>
                {uniqueGrades.map((grd) => (
                  <option key={grd} value={grd}>
                    {grd}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Teacher</label>
              <select
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Teachers</option>
                {uniqueTeachers.map((tch) => (
                  <option key={tch} value={tch}>
                    {tch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Performance Level</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Levels</option>
                <option value="Excellent">Excellent (85–100)</option>
                <option value="Good">Good (70–84)</option>
                <option value="Fair">Fair (55–69)</option>
                <option value="Needs Support">Needs Support (&lt;55)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="id">Student ID</option>
                <option value="name">Name</option>
                <option value="score">Score</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetAllFilters}
                className="w-full py-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Main Data Presentation (Table View) */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/90 text-[11px] font-extrabold text-slate-600 uppercase border-b border-slate-200 tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">No.</th>
                  <th className="py-3 px-3.5">Student ID</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Student Name</th>
                  <th className="py-3 px-3">School</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3.5">Teacher</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-center">Active</th>
                  <th className="py-3 px-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <div className="max-w-sm mx-auto text-center space-y-2">
                        <Filter className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-700">No students found matching your criteria</p>
                        <p className="text-xs text-slate-400">Try changing your search keyword or resetting filters.</p>
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1677E8] font-bold text-xs hover:bg-blue-100"
                        >
                          Reset all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5 font-medium text-slate-400 text-center">{idx + 1}</td>
                      <td className="py-3 px-3.5 font-mono font-bold text-[#1677E8]">{s.id}</td>
                      <td className="py-3 px-3.5">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {s.date || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">{s.name}</td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">{s.school}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {s.class}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">{s.grade}</td>
                      <td className="py-3 px-3.5 text-slate-700 font-medium whitespace-nowrap">{s.teacherName}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-extrabold text-xs px-2 py-0.5 rounded ${
                            s.readingScore >= 85
                              ? 'bg-emerald-50 text-emerald-700'
                              : s.readingScore >= 70
                              ? 'bg-blue-50 text-[#1677E8]'
                              : s.readingScore >= 55
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {s.readingScore}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {onToggleActive ? (
                          <button
                            onClick={() => onToggleActive(s.id)}
                            title="Click to toggle Active / Inactive"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              s.active
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span>{s.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              s.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => onViewStudentDetail(s)}
                          className="px-3 py-1 text-xs font-bold text-[#1677E8] bg-blue-50 hover:bg-[#1677E8] hover:text-white rounded-lg transition-all shadow-2xs cursor-pointer"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#082B5F] to-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                      {student.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{student.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        <span className="font-mono font-bold text-[#1677E8]">{student.id}</span> • {student.class}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      student.level === 'Excellent'
                        ? 'bg-[#E8F8F3] text-[#1E9B73]'
                        : student.level === 'Good'
                        ? 'bg-[#EBF3FF] text-[#1677E8]'
                        : student.level === 'Fair'
                        ? 'bg-[#FFF7E8] text-[#D98200]'
                        : 'bg-[#FDEEF1] text-[#E03158]'
                    }`}
                  >
                    {student.level}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date</span>
                    <strong className="text-slate-700 font-mono">{student.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">School</span>
                    <strong className="text-slate-700 truncate block">{student.school}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Teacher</span>
                    <strong className="text-slate-700 truncate block">{student.teacherName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status</span>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        student.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {student.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Reading Score</span>
                    <span className="font-extrabold text-[#1677E8]">{student.readingScore} / 100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1677E8]" style={{ width: `${student.readingScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{student.grade}</span>
                <button
                  onClick={() => onViewStudentDetail(student)}
                  className="flex items-center gap-1 text-xs font-bold text-[#1677E8] hover:text-blue-800 transition-colors cursor-pointer"
                >
                  <span>Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
