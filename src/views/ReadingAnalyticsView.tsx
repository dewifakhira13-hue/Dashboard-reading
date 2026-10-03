import React, { useState } from 'react';
import { Student, ReadingSessionRecord, TextType, TextLevel } from '../types';
import { READING_TEXTS } from '../data/initialData';
import { BookOpen, PlusCircle, Filter, ArrowUpRight, TrendingUp, Layers, HelpCircle } from 'lucide-react';

interface Props {
  students: Student[];
  sessions: ReadingSessionRecord[];
  onOpenAddSession: () => void;
  selectedClass: string;
}

export const ReadingAnalyticsView: React.FC<Props> = ({
  students,
  sessions,
  onOpenAddSession,
  selectedClass,
}) => {
  const [filterClass, setFilterClass] = useState<string>(selectedClass || 'All');
  const [filterSession, setFilterSession] = useState<string>('All');
  const [filterTextType, setFilterTextType] = useState<string>('All');
  const [filterTextLevel, setFilterTextLevel] = useState<string>('All');

  const uniqueClasses = Array.from(
    new Set([selectedClass, ...students.map((s) => s.class), ...sessions.map((s) => s.class)].filter(Boolean))
  );

  const filteredSessions = sessions.filter((s) => {
    const matchClass = filterClass === 'All' || s.class === filterClass;
    const matchSession = filterSession === 'All' || s.session === filterSession;
    const matchType = filterTextType === 'All' || s.textType === filterTextType;
    const matchLevel = filterTextLevel === 'All' || s.textLevel === filterTextLevel;
    return matchClass && matchSession && matchType && matchLevel;
  });

  const count = filteredSessions.length || 1;
  const avgOverall = Math.round(filteredSessions.reduce((a, b) => a + b.readingScore, 0) / count);
  const avgMainIdea = Math.round(filteredSessions.reduce((a, b) => a + b.mainIdeaScore, 0) / count);
  const avgSpecificInfo = Math.round(filteredSessions.reduce((a, b) => a + b.specificInformationScore, 0) / count);
  const avgInference = Math.round(filteredSessions.reduce((a, b) => a + b.inferenceScore, 0) / count);
  const avgVocab = Math.round(filteredSessions.reduce((a, b) => a + b.vocabularyScore, 0) / count);

  return (
    <div className="space-y-6">
      {/* Title & Add Session CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reading Skill Analytics</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Analyze comprehension domains: Main Idea, Specific Details, Contextual Inference, and Vocabulary.
          </p>
        </div>

        <button
          onClick={onOpenAddSession}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1677E8] text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Reading Session</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-2">
          <Filter className="w-4 h-4 text-slate-400" /> Filters:
        </span>

        <div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="All">All Classes</option>
            {uniqueClasses.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterSession}
            onChange={(e) => setFilterSession(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Sessions</option>
            <option value="Session 1">Session 1</option>
            <option value="Session 2">Session 2</option>
            <option value="Session 3">Session 3</option>
            <option value="Session 4">Session 4</option>
            <option value="Session 5">Session 5</option>
          </select>
        </div>

        <div>
          <select
            value={filterTextType}
            onChange={(e) => setFilterTextType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Text Types</option>
            <option value="Narrative">Narrative</option>
            <option value="Expository">Expository</option>
            <option value="Descriptive">Descriptive</option>
            <option value="Report">Report</option>
            <option value="Argumentative">Argumentative</option>
          </select>
        </div>

        <div>
          <select
            value={filterTextLevel}
            onChange={(e) => setFilterTextLevel(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Text Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="A2+">A2+</option>
            <option value="B1">B1</option>
            <option value="B1+">B1+</option>
            <option value="B2">B2</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 ml-auto font-medium">
          Aggregating {filteredSessions.length} records
        </span>
      </div>

      {/* 4 Skill Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Idea */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Main Idea</span>
            <span className="w-3 h-3 rounded-full bg-[#1677E8]"></span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#1677E8]">{avgMainIdea}%</span>
            <p className="text-[11px] text-slate-500 mt-1">Ability to extract central theme</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">Relative Strength (High)</span>
          </div>
        </div>

        {/* Specific Information */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Specific Information</span>
            <span className="w-3 h-3 rounded-full bg-[#20B486]"></span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#20B486]">{avgSpecificInfo}%</span>
            <p className="text-[11px] text-slate-500 mt-1">Retrieval of explicit factual details</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">Solid comprehension</span>
          </div>
        </div>

        {/* Inference */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Inference</span>
            <span className="w-3 h-3 rounded-full bg-[#F5A623]"></span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#F5A623]">{avgInference}%</span>
            <p className="text-[11px] text-slate-500 mt-1">Deducing implicit meaning</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-amber-600">Growth target (Scaffold needed)</span>
          </div>
        </div>

        {/* Vocabulary in Context */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Vocabulary in Context</span>
            <span className="w-3 h-3 rounded-full bg-[#7654E8]"></span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#7654E8]">{avgVocab}%</span>
            <p className="text-[11px] text-slate-500 mt-1">Lexical deduction from textual clues</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-purple-600">Primary pedagogical focus</span>
          </div>
        </div>
      </div>

      {/* Skill Gaps Breakdown & Pedagogical Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Comparative Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm mb-3">Class Reading Domain Gap Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Main Idea Identification</span>
                <span className="text-[#1677E8] font-bold">{avgMainIdea}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1677E8] rounded-full" style={{ width: `${avgMainIdea}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Specific Detail Retrieval</span>
                <span className="text-[#20B486] font-bold">{avgSpecificInfo}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#20B486] rounded-full" style={{ width: `${avgSpecificInfo}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Contextual Inference</span>
                <span className="text-[#F5A623] font-bold">{avgInference}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${avgInference}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Vocabulary in Context</span>
                <span className="text-[#7654E8] font-bold">{avgVocab}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#7654E8] rounded-full" style={{ width: `${avgVocab}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pedagogical Implications for Junior High Teachers */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-2">Pedagogical Implications for Teachers</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              The comparative indicator data across junior high reading sessions answer the core pedagogical question:
            </p>
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 font-medium mb-3">
              "Students show consistent strength in identifying literal main ideas ({avgMainIdea}%) and explicit factual statements ({avgSpecificInfo}%), whereas unfamiliar contextual vocabulary ({avgVocab}%) and text-based deduction ({avgInference}%) create the primary cognitive barriers."
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Deploy targeted pre-reading vocabulary anchors before introducing B1 expository texts.</li>
              <li>Provide two-step inference scaffolding questions to bridge literal to deductive comprehension.</li>
              <li>Integrate low-stakes collaborative reading circles to decrease reading anxiety.</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Based on Krashen's Comprehensible Input (i+1) & Cognitive Load Framework
          </div>
        </div>
      </div>
    </div>
  );
};
