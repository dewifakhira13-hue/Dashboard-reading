/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Users,
  BarChart3,
  Sparkles,
  CheckSquare,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  Sheet,
  Sprout,
  Menu,
  X,
  Calendar,
  Filter,
  RotateCcw,
  Pencil,
  School,
} from 'lucide-react';

import {
  Student,
  ReadingSessionRecord,
  AIInsightRecord,
  ActivityItem,
  DecisionStatus,
} from './types';
import {
  INITIAL_STUDENTS,
  generateInitialSessions,
  INITIAL_AI_INSIGHTS,
  INITIAL_ACTIVITIES,
  READING_TEXTS,
} from './data/initialData';

import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { ReadingAnalyticsView } from './views/ReadingAnalyticsView';
import { AIInsightsView } from './views/AIInsightsView';
import { RecommendationsView } from './views/RecommendationsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import { AddStudentModal } from './components/modals/AddStudentModal';
import { AddReadingSessionModal } from './components/modals/AddReadingSessionModal';
import { StudentDetailModal } from './components/modals/StudentDetailModal';
import { AppsScriptSyncModal } from './components/modals/AppsScriptSyncModal';
import { SchoolClassConfigModal } from './components/modals/SchoolClassConfigModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Top Filters & Profile (Student_ID, Date, Student_Name, School, Class, Grade, Teacher_Name, Active)
  const [selectedSchool, setSelectedSchool] = useState<string>(() => {
    return localStorage.getItem('ar_school_name') || 'SMP Negeri 1';
  });
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return localStorage.getItem('ar_class_name') || 'VIII-A';
  });
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem('ar_teacher_name') || 'Ms. Dewi';
  });
  const [isSchoolConfigOpen, setIsSchoolConfigOpen] = useState(false);

  const [selectedReadingText, setSelectedReadingText] = useState('The Importance of Renewable Energy');
  const [selectedSessionRange, setSelectedSessionRange] = useState('Session 1–5');
  const [selectedDate, setSelectedDate] = useState<string>('All');
  const [customDate, setCustomDate] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedActiveStatus, setSelectedActiveStatus] = useState<string>('All');

  // Toggle active status for student
  const handleToggleStudentActive = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, active: !s.active } : s))
    );
  };

  // Core Data Collections (with localStorage persistence)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ar_students_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_STUDENTS;
  });

  const [sessions, setSessions] = useState<ReadingSessionRecord[]>(() => {
    const saved = localStorage.getItem('ar_sessions_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return generateInitialSessions(INITIAL_STUDENTS);
  });

  const [insights, setInsights] = useState<AIInsightRecord[]>(() => {
    const saved = localStorage.getItem('ar_insights_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AI_INSIGHTS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('ar_activities_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ACTIVITIES;
  });

  // Selected Student for AI Panel & Modal Detail
  const [selectedStudent, setSelectedStudent] = useState<Student>(students[0]);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);

  // Modals state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAppsScriptModalOpen, setIsAppsScriptModalOpen] = useState(false);

  // Google Apps Script Connection
  const [scriptUrl, setScriptUrl] = useState<string>(() => {
    return localStorage.getItem('ar_apps_script_url') || '';
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('ar_last_sync_time') || null;
  });

  // AI loading state
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('ar_students_data', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ar_sessions_data', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('ar_insights_data', JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem('ar_activities_data', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('ar_school_name', selectedSchool);
  }, [selectedSchool]);

  useEffect(() => {
    localStorage.setItem('ar_class_name', selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    localStorage.setItem('ar_teacher_name', teacherName);
  }, [teacherName]);

  const handleUpdateAllStudentsSchoolAndClass = (
    newSchool: string,
    newClass: string,
    newTeacher: string
  ) => {
    setSelectedSchool(newSchool);
    setSelectedClass(newClass);
    setTeacherName(newTeacher);

    // Update students
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        school: newSchool,
        class: newClass,
        teacherName: newTeacher,
      }))
    );

    // Update sessions
    setSessions((prev) =>
      prev.map((rec) => ({
        ...rec,
        class: newClass,
      }))
    );

    // Update insights
    setInsights((prev) =>
      prev.map((ins) => ({
        ...ins,
        class: newClass,
      }))
    );

    // Add activity log
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        timestamp: 'Just now',
        title: 'Profil Institusi Diperbarui',
        description: `Nama sekolah "${newSchool}", kelas "${newClass}" diterapkan ke semua siswa.`,
        type: 'decision',
      },
      ...prev,
    ]);
  };

  const handleSaveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem('ar_apps_script_url', url);
  };

  // Google Apps Script Sync Handler
  const handleSyncGoogleSheet = async () => {
    if (!scriptUrl) {
      setSyncStatus('error');
      setSyncMessage('Please enter a valid Google Apps Script Web App URL first.');
      setIsAppsScriptModalOpen(true);
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      const res = await fetch('/api/sync/apps-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptUrl,
          action: 'fetch',
        }),
      });

      const data = await res.json();
      if (data.status === 'success' || data.students) {
        if (data.students && data.students.length > 0) {
          setStudents((prev) => {
            const merged = [...prev];
            data.students.forEach((remoteS: any) => {
              const idx = merged.findIndex((m) => m.id === remoteS.id);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...remoteS };
              } else {
                merged.push({
                  ...remoteS,
                  readingScore: remoteS.readingScore || 75,
                  mainIdea: remoteS.mainIdea || 75,
                  specificInfo: remoteS.specificInfo || 75,
                  inference: remoteS.inference || 70,
                  vocabulary: remoteS.vocabulary || 65,
                  engagement: remoteS.engagement || 3.5,
                  confidence: remoteS.confidence || 3.5,
                  anxiety: remoteS.anxiety || 2.5,
                  motivation: remoteS.motivation || 3.5,
                  level: 'Good',
                });
              }
            });
            return merged;
          });
        }

        if (data.readingSessions && data.readingSessions.length > 0) {
          setSessions((prev) => {
            const merged = [...prev];
            data.readingSessions.forEach((remRec: any) => {
              const idx = merged.findIndex((r) => r.studentId === remRec.studentId && r.session === remRec.session);
              if (idx >= 0) {
                merged[idx] = { ...merged[idx], ...remRec };
              } else {
                merged.push({
                  id: `REC-${remRec.studentId}-${remRec.session}`,
                  ...remRec,
                });
              }
            });
            return merged;
          });
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        localStorage.setItem('ar_last_sync_time', timeStr);
        setSyncStatus('success');
        setSyncMessage('Successfully synchronized reading data with Google Sheets!');

        // Add activity
        setActivities((prev) => [
          {
            id: `ACT-${Date.now()}`,
            title: 'Google Sheets sync completed',
            timestamp: 'Just now',
            type: 'upload',
          },
          ...prev,
        ]);
      } else {
        setSyncStatus('error');
        setSyncMessage(data.error || data.message || 'Unable to parse Google Sheet payload');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(err.message || 'Network error communicating with Google Apps Script');
    } finally {
      setIsSyncing(false);
    }
  };

  // Add new student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudent(newStudent);

    // Also push baseline session record
    const baseRecord: ReadingSessionRecord = {
      id: `REC-${newStudent.id}-S5`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      class: newStudent.class,
      session: 'Session 5',
      readingTextId: 'READ-05',
      readingTextTitle: 'The Importance of Renewable Energy',
      textType: 'Expository',
      textLevel: 'B1',
      readingScore: newStudent.readingScore,
      mainIdeaScore: newStudent.mainIdea,
      specificInformationScore: newStudent.specificInfo,
      inferenceScore: newStudent.inference,
      vocabularyScore: newStudent.vocabulary,
      taskCompletionPercent: 85,
      responseTimeSeconds: 120,
      engagement: newStudent.engagement,
      confidence: newStudent.confidence,
      readingAnxiety: newStudent.anxiety,
      motivation: newStudent.motivation,
      performanceLevel: newStudent.level,
      date: new Date().toISOString().split('T')[0],
    };
    setSessions((prev) => [baseRecord, ...prev]);

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: `Added student ${newStudent.name} (${newStudent.id})`,
        timestamp: 'Just now',
        type: 'upload',
      },
      ...prev,
    ]);
  };

  // Add new reading session record
  const handleAddReadingSessionRecord = (record: ReadingSessionRecord) => {
    setSessions((prev) => [record, ...prev]);

    // Update student's snapshot if it's the latest session
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === record.studentId) {
          return {
            ...s,
            readingScore: record.readingScore,
            mainIdea: record.mainIdeaScore,
            specificInfo: record.specificInformationScore,
            inference: record.inferenceScore,
            vocabulary: record.vocabularyScore,
            engagement: record.engagement,
            confidence: record.confidence,
            anxiety: record.readingAnxiety,
            motivation: record.motivation,
            level: record.performanceLevel,
          };
        }
        return s;
      })
    );

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: `Reading session recorded for ${record.studentName} (${record.session})`,
        timestamp: 'Just now',
        type: 'upload',
      },
      ...prev,
    ]);
  };

  // Update Teacher Decision (Human-in-the-Loop)
  const handleUpdateDecision = (
    studentId: string,
    decision: 'Accept' | 'Modify' | 'Reject',
    comment?: string,
    modifiedActions?: string[]
  ) => {
    setInsights((prev) => {
      const existing = prev.find((ins) => ins.studentId === studentId);
      const studentObj = students.find((s) => s.id === studentId);

      if (existing) {
        return prev.map((ins) => {
          if (ins.studentId === studentId) {
            return {
              ...ins,
              teacherDecision: decision as DecisionStatus,
              teacherComment: comment || ins.teacherComment,
              suggestedActions: modifiedActions || ins.suggestedActions,
              updatedAt: 'Just now',
            };
          }
          return ins;
        });
      } else {
        const newInsight: AIInsightRecord = {
          id: `INS-${studentId}`,
          studentId,
          studentName: studentObj?.name || 'Student',
          class: studentObj?.class || 'VIII-A',
          session: 'Session 5',
          priority: 'Medium',
          detectedPattern: 'Targeted pedagogical observation',
          evidence: `Reading Score: ${studentObj?.readingScore || 75}`,
          aiInsight: `${studentObj?.name} demonstrates targeted reading performance.`,
          suggestedActions: modifiedActions || [
            'Provide texts with contextual vocabulary.',
            'Maintain regular comprehension checks.',
          ],
          teacherDecision: decision as DecisionStatus,
          teacherComment: comment || '',
          updatedAt: 'Just now',
        };
        return [newInsight, ...prev];
      }
    });

    const targetStudent = students.find((s) => s.id === studentId);
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        title: `Teacher ${decision.toLowerCase()}ed recommendation for ${targetStudent?.name || studentId}`,
        timestamp: 'Just now',
        type: 'decision',
      },
      ...prev,
    ]);
  };

  // Call server-side Gemini endpoint for a student
  const handleRefreshGeminiInsight = async (student: Student) => {
    setIsLoadingAI(true);
    try {
      const studentSessions = sessions.filter((s) => s.studentId === student.id);
      const latestSession = studentSessions[studentSessions.length - 1];

      const res = await fetch('/api/ai/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          sessionData: latestSession,
          teacherObservation: 'Observed during Session 5 reading task.',
        }),
      });

      if (!res.ok) {
        throw new Error('AI analysis failed');
      }

      const aiResult = await res.json();

      setInsights((prev) => {
        const filtered = prev.filter((i) => i.studentId !== student.id);
        const updated: AIInsightRecord = {
          id: `INS-${student.id}-${Date.now().toString().slice(-4)}`,
          studentId: student.id,
          studentName: student.name,
          class: student.class,
          session: latestSession?.session || 'Session 5',
          priority: aiResult.priority || 'Medium',
          detectedPattern: aiResult.detectedPattern || 'Identified Reading Pattern',
          evidence: aiResult.evidence || `Overall: ${student.readingScore}`,
          aiInsight: aiResult.aiInsight,
          suggestedActions: aiResult.suggestedActions || [
            'Provide contextual vocabulary glossaries.',
            'Scaffold inference questions.',
          ],
          teacherDecision: 'Pending',
          teacherComment: '',
          updatedAt: 'Just now',
        };
        return [updated, ...filtered];
      });

      setActivities((prev) => [
        {
          id: `ACT-${Date.now()}`,
          title: `AI analysis refreshed for ${student.name}`,
          timestamp: 'Just now',
          type: 'ai',
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error generating AI insight:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Re-run AI analysis for all students in class
  const handleRefreshAllInsights = async () => {
    setIsLoadingAI(true);
    try {
      // Pick a sample of 3 students needing fresh evaluation
      const studentsToEvaluate = students.slice(0, 5);
      for (const st of studentsToEvaluate) {
        await handleRefreshGeminiInsight(st);
      }
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Reset to initial 30 demo students
  const handleResetDemoData = () => {
    localStorage.removeItem('ar_students_data');
    localStorage.removeItem('ar_sessions_data');
    localStorage.removeItem('ar_insights_data');
    localStorage.removeItem('ar_activities_data');
    setStudents(INITIAL_STUDENTS);
    setSessions(generateInitialSessions(INITIAL_STUDENTS));
    setInsights(INITIAL_AI_INSIGHTS);
    setActivities(INITIAL_ACTIVITIES);
    setSelectedStudent(INITIAL_STUDENTS[0]);
  };

  const handleExportFullBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      students,
      sessions,
      insights,
      activities,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english_reading_dashboard_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportBackup = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.students) setStudents(data.students);
      if (data.sessions) setSessions(data.sessions);
      if (data.insights) setInsights(data.insights);
      if (data.activities) setActivities(data.activities);
      alert('Backup restored successfully!');
    } catch (e) {
      alert('Invalid backup JSON file.');
    }
  };

  // Extract unique dates for header filter
  const uniqueStudentDates = Array.from(
    new Set(students.map((s) => s.date).filter(Boolean))
  ).sort().reverse();

  // Dynamic unique schools list from data & configuration
  const uniqueSchools = Array.from(
    new Set([selectedSchool, ...students.map((s) => s.school).filter(Boolean)])
  ).sort();

  // Dynamic unique classes list from data & configuration
  const uniqueClasses = Array.from(
    new Set([
      selectedClass !== 'All' ? selectedClass : '',
      ...students.map((s) => s.class).filter(Boolean),
      ...sessions.map((s) => s.class).filter(Boolean),
    ].filter(Boolean))
  ).sort();

  // Sidebar Menu Items
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Reading Analytics', icon: BarChart3 },
    { name: 'AI Insights', icon: Sparkles },
    { name: 'Recommendations', icon: CheckSquare },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-800 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* FIXED LEFT SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#082B5F] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="p-6 pb-5 flex items-center justify-between border-b border-blue-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight leading-snug">AI English Reading</h2>
                <p className="text-[11px] text-blue-300/80 font-medium">Teacher Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-blue-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.name;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1677E8] text-white shadow-md shadow-blue-900/40 translate-x-1'
                      : 'text-blue-100/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300/80'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Motivational Quote Card matching Reference */}
        <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-blue-900/40 to-blue-950/60 p-4 border border-blue-800/40">
            <div className="flex items-center gap-2 mb-2 text-blue-300">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">Teacher's Creed</span>
            </div>
            <p className="text-xs font-medium italic text-blue-100/90 leading-relaxed">
              “Better understanding leads to better learning.”
            </p>
            <div className="mt-2 text-[10px] text-blue-300/60">AI recommends; teacher decides.</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* TOP HEADER BAR (Pristine, fixed height, never wraps) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Current View Title & School Context Badge */}
            <div className="flex items-center gap-2.5">
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight">{activeTab}</h2>
              <button
                onClick={() => setIsSchoolConfigOpen(true)}
                title="Klik untuk ubah / isi nama sekolah & kelas sendiri"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1677E8]"></span>
                <span>{selectedSchool} • {selectedClass}</span>
                <Pencil className="w-3 h-3 text-blue-500 opacity-70 group-hover:opacity-100 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Right Action Icons & Teacher Profile */}
          <div className="flex items-center gap-3">
            {/* Google Sheets Sync Button */}
            <button
              onClick={() => setIsAppsScriptModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Sheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Google Sheets Sync</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('AI Insights')}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {/* Teacher Profile */}
            <div
              onClick={() => setActiveTab('Settings')}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-85 transition-opacity"
              title="Ke Pengaturan Profil Guru"
            >
              <div className="w-9 h-9 rounded-full bg-[#082B5F] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                {teacherName
                  .split(' ')
                  .map((w) => w[0])
                  .filter(Boolean)
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'TC'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-extrabold text-xs text-slate-900 leading-tight">{teacherName}</p>
                <p className="text-[10px] text-slate-400 font-medium">English Teacher</p>
              </div>
            </div>
          </div>
        </header>

        {/* CLASSROOM CONTEXT & FILTER TOOLBAR (Dedicated single-row strip, never wraps awkwardly) */}
        <div className="bg-white/90 backdrop-blur-xs border-b border-slate-200/70 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          {/* Selectors Group */}
          <div className="flex items-center gap-2 shrink-0">
            {/* School Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <School className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">School:</span>
              <select
                value={selectedSchool}
                onChange={(e) => {
                  if (e.target.value === '__CUSTOM__') {
                    setIsSchoolConfigOpen(true);
                  } else {
                    setSelectedSchool(e.target.value);
                  }
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                {uniqueSchools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="__CUSTOM__">✏️ + Ketik / Isi Sendiri...</option>
              </select>
              <button
                type="button"
                onClick={() => setIsSchoolConfigOpen(true)}
                title="Ketik nama sekolah sendiri"
                className="p-0.5 text-slate-400 hover:text-[#1677E8] transition-colors rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            {/* Class Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="text-slate-400">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => {
                  if (e.target.value === '__CUSTOM__') {
                    setIsSchoolConfigOpen(true);
                  } else {
                    setSelectedClass(e.target.value);
                  }
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                <option value="All">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
                <option value="__CUSTOM__">✏️ + Ketik / Isi Sendiri...</option>
              </select>
              <button
                type="button"
                onClick={() => setIsSchoolConfigOpen(true)}
                title="Ketik nama kelas sendiri"
                className="p-0.5 text-slate-400 hover:text-[#1677E8] transition-colors rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>

            {/* Quick School & Class config button */}
            <button
              onClick={() => setIsSchoolConfigOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1677E8] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer shrink-0"
              title="Isi atau ubah nama sekolah & kelas sendiri"
            >
              <Pencil className="w-3 h-3" />
              <span>Isi Sekolah & Kelas</span>
            </button>

            {/* Date Selector (Filter Tanggal) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-200 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#1677E8]" />
              <span className="text-[#1677E8] font-bold">Date:</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Dates</option>
                {uniqueStudentDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="Custom">Custom...</option>
              </select>
              {selectedDate === 'Custom' && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-white border border-blue-300 rounded px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none"
                />
              )}
            </div>

            {/* Reading Text Selector */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 max-w-xs">
              <span className="text-slate-400 shrink-0">Reading Text:</span>
              <select
                value={selectedReadingText}
                onChange={(e) => setSelectedReadingText(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer truncate max-w-[170px]"
              >
                {READING_TEXTS.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Selector */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="text-slate-400">Session:</span>
              <select
                value={selectedSessionRange}
                onChange={(e) => setSelectedSessionRange(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Session 1–5">Session 1–5</option>
                <option value="Session 5">Session 5</option>
                <option value="Session 4">Session 4</option>
                <option value="Session 3">Session 3</option>
                <option value="Session 2">Session 2</option>
                <option value="Session 1">Session 1</option>
              </select>
            </div>

            {/* Reset Filters Pill */}
            {(selectedDate !== 'All' || selectedSchool !== 'SMP Negeri 1' || selectedClass !== 'VIII-A' || selectedGrade !== 'All' || selectedActiveStatus !== 'All') && (
              <button
                onClick={() => {
                  setSelectedSchool('SMP Negeri 1');
                  setSelectedClass('VIII-A');
                  setSelectedDate('All');
                  setCustomDate('');
                  setSelectedGrade('All');
                  setSelectedActiveStatus('All');
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer border border-rose-200"
                title="Reset filters to default"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{students.length} Students • Active Term</span>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'Dashboard' && (
            <DashboardView
              students={students}
              sessions={sessions}
              insights={insights}
              activities={activities}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onViewStudentDetail={(stu) => {
                setDetailStudent(stu);
                setIsDetailOpen(true);
              }}
              onUpdateDecision={handleUpdateDecision}
              onRefreshGeminiInsight={handleRefreshGeminiInsight}
              isLoadingAI={isLoadingAI}
              onNavigateToTab={setActiveTab}
              selectedClass={selectedClass}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              schoolName={selectedSchool}
              teacherName={teacherName}
            />
          )}

          {activeTab === 'Students' && (
            <StudentsView
              students={students}
              onOpenAddStudent={() => setIsAddStudentOpen(true)}
              onViewStudentDetail={(stu) => {
                setDetailStudent(stu);
                setIsDetailOpen(true);
              }}
              selectedClass={selectedClass}
              onToggleActive={handleToggleStudentActive}
              initialDateFilter={selectedDate}
            />
          )}

          {activeTab === 'Reading Analytics' && (
            <ReadingAnalyticsView
              students={students}
              sessions={sessions}
              onOpenAddSession={() => setIsAddSessionOpen(true)}
              selectedClass={selectedClass}
            />
          )}

          {activeTab === 'AI Insights' && (
            <AIInsightsView
              students={students}
              insights={insights}
              onSelectStudent={(stu) => {
                setSelectedStudent(stu);
              }}
              onNavigateToTab={setActiveTab}
              onRefreshAllInsights={handleRefreshAllInsights}
              isLoadingAI={isLoadingAI}
            />
          )}

          {activeTab === 'Recommendations' && (
            <RecommendationsView
              insights={insights}
              students={students}
              onUpdateDecision={handleUpdateDecision}
            />
          )}

          {activeTab === 'Reports' && (
            <ReportsView
              students={students}
              sessions={sessions}
              insights={insights}
              selectedClass={selectedClass}
              schoolName={selectedSchool}
              teacherName={teacherName}
            />
          )}

          {activeTab === 'Settings' && (
            <SettingsView
              scriptUrl={scriptUrl}
              onSaveScriptUrl={handleSaveScriptUrl}
              onSyncNow={handleSyncGoogleSheet}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onResetDemoData={handleResetDemoData}
              onExportFullBackup={handleExportFullBackup}
              onImportBackup={handleImportBackup}
              schoolName={selectedSchool}
              onSaveSchoolName={setSelectedSchool}
              className={selectedClass}
              onSaveClassName={setSelectedClass}
              teacherName={teacherName}
              onSaveTeacherName={setTeacherName}
              onUpdateAllStudents={handleUpdateAllStudentsSchoolAndClass}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={handleAddStudent}
        defaultClass={selectedClass}
        defaultSchool={selectedSchool}
        defaultTeacher={teacherName}
        knownSchools={uniqueSchools}
        knownClasses={uniqueClasses}
      />

      <SchoolClassConfigModal
        isOpen={isSchoolConfigOpen}
        onClose={() => setIsSchoolConfigOpen(false)}
        currentSchool={selectedSchool}
        currentClass={selectedClass}
        currentTeacher={teacherName}
        knownSchools={uniqueSchools}
        knownClasses={uniqueClasses}
        onSave={(newSchool, newCls, newTeacher, updateExisting) => {
          if (updateExisting) {
            handleUpdateAllStudentsSchoolAndClass(newSchool, newCls, newTeacher);
          } else {
            setSelectedSchool(newSchool);
            setSelectedClass(newCls);
            setTeacherName(newTeacher);
          }
        }}
      />

      <AddReadingSessionModal
        isOpen={isAddSessionOpen}
        onClose={() => setIsAddSessionOpen(false)}
        students={students}
        onAddSessionRecord={handleAddReadingSessionRecord}
        defaultSession="Session 5"
      />

      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={detailStudent}
        sessions={sessions}
        insight={insights.find((i) => i.studentId === detailStudent?.id)}
      />

      <AppsScriptSyncModal
        isOpen={isAppsScriptModalOpen}
        onClose={() => setIsAppsScriptModalOpen(false)}
        scriptUrl={scriptUrl}
        onSaveScriptUrl={handleSaveScriptUrl}
        onSyncNow={handleSyncGoogleSheet}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        syncStatus={syncStatus}
        syncMessage={syncMessage}
      />
    </div>
  );
}
