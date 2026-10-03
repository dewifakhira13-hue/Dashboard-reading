import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { X, UserPlus, Sparkles } from 'lucide-react';
import { calculatePerformanceLevel } from '../../data/initialData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
  defaultClass: string;
  defaultSchool?: string;
  defaultTeacher?: string;
  knownSchools?: string[];
  knownClasses?: string[];
}

export const AddStudentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddStudent,
  defaultClass,
  defaultSchool = 'SMP Negeri 1',
  defaultTeacher = 'Ms. Dewi',
  knownSchools = ['SMP Negeri 1', 'SMP Negeri 2'],
  knownClasses = ['VIII-A', 'VIII-B', 'VIII-C'],
}) => {
  const [id, setId] = useState(`EXP-${Math.floor(5031 + Math.random() * 900)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [school, setSchool] = useState(defaultSchool);
  const [className, setClassName] = useState(defaultClass || 'VIII-A');
  const [grade, setGrade] = useState('Grade 8');
  const [teacherName, setTeacherName] = useState(defaultTeacher);
  const [active, setActive] = useState(true);

  // Sync when modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setId(`EXP-${Math.floor(5031 + Math.random() * 900)}`);
      setDate(new Date().toISOString().split('T')[0]);
      setName('');
      setSchool(defaultSchool);
      setClassName(defaultClass === 'All' ? 'VIII-A' : defaultClass || 'VIII-A');
      setTeacherName(defaultTeacher);
    }
  }, [isOpen, defaultSchool, defaultClass, defaultTeacher]);

  // Initial baseline scores
  const [readingScore, setReadingScore] = useState(75);
  const [mainIdea, setMainIdea] = useState(78);
  const [specificInfo, setSpecificInfo] = useState(75);
  const [inference, setInference] = useState(70);
  const [vocabulary, setVocabulary] = useState(65);
  const [engagement, setEngagement] = useState(3.5);
  const [confidence, setConfidence] = useState(3.5);
  const [anxiety, setAnxiety] = useState(2.8);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const student: Student = {
      id: id.trim(),
      date: date || new Date().toISOString().split('T')[0],
      name: name.trim(),
      school,
      class: className,
      grade,
      teacherName,
      active,
      readingScore,
      mainIdea,
      specificInfo,
      inference,
      vocabulary,
      engagement,
      confidence,
      anxiety,
      motivation: +(confidence * 1.1).toFixed(1),
      level: calculatePerformanceLevel(readingScore),
    };

    onAddStudent(student);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#082B5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-base">Add New Student</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID *</label>
              <input
                type="text"
                required
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahma Azzahra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">School</label>
              <input
                type="text"
                list="modal-schools-list"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. SMP Negeri 1"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <datalist id="modal-schools-list">
                {knownSchools.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
              <input
                type="text"
                list="modal-classes-list"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="e.g. VIII-A, VII-1"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <datalist id="modal-classes-list">
                {knownClasses.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Grade</label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Grade 8"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Initial Reading Baseline (0-100)
            </h4>
            <div className="grid grid-cols-5 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Overall</label>
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
                  value={mainIdea}
                  onChange={(e) => setMainIdea(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Specific</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={specificInfo}
                  onChange={(e) => setSpecificInfo(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Inference</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={inference}
                  onChange={(e) => setInference(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-0.5">Vocab</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={vocabulary}
                  onChange={(e) => setVocabulary(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-2">Affective Indicators (1 - 5)</h4>
            <div className="grid grid-cols-3 gap-3">
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
                  value={anxiety}
                  onChange={(e) => setAnxiety(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 text-center text-amber-700 font-medium"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 italic">
              Note: Higher reading anxiety indicates greater hesitation or discomfort during reading tasks.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Calculated Level: <strong className="text-blue-600 font-bold">{calculatePerformanceLevel(readingScore)}</strong>
            </span>
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
                Save Student
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
