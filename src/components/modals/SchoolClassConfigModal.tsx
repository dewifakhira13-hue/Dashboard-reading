import React, { useState } from 'react';
import { X, School, BookOpen, User, Check, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSchool: string;
  currentClass: string;
  currentTeacher: string;
  knownSchools: string[];
  knownClasses: string[];
  onSave: (
    school: string,
    cls: string,
    teacher: string,
    updateExistingStudents: boolean
  ) => void;
}

export const SchoolClassConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSchool,
  currentClass,
  currentTeacher,
  knownSchools,
  knownClasses,
  onSave,
}) => {
  const [school, setSchool] = useState(currentSchool);
  const [cls, setCls] = useState(currentClass);
  const [teacher, setTeacher] = useState(currentTeacher);
  const [updateExisting, setUpdateExisting] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!school.trim() || !cls.trim()) return;
    onSave(school.trim(), cls.trim(), teacher.trim() || currentTeacher, updateExisting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#082B5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight">Pengaturan Sekolah & Kelas</h3>
              <p className="text-[11px] text-blue-200">Isi nama sekolah dan kelas Anda sendiri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#1677E8] shrink-0 mt-0.5" />
            <span>
              Anda dapat mengisi <strong>Nama Sekolah</strong> dan <strong>Kelas</strong> secara bebas sesuai institusi dan rombel Anda.
            </span>
          </div>

          {/* School Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#1677E8]" />
              Nama Sekolah (School Name) *
            </label>
            <input
              type="text"
              required
              list="school-suggestions"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Contoh: SMP Negeri 1, SMPN 3 Jakarta, MTs Negeri..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
            />
            <datalist id="school-suggestions">
              {knownSchools.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Ketik nama sekolah baru atau pilih dari saran.
            </span>
          </div>

          {/* Class Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#1677E8]" />
              Nama Kelas (Class Name) *
            </label>
            <input
              type="text"
              required
              list="class-suggestions"
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              placeholder="Contoh: VIII-A, VII-1, 9B, X MIPA 1..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
            />
            <datalist id="class-suggestions">
              {knownClasses.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Ketik nama kelas sendiri secara bebas.
            </span>
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#1677E8]" />
              Nama Guru (Teacher Name)
            </label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Contoh: Ms. Dewi, S.Pd."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
            />
          </div>

          {/* Checkbox: Update existing students */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={updateExisting}
                onChange={(e) => setUpdateExisting(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#1677E8] focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs text-slate-700">
                <span className="font-bold text-slate-900 block">
                  Perbarui seluruh data siswa saat ini
                </span>
                <span className="text-[11px] text-slate-500">
                  Ubah sekolah dan kelas pada semua siswa di roster saat ini menjadi nama sekolah dan kelas baru di atas.
                </span>
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1677E8] text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
