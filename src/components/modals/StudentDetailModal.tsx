import React from 'react';
import { Student, ReadingSessionRecord, AIInsightRecord } from '../../types';
import { X, User, BookOpen, Brain, Sparkles, TrendingUp, Heart, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  sessions: ReadingSessionRecord[];
  insight?: AIInsightRecord;
  onSelectAndAnalyze?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  sessions,
  insight,
  onSelectAndAnalyze,
}) => {
  if (!isOpen || !student) return null;

  const studentSessions = sessions
    .filter((s) => s.studentId === student.id)
    .sort((a, b) => a.session.localeCompare(b.session));

  const latestSession = studentSessions[studentSessions.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#082B5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {student.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{student.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 font-medium">
                  {student.id}
                </span>
              </div>
              <p className="text-xs text-blue-200">
                {student.school} • Class {student.class} • {student.grade}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top KPI Snapshot */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold text-blue-700">Reading Score</span>
              <span className="text-2xl font-black text-blue-900 my-0.5">{student.readingScore}</span>
              <span className="text-[10px] text-blue-600 font-medium">Performance: {student.level}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold text-emerald-700">Task Completion</span>
              <span className="text-2xl font-black text-emerald-900 my-0.5">
                {latestSession?.taskCompletionPercent ?? 85}%
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">Completed on time</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold text-purple-700">Confidence</span>
              <span className="text-2xl font-black text-purple-900 my-0.5">{student.confidence} / 5</span>
              <span className="text-[10px] text-purple-600 font-medium">Self-perception</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold text-amber-700">Reading Anxiety</span>
              <span className="text-2xl font-black text-amber-900 my-0.5">{student.anxiety} / 5</span>
              <span className="text-[10px] text-amber-600 font-medium">
                {student.anxiety >= 3.5 ? 'Requires scaffolding' : 'Manageable'}
              </span>
            </div>
          </div>

          {/* Reading Skill Breakdown */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1677E8]" />
              Four Reading Comprehension Domains
            </h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Main Idea</span>
                  <span className="text-blue-600">{student.mainIdea}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1677E8] rounded-full" style={{ width: `${student.mainIdea}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Specific Information</span>
                  <span className="text-emerald-600">{student.specificInfo}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#20B486] rounded-full" style={{ width: `${student.specificInfo}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Inference</span>
                  <span className="text-amber-600">{student.inference}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${student.inference}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Vocabulary in Context</span>
                  <span className="text-purple-600">{student.vocabulary}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7654E8] rounded-full" style={{ width: `${student.vocabulary}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Progression Table */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#1677E8]" />
              Session-by-Session Performance History
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/70 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">Session</th>
                    <th className="p-2.5">Reading Text</th>
                    <th className="p-2.5 text-center">Score</th>
                    <th className="p-2.5 text-center">Completion</th>
                    <th className="p-2.5 text-center">Eng.</th>
                    <th className="p-2.5 text-center">Conf.</th>
                    <th className="p-2.5 text-center">Anxiety</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentSessions.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-700">{rec.session}</td>
                      <td className="p-2.5 text-slate-600">
                        {rec.readingTextTitle} <span className="text-[10px] text-slate-400">({rec.textLevel})</span>
                      </td>
                      <td className="p-2.5 text-center font-bold text-blue-600">{rec.readingScore}</td>
                      <td className="p-2.5 text-center text-slate-700">{rec.taskCompletionPercent}%</td>
                      <td className="p-2.5 text-center text-slate-700">{rec.engagement}</td>
                      <td className="p-2.5 text-center text-slate-700">{rec.confidence}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            rec.readingAnxiety <= 2.2
                              ? 'bg-emerald-50 text-emerald-700'
                              : rec.readingAnxiety <= 3.2
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700 font-semibold'
                          }`}
                        >
                          {rec.readingAnxiety}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Pedagogical Insight Card */}
          {insight && (
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-[#1677E8]" />
                <h4 className="font-bold text-slate-800 text-xs">AI Pedagogical Analysis</h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                  Priority: {insight.priority}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">{insight.aiInsight}</p>

              <h5 className="text-[11px] font-bold text-slate-700 mb-1">Suggested Interventions:</h5>
              <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                {insight.suggestedActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>

              {insight.teacherDecision !== 'Pending' && (
                <div className="mt-3 pt-2 border-t border-blue-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Teacher Decision: <strong className="text-emerald-700">{insight.teacherDecision}ed</strong>
                  </span>
                  {insight.teacherComment && (
                    <span className="italic text-slate-500">"{insight.teacherComment}"</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Teacher: {student.teacherName}</span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
