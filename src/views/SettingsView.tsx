import React, { useState } from 'react';
import { Sheet, RefreshCw, Copy, Check, Save, RotateCcw, Download, Upload, Shield } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/appsScriptCode';

interface Props {
  scriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
  onSyncNow: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: string | null;
  onResetDemoData: () => void;
  onExportFullBackup: () => void;
  onImportBackup: (jsonStr: string) => void;
  schoolName: string;
  onSaveSchoolName: (school: string) => void;
  className: string;
  onSaveClassName: (cls: string) => void;
  teacherName: string;
  onSaveTeacherName: (teacher: string) => void;
  onUpdateAllStudents?: (school: string, cls: string, teacher: string) => void;
}

export const SettingsView: React.FC<Props> = ({
  scriptUrl,
  onSaveScriptUrl,
  onSyncNow,
  isSyncing,
  lastSyncTime,
  onResetDemoData,
  onExportFullBackup,
  onImportBackup,
  schoolName,
  onSaveSchoolName,
  className,
  onSaveClassName,
  teacherName,
  onSaveTeacherName,
  onUpdateAllStudents,
}) => {
  const [urlInput, setUrlInput] = useState(scriptUrl);
  const [teacherInput, setTeacherInput] = useState(teacherName);
  const [schoolInput, setSchoolInput] = useState(schoolName);
  const [classInput, setClassInput] = useState(className);
  const [applyToAll, setApplyToAll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  // Sync inputs with props if changed externally
  React.useEffect(() => {
    setTeacherInput(teacherName);
    setSchoolInput(schoolName);
    setClassInput(className);
  }, [teacherName, schoolName, className]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConnection = () => {
    onSaveScriptUrl(urlInput.trim());
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const handleSaveProfile = () => {
    const sName = schoolInput.trim();
    const cName = classInput.trim();
    const tName = teacherInput.trim();

    if (sName) onSaveSchoolName(sName);
    if (cName) onSaveClassName(cName);
    if (tName) onSaveTeacherName(tName);

    if (applyToAll && onUpdateAllStudents && sName && cName) {
      onUpdateAllStudents(sName, cName, tName || teacherName);
    }

    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) onImportBackup(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Settings</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Configure Google Apps Script sync, classroom parameters, and academic thresholds.
        </p>
      </div>

      {/* Google Apps Script Integration Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Sheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Google Sheets & Google Apps Script Setup</h3>
            <p className="text-xs text-slate-500">
              Synchronize live student reading scores directly from your Google Sheets Web App.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Google Apps Script Web App URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 text-xs py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
            />
            <button
              onClick={handleSaveConnection}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#1677E8] hover:bg-blue-700 rounded-lg transition-all shadow-xs"
            >
              Save URL
            </button>
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
          {savedSettings && <span className="text-xs text-emerald-600 font-semibold">Settings saved!</span>}
          {lastSyncTime && (
            <p className="text-[11px] text-slate-400">Last sync timestamp: {lastSyncTime}</p>
          )}
        </div>

        {/* Copy Apps Script */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Need the Google Apps Script template for your spreadsheet?
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#1677E8]" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code.gs'}</span>
          </button>
        </div>
      </div>

      {/* School, Class & Teacher Profile */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Instructor & Institutional Profile</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Nama sekolah dan kelas dapat diisi sesuai sekolah dan kelas Anda sendiri.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Guru (Teacher Name)</label>
            <input
              type="text"
              value={teacherInput}
              onChange={(e) => setTeacherInput(e.target.value)}
              placeholder="Contoh: Ms. Dewi, S.Pd."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Sekolah (School Name)</label>
            <input
              type="text"
              value={schoolInput}
              onChange={(e) => setSchoolInput(e.target.value)}
              placeholder="Contoh: SMP Negeri 1, SMPN 3 Jakarta"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas Aktif (Class)</label>
            <input
              type="text"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              placeholder="Contoh: VIII-A, VII-1, 9B"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
            />
          </div>
        </div>
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={applyToAll}
              onChange={(e) => setApplyToAll(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#1677E8] focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span className="text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">
                Terapkan juga ke semua data siswa di dashboard saat ini
              </span>
              <span className="text-[11px] text-slate-500">
                Otomatis memperbarui nama sekolah, kelas, dan guru pada seluruh data siswa di sistem.
              </span>
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1677E8] text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Profil & Sekolah</span>
          </button>
          {savedProfile && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              Nama sekolah, kelas & profil berhasil diperbarui!
            </span>
          )}
        </div>
      </div>

      {/* Performance Categories & Thresholds */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Standard Performance Cutoffs</h3>
        <p className="text-xs text-slate-500">
          The dashboard automatically calculates student categories based on these benchmark thresholds:
        </p>
        <div className="grid grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-[#E8F8F3] border border-emerald-200 text-emerald-900">
            <strong className="block text-sm font-bold">Excellent</strong>
            <span>85 – 100</span>
          </div>
          <div className="p-3 rounded-lg bg-[#EBF3FF] border border-blue-200 text-blue-900">
            <strong className="block text-sm font-bold">Good</strong>
            <span>70 – 84</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FFF7E8] border border-amber-200 text-amber-900">
            <strong className="block text-sm font-bold">Fair</strong>
            <span>55 – 69</span>
          </div>
          <div className="p-3 rounded-lg bg-[#FDEEF1] border border-rose-200 text-rose-900">
            <strong className="block text-sm font-bold">Needs Support</strong>
            <span>Below 55</span>
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Data Backup & Restoration</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExportFullBackup}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#1677E8]" />
            <span>Export Backup JSON</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>Import Backup JSON</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onResetDemoData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors shadow-2xs ml-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset to Standard 30-Student Demo Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
