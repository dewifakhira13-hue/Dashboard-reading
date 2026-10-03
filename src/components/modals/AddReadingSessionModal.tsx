import React, { useState } from 'react';
import { Student, ReadingSessionRecord, TextType, TextLevel } from '../../types';
import { READING_TEXTS, calculatePerformanceLevel } from '../../data/initialData';
import { X, BookOpen, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onAddSessionRecord: (record: ReadingSessionRecord) => void;
  defaultSession?: string;
}

export const AddReadingSessionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  students,
  onAddSessionRecord,
  defaultSession = 'Session 5',
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [session, setSession] = useState(defaultSession);
  const [selectedTextId, setSelectedTextId] = useState(READING_TEXTS[4].id);
  const [textType, setTextType] = useState<TextType>('Expository');
  const [textLevel, setTextLevel] = useState<TextLevel>('B1');

  // Reading Comprehension Scores
  const [readingScore, setReadingScore] = useState(80);
  const [mainIdeaScore, setMainIdeaScore] = useState(82);
  const [specificInfoScore, setSpecificInfoScore] = useState(80);
  const [inferenceScore, setInferenceScore] = useState(74);
  const [vocabularyScore, setVocabularyScore] = useState(70);

  // Engagement & Affective
  const [taskCompletionPercent, setTaskCompletionPercent] = useState(85);
  const [responseTimeSeconds, setResponseTimeSeconds] = useState(120);
  const [engagement, setEngagement] = useState(3.8);
  const [confidence, setConfidence] = useState(3.6);
  const [readingAnxiety, setReadingAnxiety] = useState(2.2);
  const [motivation, setMotivation] = useState(4.0);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentText = READING_TEXTS.find((t) => t.id === selectedTextId) || READING_TEXTS[4];

  const handleTextChange = (textId: string) => {
    setSelectedTextId(textId);
    const found = READING_TEXTS.find((t) => t.id === textId);
    if (found) {
      setTextType(found.type as TextType);
      setTextLevel(found.level as TextLevel);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const record: ReadingSessionRecord = {
      id: `REC-${currentStudent.id}-${session.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      class: currentStudent.class,
      session,
      readingTextId: currentText.id,
      readingTextTitle: currentText.title,
      textType,
      textLevel,
      readingScore,
      mainIdeaScore,
      specificInformationScore: specificInfoScore,
      inferenceScore,
      vocabularyScore,
      taskCompletionPercent,
      responseTimeSeconds,
      engagement,
      confidence,
      readingAnxiety,
      motivation,
      performanceLevel: calculatePerformanceLevel(readingScore),
      date: new Date().toISOString().split('T')[0],
    };

    onAddSessionRecord(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#082B5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Record Student Reading Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Target Student & Session */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student *</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) - {s.class}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Session *</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Session 1">Session 1</option>
                <option value="Session 2">Session 2</option>
                <option value="Session 3">Session 3</option>
                <option value="Session 4">Session 4</option>
                <option value="Session 5">Session 5</option>
                <option value="Session 6">Session 6 (New)</option>
              </select>
            </div>
          </div>

          {/* Reading Text & Metadata */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reading Text</label>
              <select
                value={selectedTextId}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {READING_TEXTS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Text Type</label>
              <select
                value={textType}
                onChange={(e) => setTextType(e.target.value as TextType)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Narrative">Narrative</option>
                <option value="Expository">Expository</option>
                <option value="Descriptive">Descriptive</option>
                <option value="Report">Report</option>
                <option value="Argumentative">Argumentative</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Text Level (CEFR)</label>
              <select
                value={textLevel}
                onChange={(e) => setTextLevel(e.target.value as TextLevel)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="A1">A1 (Beginner)</option>
                <option value="A2">A2 (Elementary)</option>
                <option value="A2+">A2+ (Upper Elementary)</option>
                <option value="B1">B1 (Intermediate)</option>
                <option value="B1+">B1+ (Intermediate+)</option>
                <option value="B2">B2 (Upper Intermediate)</option>
              </select>
            </div>
          </div>

          {/* Reading Comprehension Scores */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Reading Skill Scores (0–100)
            </h4>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Overall Score</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={readingScore}
                  onChange={(e) => setReadingScore(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center font-bold text-blue-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Main Idea</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={mainIdeaScore}
                  onChange={(e) => setMainIdeaScore(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Specific Info</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={specificInfoScore}
                  onChange={(e) => setSpecificInfoScore(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Inference</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={inferenceScore}
                  onChange={(e) => setInferenceScore(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Vocabulary</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={vocabularyScore}
                  onChange={(e) => setVocabularyScore(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
            </div>
          </div>

          {/* Task Metrics & Affective Indicators */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Engagement & Affective Indicators</h4>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Task Completion (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={taskCompletionPercent}
                  onChange={(e) => setTaskCompletionPercent(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Response Time (seconds)</label>
                <input
                  type="number"
                  min={10}
                  max={900}
                  value={responseTimeSeconds}
                  onChange={(e) => setResponseTimeSeconds(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Engagement (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={engagement}
                  onChange={(e) => setEngagement(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Confidence (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Reading Anxiety (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={readingAnxiety}
                  onChange={(e) => setReadingAnxiety(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center text-amber-700 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Motivation (1-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={5}
                  value={motivation}
                  onChange={(e) => setMotivation(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Auto Performance Level: <span className="font-bold text-blue-600">{calculatePerformanceLevel(readingScore)}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#1677E8] hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Save Reading Session
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
