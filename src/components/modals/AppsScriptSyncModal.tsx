import React, { useState } from 'react';
import { X, RefreshCw, Copy, Check, ExternalLink, Sheet, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../data/appsScriptCode';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scriptUrl: string;
  onSaveScriptUrl: (url: string) => void;
  onSyncNow: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: string | null;
  syncStatus: 'idle' | 'success' | 'error';
  syncMessage: string;
}

export const AppsScriptSyncModal: React.FC<Props> = ({
  isOpen,
  onClose,
  scriptUrl,
  onSaveScriptUrl,
  onSyncNow,
  isSyncing,
  lastSyncTime,
  syncStatus,
  syncMessage,
}) => {
  const [urlInput, setUrlInput] = useState(scriptUrl);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'connect' | 'code' | 'tutorial'>('connect');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndSync = async () => {
    onSaveScriptUrl(urlInput.trim());
    await onSyncNow();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#082B5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Google Sheets & Apps Script Integration</h3>
              <p className="text-xs text-blue-200">Connect live classroom spreadsheet with your dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Connection & Sync
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Apps Script Code (Code.gs)
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'tutorial'
                ? 'border-[#1677E8] text-[#1677E8]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Step-by-Step Guide
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'connect' && (
            <div className="space-y-5">
              {/* Google Sheets Connection Box matching user screenshot Capture6.PNG */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <h4 className="font-bold text-[#082B5F] text-sm mb-1">Google Sheets Connection</h4>
                <p className="text-xs text-slate-600 mb-3">
                  Enter your Google Apps Script Web App URL to sync with your real data.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 text-xs py-2.5 px-3 bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-700 shadow-2xs"
                  />
                  <button
                    onClick={handleSaveAndSync}
                    disabled={isSyncing}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#1677E8] hover:bg-blue-700 rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {syncStatus !== 'idle' && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 text-xs ${
                    syncStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {syncStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Integration Status Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-500 text-[11px] block mb-1">Spreadsheet Sync Mode</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${scriptUrl ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span className="font-bold text-slate-800">
                      {scriptUrl ? 'Live Web App Connected' : 'Demo Dataset Mode'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-slate-500 text-[11px] block mb-1">Last Successful Sync</span>
                  <span className="font-bold text-slate-800">
                    {lastSyncTime || 'Using preloaded junior high dataset'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                💡 <strong>Tip for Teachers:</strong> If you haven't deployed your Google Apps Script yet, the dashboard is already preloaded with full data for 30 students and 5 sessions. You can switch to live sync anytime!
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Copy and paste this script directly into your Google Sheet's <strong>Extensions &gt; Apps Script</strong>:
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1677E8] text-white hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code.gs'}</span>
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-80 leading-normal border border-slate-800">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'tutorial' && (
            <div className="space-y-4 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 text-sm">Cara Menghubungkan Google Sheet Anda (5 Langkah Mudah):</h4>
              <ol className="space-y-3 list-decimal list-inside pl-2">
                <li className="leading-relaxed">
                  <strong>Buka Google Sheets:</strong> Buat spreadsheet kosong baru di Google Drive Anda (misal beri nama <em>"English Reading Data SMP 1"</em>).
                </li>
                <li className="leading-relaxed">
                  <strong>Buka Editor Apps Script:</strong> Klik menu <code>Extensions</code> (Ekstensi) &gt; <code>Apps Script</code>.
                </li>
                <li className="leading-relaxed">
                  <strong>Paste Kode:</strong> Buka tab <strong>"Apps Script Code"</strong> di atas, klik tombol <strong>"Copy Code.gs"</strong>, hapus kode lama di editor Google, lalu paste kode tersebut dan klik Save (ikon disket).
                </li>
                <li className="leading-relaxed">
                  <strong>Jalankan Setup Otomatis:</strong> Di toolbar Apps Script, pilih fungsi <code>setupSheets</code> lalu klik <code>Run</code> (Jalankan). Berikan izin akun Google sekali saja. Ini akan otomatis membuat sheet <code>Teacher_Student_Input</code>, <code>Reading_Data_Input</code>, dan <code>AI_Insights_Input</code> lengkap dengan headernya.
                </li>
                <li className="leading-relaxed">
                  <strong>Deploy sebagai Web App:</strong> Klik tombol biru <code>Deploy</code> &gt; <code>New deployment</code> &gt; Pilih tipe <code>Web app</code>:
                  <ul className="list-disc list-inside ml-4 mt-1 text-slate-600">
                    <li>Execute as: <strong>Me</strong> (email Anda)</li>
                    <li>Who has access: <strong>Anyone</strong> (Siapa saja)</li>
                  </ul>
                  Klik <code>Deploy</code>, lalu salin URL yang berakhiran <code>/exec</code> dan masukkan ke kotak <strong>Google Sheets Connection</strong> di dashboard ini!
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Google Apps Script Web App Integration v1.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
