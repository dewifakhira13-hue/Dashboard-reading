import React, { useState } from 'react';
import { Student, AIInsightRecord, PriorityLevel } from '../types';
import { Sparkles, Brain, Filter, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Lightbulb } from 'lucide-react';

interface Props {
  students: Student[];
  insights: AIInsightRecord[];
  onSelectStudent: (student: Student) => void;
  onNavigateToTab: (tab: string) => void;
  onRefreshAllInsights: () => Promise<void>;
  isLoadingAI: boolean;
}

export const AIInsightsView: React.FC<Props> = ({
  students,
  insights,
  onSelectStudent,
  onNavigateToTab,
  onRefreshAllInsights,
  isLoadingAI,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = insights.filter((ins) => {
    const matchPriority = priorityFilter === 'All' || ins.priority === priorityFilter;
    const matchSearch =
      ins.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.detectedPattern.toLowerCase().includes(searchTerm.toLowerCase());
    return matchPriority && matchSearch;
  });

  const highPriorityCount = insights.filter((i) => i.priority === 'High').length;
  const mediumPriorityCount = insights.filter((i) => i.priority === 'Medium').length;
  const lowPriorityCount = insights.filter((i) => i.priority === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Title & Batch Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-50 text-[#1677E8]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Learning Insights</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Transforming student comprehension and affective indicators into cautious, evidence-grounded pedagogical patterns.
          </p>
        </div>

        <button
          onClick={onRefreshAllInsights}
          disabled={isLoadingAI}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677E8] text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
          <span>{isLoadingAI ? 'Generating AI Analysis...' : 'Re-run Gemini AI Analysis'}</span>
        </button>
      </div>

      {/* Guidelines Banner */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
        <Brain className="w-5 h-5 text-[#1677E8] shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 leading-relaxed">
          <strong className="font-bold">Pedagogical AI Principle:</strong> The AI interprets patterns and proposes pedagogical actions; the teacher remains the final decision maker. Insights use cautious language ("data suggest", "may indicate", "is associated with") and do not diagnose students or assign clinical claims.
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setPriorityFilter(priorityFilter === 'High' ? 'All' : 'High')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            priorityFilter === 'High'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-slate-100 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">High Priority Patterns</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
              {highPriorityCount} students
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Consistent patterns of elevated reading anxiety or pronounced vocabulary/inference gaps requiring teacher scaffolding.
          </p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Medium' ? 'All' : 'Medium')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            priorityFilter === 'Medium'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-100 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">Medium Priority Patterns</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
              {mediumPriorityCount} students
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Developing readers showing steady literal comprehension with opportunities for vocabulary enrichment.
          </p>
        </div>

        <div
          onClick={() => setPriorityFilter(priorityFilter === 'Low' ? 'All' : 'Low')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            priorityFilter === 'Low'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-100 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700">Low Priority Patterns</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
              {lowPriorityCount} students
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            High-performing students with low reading anxiety ready for extension and authentic challenge.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by student name, ID, or detected pattern..."
          className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Filter by Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-slate-400 text-xs">
            No AI insights found matching the selected filters.
          </div>
        ) : (
          filtered.map((item) => {
            const studentObj = students.find((s) => s.id === item.studentId);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      {item.studentName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{item.studentName}</h3>
                      <p className="text-[11px] text-slate-400">
                        {item.studentId} • Class {item.class} • {item.session}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : item.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.priority} Priority
                    </span>

                    <button
                      onClick={() => {
                        if (studentObj) onSelectStudent(studentObj);
                        onNavigateToTab('Dashboard');
                      }}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#1677E8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Review on Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Pattern & Evidence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Detected Pattern
                    </span>
                    <p className="font-bold text-slate-800">{item.detectedPattern}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Observed Evidence
                    </span>
                    <p className="text-slate-700 font-mono text-[11px]">{item.evidence}</p>
                  </div>
                </div>

                {/* AI Interpretation */}
                <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                    <Brain className="w-3.5 h-3.5 text-[#1677E8]" />
                    <span>AI Pedagogical Interpretation:</span>
                  </div>
                  {item.aiInsight}
                </div>

                {/* Suggested Actions */}
                <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Suggested Pedagogical Actions:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {item.suggestedActions.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
