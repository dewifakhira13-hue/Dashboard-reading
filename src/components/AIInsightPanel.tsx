import React, { useState } from 'react';
import { Student, AIInsightRecord, ActivityItem } from '../types';
import { Sparkles, Brain, Lightbulb, CheckCircle2, Edit3, XCircle, RefreshCw, Clock } from 'lucide-react';

interface Props {
  selectedStudent: Student;
  insight: AIInsightRecord | undefined;
  activities: ActivityItem[];
  onUpdateDecision: (studentId: string, decision: 'Accept' | 'Modify' | 'Reject', comment?: string, modifiedActions?: string[]) => void;
  onRefreshGeminiInsight: (student: Student) => Promise<void>;
  isLoadingAI: boolean;
  onNavigateToTab: (tab: string) => void;
}

export const AIInsightPanel: React.FC<Props> = ({
  selectedStudent,
  insight,
  activities,
  onUpdateDecision,
  onRefreshGeminiInsight,
  isLoadingAI,
  onNavigateToTab,
}) => {
  const [isModifying, setIsModifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [modifiedText, setModifiedText] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Fallback insight text if not yet in records
  const currentInsight = insight || {
    id: `INS-${selectedStudent.id}`,
    studentId: selectedStudent.id,
    studentName: selectedStudent.name,
    class: selectedStudent.class,
    session: 'Session 5',
    priority: selectedStudent.readingScore < 60 ? 'High' : 'Medium',
    detectedPattern: 'Contextual reading assessment',
    evidence: `Reading: ${selectedStudent.readingScore}, Main Idea: ${selectedStudent.mainIdea}%, Vocab: ${selectedStudent.vocabulary}%`,
    aiInsight: `${selectedStudent.name} demonstrates ${selectedStudent.readingScore >= 80 ? 'strong' : 'developing'} performance in literal comprehension (Main Idea: ${selectedStudent.mainIdea}%, Specific Info: ${selectedStudent.specificInfo}%). The data suggest that vocabulary in context (${selectedStudent.vocabulary}%) represents a valuable target for scaffolding. Affective indicators (Confidence: ${selectedStudent.confidence}/5, Anxiety: ${selectedStudent.anxiety}/5) indicate an encouraging baseline for progress.`,
    suggestedActions: [
      'Provide more reading texts with contextual vocabulary glossaries.',
      'Use scaffolded vocabulary-in-context graphic organizers.',
      'Keep using challenging but manageable reading passages.',
    ],
    teacherDecision: 'Pending',
    teacherComment: '',
  };

  const handleStartModify = () => {
    setModifiedText(currentInsight.suggestedActions.join('\n'));
    setIsModifying(true);
    setIsRejecting(false);
  };

  const handleSaveModify = () => {
    const actions = modifiedText
      .split('\n')
      .map((s) => s.trim().replace(/^[•\-\*]\s*/, ''))
      .filter(Boolean);
    onUpdateDecision(selectedStudent.id, 'Modify', 'Modified by teacher for class context', actions);
    setIsModifying(false);
  };

  const handleConfirmReject = () => {
    onUpdateDecision(selectedStudent.id, 'Reject', rejectReason || 'Alternative pedagogical approach preferred');
    setIsRejecting(false);
    setRejectReason('');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main AI Insights & Recommendations Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#1677E8]">
              <Sparkles className="w-4 h-4 text-[#1677E8]" />
            </span>
            <h3 className="font-bold text-slate-800 text-sm">AI Insights & Recommendations</h3>
          </div>
          <button
            onClick={() => onNavigateToTab('AI Insights')}
            className="text-xs font-semibold text-[#1677E8] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Selected Student Banner */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {selectedStudent.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">({selectedStudent.id})</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              selectedStudent.level === 'Excellent'
                ? 'bg-[#E8F8F3] text-[#1E9B73]'
                : selectedStudent.level === 'Good'
                ? 'bg-[#EBF3FF] text-[#1677E8]'
                : selectedStudent.level === 'Fair'
                ? 'bg-[#FFF7E8] text-[#D98200]'
                : 'bg-[#FDEEF1] text-[#E03158]'
            }`}
          >
            {selectedStudent.level}
          </span>
        </div>

        {/* AI Insight Text Block */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Brain className="w-4 h-4 text-[#1677E8]" />
              <span>AI Insight</span>
            </div>
            <button
              onClick={() => onRefreshGeminiInsight(selectedStudent)}
              disabled={isLoadingAI}
              title="Regenerate with Gemini"
              className="text-[11px] flex items-center gap-1 text-slate-500 hover:text-[#1677E8] disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingAI ? 'animate-spin text-[#1677E8]' : ''}`} />
              <span>{isLoadingAI ? 'Analyzing...' : 'Re-analyze'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100/70 text-xs text-slate-700 leading-relaxed">
            {currentInsight.aiInsight}
          </div>
        </div>

        {/* Suggested Actions Block */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>Suggested Actions</span>
          </div>

          {isModifying ? (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
              <p className="text-[11px] font-semibold text-amber-800 mb-1.5">
                Edit pedagogical actions for {selectedStudent.name}:
              </p>
              <textarea
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                rows={3}
                className="w-full text-xs p-2 bg-white border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 focus:outline-none text-slate-700"
                placeholder="Enter actions (one per line)..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsModifying(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModify}
                  className="px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Save Modifications
                </button>
              </div>
            </div>
          ) : isRejecting ? (
            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
              <p className="text-[11px] font-semibold text-rose-800 mb-1.5">
                Reason for declining recommendation:
              </p>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Target vocabulary already covered in Unit 4"
                className="w-full text-xs p-2 bg-white border border-rose-300 rounded focus:ring-1 focus:ring-rose-500 focus:outline-none text-slate-700 mb-2"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded hover:bg-rose-700"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-100/70 text-xs text-slate-700">
              <ul className="space-y-1.5 list-disc list-inside">
                {currentInsight.suggestedActions.map((action, idx) => (
                  <li key={idx} className="leading-snug">
                    <span className="text-slate-800">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Decision Banner if already decided */}
        {currentInsight.teacherDecision && currentInsight.teacherDecision !== 'Pending' && !isModifying && !isRejecting && (
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {currentInsight.teacherDecision === 'Accept' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {currentInsight.teacherDecision === 'Modify' && <Edit3 className="w-4 h-4 text-blue-600" />}
              {currentInsight.teacherDecision === 'Reject' && <XCircle className="w-4 h-4 text-rose-600" />}
              <span className="font-semibold text-slate-800">
                Teacher Decision: <span className="capitalize">{currentInsight.teacherDecision}ed</span>
              </span>
            </div>
            {currentInsight.teacherComment && (
              <span className="text-[11px] text-slate-500 italic max-w-[150px] truncate">
                "{currentInsight.teacherComment}"
              </span>
            )}
          </div>
        )}

        {/* Action Buttons (Human-in-the-Loop) */}
        {!isModifying && !isRejecting && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onUpdateDecision(selectedStudent.id, 'Accept')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                currentInsight.teacherDecision === 'Accept'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-[#1677E8] text-white hover:bg-blue-700'
              }`}
            >
              {currentInsight.teacherDecision === 'Accept' ? 'Accepted ✓' : 'Accept Recommendation'}
            </button>
            <button
              onClick={handleStartModify}
              className="py-2 px-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-xs"
            >
              Modify
            </button>
            <button
              onClick={() => {
                setIsRejecting(true);
                setIsModifying(false);
              }}
              className="py-2 px-2 text-xs font-semibold rounded-lg border border-rose-200 text-rose-600 bg-white hover:bg-rose-50 transition-all shadow-xs"
            >
              Reject
            </button>
          </div>
        )}

        {/* Pedagogical Principle Disclaimer */}
        <p className="mt-3 text-center text-[10px] text-slate-400 font-medium">
          “AI recommends; teacher decides.” (Human-in-the-loop)
        </p>
      </div>

      {/* Recent Activity Panel */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">Recent Activity</h3>
          </div>
          <button
            onClick={() => onNavigateToTab('Reports')}
            className="text-xs font-semibold text-[#1677E8] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="py-2.5 flex items-start gap-2.5">
              <span
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  act.type === 'ai'
                    ? 'bg-blue-500'
                    : act.type === 'recommendation'
                    ? 'bg-amber-500'
                    : act.type === 'upload'
                    ? 'bg-emerald-500'
                    : act.type === 'decision'
                    ? 'bg-purple-500'
                    : 'bg-slate-400'
                }`}
              ></span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800 leading-tight">{act.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{act.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
