import React, { useState } from 'react';
import { AIInsightRecord, DecisionStatus, Student } from '../types';
import { CheckCircle2, Edit3, XCircle, Clock, Download, Filter, Lightbulb, User } from 'lucide-react';

interface Props {
  insights: AIInsightRecord[];
  students: Student[];
  onUpdateDecision: (
    studentId: string,
    decision: 'Accept' | 'Modify' | 'Reject',
    comment?: string,
    modifiedActions?: string[]
  ) => void;
}

export const RecommendationsView: React.FC<Props> = ({
  insights,
  students,
  onUpdateDecision,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editActionText, setEditActionText] = useState('');
  const [rejectingStudentId, setRejectingStudentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = insights.filter((ins) => {
    if (filterStatus === 'All') return true;
    return ins.teacherDecision === filterStatus;
  });

  const total = insights.length;
  const accepted = insights.filter((i) => i.teacherDecision === 'Accept').length;
  const modified = insights.filter((i) => i.teacherDecision === 'Modify').length;
  const rejected = insights.filter((i) => i.teacherDecision === 'Reject').length;
  const pending = insights.filter((i) => i.teacherDecision === 'Pending' || !i.teacherDecision).length;

  const startEdit = (ins: AIInsightRecord) => {
    setEditingStudentId(ins.studentId);
    setEditActionText(ins.suggestedActions.join('\n'));
    setRejectingStudentId(null);
  };

  const saveEdit = (studentId: string) => {
    const actions = editActionText
      .split('\n')
      .map((s) => s.trim().replace(/^[•\-\*]\s*/, ''))
      .filter(Boolean);
    onUpdateDecision(studentId, 'Modify', 'Modified by teacher to match classroom context', actions);
    setEditingStudentId(null);
  };

  const confirmReject = (studentId: string) => {
    onUpdateDecision(studentId, 'Reject', rejectReason || 'Alternative pedagogical approach selected');
    setRejectingStudentId(null);
    setRejectReason('');
  };

  // Export intervention plan as CSV/Text
  const handleExportPlan = () => {
    const headers = 'Student_ID,Student_Name,Class,Priority,Learning_Need,Pedagogical_Actions,Teacher_Decision,Teacher_Comment\n';
    const rows = insights
      .map((i) =>
        `"${i.studentId}","${i.studentName}","${i.class}","${i.priority}","${i.detectedPattern.replace(/"/g, '""')}","${i.suggestedActions.join('; ').replace(/"/g, '""')}","${i.teacherDecision}","${(i.teacherComment || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pedagogical_Recommendations_Plan_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recommendation Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review, modify, and decide on pedagogical reading recommendations. <em>“AI recommends; teacher decides.”</em>
          </p>
        </div>

        <button
          onClick={handleExportPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#1677E8]" />
          <span>Export Intervention Plan (CSV)</span>
        </button>
      </div>

      {/* Decision Status Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setFilterStatus('All')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'All' ? 'bg-blue-50/80 border-[#1677E8] ring-1 ring-blue-400' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] text-slate-500 font-medium">Total Actions</span>
          <p className="text-xl font-bold text-slate-900">{total}</p>
        </div>

        <div
          onClick={() => setFilterStatus('Accept')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'Accept' ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
          <p className="text-xl font-bold text-emerald-800">{accepted}</p>
        </div>

        <div
          onClick={() => setFilterStatus('Modify')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'Modify' ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-400' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
            <Edit3 className="w-3.5 h-3.5" /> Modified
          </span>
          <p className="text-xl font-bold text-blue-800">{modified}</p>
        </div>

        <div
          onClick={() => setFilterStatus('Reject')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'Reject' ? 'bg-rose-50/80 border-rose-400 ring-1 ring-rose-400' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Declined
          </span>
          <p className="text-xl font-bold text-rose-800">{rejected}</p>
        </div>

        <div
          onClick={() => setFilterStatus('Pending')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'Pending' ? 'bg-amber-50/80 border-amber-400 ring-1 ring-amber-400' : 'bg-white border-slate-100'
          }`}
        >
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
          <p className="text-xl font-bold text-amber-800">{pending}</p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCurrentlyEditing = editingStudentId === item.studentId;
          const isCurrentlyRejecting = rejectingStudentId === item.studentId;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {item.studentName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.studentName}</h3>
                    <p className="text-[11px] text-slate-400">
                      {item.studentId} • Class {item.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.teacherDecision === 'Accept'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.teacherDecision === 'Modify'
                        ? 'bg-blue-100 text-blue-800'
                        : item.teacherDecision === 'Reject'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {item.teacherDecision || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Identified Learning Need */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Identified Learning Need:</span>
                <p className="text-xs text-slate-800 font-semibold mt-0.5">{item.detectedPattern}</p>
              </div>

              {/* AI Pedagogical Actions */}
              <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>Proposed Pedagogical Actions:</span>
                </div>

                {isCurrentlyEditing ? (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={editActionText}
                      onChange={(e) => setEditActionText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingStudentId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(item.studentId)}
                        className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Save Teacher Modification
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {item.suggestedActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Rejection Form */}
              {isCurrentlyRejecting && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200">
                  <p className="text-xs font-bold text-rose-900 mb-1">Reason for Declining:</p>
                  <input
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Current unit schedule focuses on narrative synthesis instead"
                    className="w-full text-xs p-2 bg-white rounded border border-rose-300 text-slate-700 mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setRejectingStudentId(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => confirmReject(item.studentId)}
                      className="px-4 py-1 text-xs font-bold bg-rose-600 text-white rounded hover:bg-rose-700"
                    >
                      Confirm Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Teacher Decision Comment if present */}
              {item.teacherComment && (
                <div className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  Teacher note: "{item.teacherComment}"
                </div>
              )}

              {/* Decision Buttons */}
              {!isCurrentlyEditing && !isCurrentlyRejecting && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onUpdateDecision(item.studentId, 'Accept')}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      item.teacherDecision === 'Accept'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1677E8] text-white hover:bg-blue-700'
                    }`}
                  >
                    {item.teacherDecision === 'Accept' ? 'Accepted ✓' : 'Accept'}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Modify
                  </button>
                  <button
                    onClick={() => {
                      setRejectingStudentId(item.studentId);
                      setEditingStudentId(null);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
