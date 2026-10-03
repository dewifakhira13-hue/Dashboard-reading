import React, { useState } from 'react';
import { Student, ReadingSessionRecord, AIInsightRecord } from '../types';
import { Printer, Download, FileText, CheckCircle, Award, BarChart2 } from 'lucide-react';

interface Props {
  students: Student[];
  sessions: ReadingSessionRecord[];
  insights: AIInsightRecord[];
  selectedClass: string;
  schoolName?: string;
  teacherName?: string;
}

export const ReportsView: React.FC<Props> = ({
  students,
  sessions,
  insights,
  selectedClass,
  schoolName = 'SMP Negeri 1',
  teacherName = 'Ms. Dewi',
}) => {
  const [reportType, setReportType] = useState<'class' | 'skills' | 'affective' | 'decisions'>('class');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [customDate, setCustomDate] = useState<string>('');

  const uniqueDates = Array.from(new Set(students.map((s) => s.date).filter(Boolean))).sort().reverse();

  const classStudents = students.filter((s) => s.class === selectedClass);
  const baseList = classStudents.length > 0 ? classStudents : students;

  const currentList = baseList.filter((s) => {
    if (dateFilter === 'Custom' && customDate) {
      return s.date === customDate;
    }
    if (dateFilter !== 'All') {
      return s.date === dateFilter;
    }
    return true;
  });

  const avgScore = (currentList.reduce((a, b) => a + b.readingScore, 0) / (currentList.length || 1)).toFixed(1);
  const avgMainIdea = (currentList.reduce((a, b) => a + b.mainIdea, 0) / (currentList.length || 1)).toFixed(1);
  const avgSpecific = (currentList.reduce((a, b) => a + b.specificInfo, 0) / (currentList.length || 1)).toFixed(1);
  const avgInference = (currentList.reduce((a, b) => a + b.inference, 0) / (currentList.length || 1)).toFixed(1);
  const avgVocab = (currentList.reduce((a, b) => a + b.vocabulary, 0) / (currentList.length || 1)).toFixed(1);
  const avgAnx = (currentList.reduce((a, b) => a + b.anxiety, 0) / (currentList.length || 1)).toFixed(1);
  const avgConf = (currentList.reduce((a, b) => a + b.confidence, 0) / (currentList.length || 1)).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = '';
    if (reportType === 'class' || reportType === 'skills' || reportType === 'affective') {
      csv = 'Student_ID,Date,Student_Name,School,Class,Grade,Teacher_Name,Active,Reading_Score,Main_Idea,Specific_Info,Inference,Vocabulary,Engagement,Confidence,Anxiety,Level\n';
      currentList.forEach((s) => {
        csv += `"${s.id}","${s.date}","${s.name}","${s.school}","${s.class}","${s.grade}","${s.teacherName}","${s.active ? 'Yes' : 'No'}",${s.readingScore},${s.mainIdea},${s.specificInfo},${s.inference},${s.vocabulary},${s.engagement},${s.confidence},${s.anxiety},"${s.level}"\n`;
      });
    } else {
      csv = 'Student_ID,Student_Name,Class,Priority,Pattern,Teacher_Decision,Teacher_Comment\n';
      insights.forEach((i) => {
        csv += `"${i.studentId}","${i.studentName}","${i.class}","${i.priority}","${i.detectedPattern}","${i.teacherDecision}","${i.teacherComment || ''}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `English_Reading_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Reading Reports</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Generate formal classroom reading summaries, skill gap distributions, and affective diagnostic digests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <span className="text-xs font-semibold text-slate-500">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All">All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              <option value="Custom">Custom...</option>
            </select>
            {dateFilter === 'Custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="text-xs border border-blue-300 rounded px-1.5 py-0.5"
              />
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#1677E8]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#082B5F] text-white text-xs font-bold hover:bg-slate-800 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex border-b border-slate-200 gap-2 print:hidden">
        <button
          onClick={() => setReportType('class')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            reportType === 'class' ? 'border-[#1677E8] text-[#1677E8]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Class Overview Report
        </button>
        <button
          onClick={() => setReportType('skills')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            reportType === 'skills' ? 'border-[#1677E8] text-[#1677E8]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Reading Skill Profile
        </button>
        <button
          onClick={() => setReportType('affective')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            reportType === 'affective' ? 'border-[#1677E8] text-[#1677E8]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Affective & Anxiety Digest
        </button>
        <button
          onClick={() => setReportType('decisions')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            reportType === 'decisions' ? 'border-[#1677E8] text-[#1677E8]' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Teacher Pedagogical Decisions
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Academic Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-wide">
              {schoolName} • ENGLISH READING DEPARTMENT
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Class {selectedClass} • Teacher: {teacherName} • Academic Year 2026/2027
            </p>
            <p className="text-[11px] text-slate-400">
              Evaluation Period: Sessions 1–5 (Text: The Importance of Renewable Energy)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded text-slate-800 uppercase">
              {reportType === 'class' && 'Comprehensive Class Overview'}
              {reportType === 'skills' && '4-Domain Reading Comprehension Analysis'}
              {reportType === 'affective' && 'Engagement & Affective Indicators Report'}
              {reportType === 'decisions' && 'Human-In-The-Loop Teacher Decision Record'}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500">Cohort Size</span>
            <p className="text-2xl font-black text-slate-900">{currentList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500">Class Mean Score</span>
            <p className="text-2xl font-black text-blue-700">{avgScore} / 100</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500">Class Confidence</span>
            <p className="text-2xl font-black text-emerald-700">{avgConf} / 5</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-500">Mean Reading Anxiety</span>
            <p className="text-2xl font-black text-amber-700">{avgAnx} / 5</p>
          </div>
        </div>

        {/* Report Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="p-2.5">No.</th>
                <th className="p-2.5">ID</th>
                <th className="p-2.5">Date</th>
                <th className="p-2.5">Student Name</th>
                {reportType !== 'decisions' ? (
                  <>
                    <th className="p-2.5 text-center">Score</th>
                    <th className="p-2.5 text-center">Main Idea</th>
                    <th className="p-2.5 text-center">Specific</th>
                    <th className="p-2.5 text-center">Inference</th>
                    <th className="p-2.5 text-center">Vocab</th>
                    <th className="p-2.5 text-center">Anxiety</th>
                    <th className="p-2.5 text-center">Level</th>
                  </>
                ) : (
                  <>
                    <th className="p-2.5">Priority</th>
                    <th className="p-2.5">Detected Pattern</th>
                    <th className="p-2.5 text-center">Decision</th>
                    <th className="p-2.5">Teacher Note</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportType !== 'decisions'
                ? currentList.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-700">{s.id}</td>
                      <td className="p-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">{s.date}</td>
                      <td className="p-2.5 font-bold text-slate-900">{s.name}</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">{s.readingScore}</td>
                      <td className="p-2.5 text-center">{s.mainIdea}%</td>
                      <td className="p-2.5 text-center">{s.specificInfo}%</td>
                      <td className="p-2.5 text-center">{s.inference}%</td>
                      <td className="p-2.5 text-center">{s.vocabulary}%</td>
                      <td className="p-2.5 text-center font-semibold text-amber-700">{s.anxiety}</td>
                      <td className="p-2.5 text-center font-bold">{s.level}</td>
                    </tr>
                  ))
                : insights.map((ins, idx) => (
                    <tr key={ins.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-semibold text-slate-700">{ins.studentId}</td>
                      <td className="p-2.5 font-bold text-slate-900">{ins.studentName}</td>
                      <td className="p-2.5 font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            ins.priority === 'High'
                              ? 'bg-rose-100 text-rose-700'
                              : ins.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {ins.priority}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-700">{ins.detectedPattern}</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">
                        {ins.teacherDecision || 'Pending'}
                      </td>
                      <td className="p-2.5 text-slate-500 italic">{ins.teacherComment || '-'}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Signature Box */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500 mb-12">Head of English Department</p>
            <p className="font-bold text-slate-900 underline">Drs. H. Bambang Sutrisno, M.Pd.</p>
            <p className="text-[10px] text-slate-400">NIP. 19740512 199903 1 004</p>
          </div>
          <div>
            <p className="text-slate-500 mb-12">English Reading Instructor</p>
            <p className="font-bold text-slate-900 underline">Dewi Fakhira, S.Pd., M.A.</p>
            <p className="text-[10px] text-slate-400">English Teacher Class VIII</p>
          </div>
        </div>
      </div>
    </div>
  );
};
