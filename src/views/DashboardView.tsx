import React from 'react';
import { Student, ReadingSessionRecord, AIInsightRecord, ActivityItem } from '../types';
import { Users, BookOpen, Target, Heart, Smile, TrendingUp, Sparkles } from 'lucide-react';
import { ClassPerformanceBarChart } from '../components/ClassPerformanceBarChart';
import { PerformanceDonutChart } from '../components/PerformanceDonutChart';
import { EngagementAffectiveLineChart } from '../components/EngagementAffectiveLineChart';
import { StudentTable } from '../components/StudentTable';
import { AIInsightPanel } from '../components/AIInsightPanel';

interface Props {
  students: Student[];
  sessions: ReadingSessionRecord[];
  insights: AIInsightRecord[];
  activities: ActivityItem[];
  selectedStudent: Student;
  onSelectStudent: (student: Student) => void;
  onViewStudentDetail: (student: Student) => void;
  onUpdateDecision: (studentId: string, decision: 'Accept' | 'Modify' | 'Reject', comment?: string, modifiedActions?: string[]) => void;
  onRefreshGeminiInsight: (student: Student) => Promise<void>;
  isLoadingAI: boolean;
  onNavigateToTab: (tab: string) => void;
  selectedClass: string;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  teacherName?: string;
  schoolName?: string;
}

export const DashboardView: React.FC<Props> = ({
  students,
  sessions,
  insights,
  activities,
  selectedStudent,
  onSelectStudent,
  onViewStudentDetail,
  onUpdateDecision,
  onRefreshGeminiInsight,
  isLoadingAI,
  onNavigateToTab,
  selectedClass,
  selectedDate = 'All',
  onDateChange,
  teacherName = 'Ms. Dewi',
  schoolName = 'SMP Negeri 1',
}) => {
  // Compute KPI metrics dynamically from students and sessions with class and date filtering
  const classStudents = students.filter((s) => {
    const matchClass = selectedClass === 'All' || s.class === selectedClass;
    let matchDate = true;
    if (selectedDate && selectedDate !== 'All') {
      matchDate = s.date === selectedDate;
    }
    return matchClass && matchDate;
  });

  const totalStudents = classStudents.length;
  const currentStudentsList = classStudents.length > 0 ? classStudents : students;

  // Average Reading Score
  const avgReadingScore = (
    currentStudentsList.reduce((acc, curr) => acc + curr.readingScore, 0) / (currentStudentsList.length || 1)
  ).toFixed(1);

  // Latest session completion
  const s5Sessions = sessions.filter((s) => s.session === 'Session 5');
  const avgTaskCompletion = (
    (s5Sessions.length > 0
      ? s5Sessions.reduce((acc, curr) => acc + curr.taskCompletionPercent, 0) / s5Sessions.length
      : 85.7)
  ).toFixed(1);

  // Average Confidence
  const avgConfidence = (
    currentStudentsList.reduce((acc, curr) => acc + curr.confidence, 0) / (currentStudentsList.length || 1)
  ).toFixed(1);

  // Average Engagement
  const avgEngagement = (
    currentStudentsList.reduce((acc, curr) => acc + curr.engagement, 0) / (currentStudentsList.length || 1)
  ).toFixed(1);

  // Currently selected student's insight
  const currentInsight = insights.find((ins) => ins.studentId === selectedStudent.id);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Welcome, {teacherName}! <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Here is an overview of {schoolName} students' English reading performance.
        </p>
      </div>

      {/* Five Pastel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Students (Pastel Blue) */}
        <div className="bg-[#EBF3FF] rounded-2xl p-4.5 border border-blue-100/60 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-[#1677E8] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1677E8]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Class {selectedClass} • {schoolName}
            </p>
          </div>
        </div>

        {/* KPI 2: Average Reading Score (Pastel Green) */}
        <div className="bg-[#E8F8F3] rounded-2xl p-4.5 border border-emerald-100/60 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Average Reading Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#20B486] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#20B486]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{avgReadingScore}</span>
              <span className="text-xs font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-[11px] font-semibold text-[#1E9B73] flex items-center gap-1 mt-0.5">
              <span>↑ 6.2</span>
              <span className="font-normal text-slate-500">vs. last session</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Avg. Task Completion (Pastel Orange) */}
        <div className="bg-[#FEF6EB] rounded-2xl p-4.5 border border-amber-100/60 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Avg. Task Completion</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-[#F5A623] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#F5A623]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{avgTaskCompletion}%</span>
            </div>
            <p className="text-[11px] font-semibold text-[#D98200] flex items-center gap-1 mt-0.5">
              <span>↑ 5.1%</span>
              <span className="font-normal text-slate-500">vs. last session</span>
            </p>
          </div>
        </div>

        {/* KPI 4: Avg. Confidence (Pastel Pink) */}
        <div className="bg-[#FDEEF1] rounded-2xl p-4.5 border border-rose-100/60 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Avg. Confidence</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-[#F06A87] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#F06A87]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{avgConfidence}</span>
              <span className="text-xs font-semibold text-slate-500">/ 5</span>
            </div>
            <p className="text-[11px] font-semibold text-[#D9385C] flex items-center gap-1 mt-0.5">
              <span>↑ 0.3</span>
              <span className="font-normal text-slate-500">vs. last session</span>
            </p>
          </div>
        </div>

        {/* KPI 5: Avg. Engagement (Pastel Purple) */}
        <div className="bg-[#F2EEFD] rounded-2xl p-4.5 border border-purple-100/60 shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Avg. Engagement</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-[#7654E8] flex items-center justify-center">
              <Smile className="w-5 h-5 text-[#7654E8]" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-900">{avgEngagement}</span>
              <span className="text-xs font-semibold text-slate-500">/ 5</span>
            </div>
            <p className="text-[11px] font-semibold text-[#7654E8] flex items-center gap-1 mt-0.5">
              <span>↑ 0.4</span>
              <span className="font-normal text-slate-500">vs. last session</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row Charts (3 Columns with responsive breathing room) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Class Performance Overview (Grouped Bar Chart) */}
        <div className="md:col-span-2 xl:col-span-1">
          <ClassPerformanceBarChart sessions={sessions} />
        </div>

        {/* Performance Level Distribution (Donut Chart) */}
        <div>
          <PerformanceDonutChart students={currentStudentsList} />
        </div>

        {/* Engagement & Affective Indicators (Line Chart) */}
        <div>
          <EngagementAffectiveLineChart sessions={sessions} />
        </div>
      </div>

      {/* Bottom Row: Student Performance Table (Left 2/3) + AI Insights Panel (Right 1/3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8">
          <StudentTable
            students={currentStudentsList}
            selectedStudentId={selectedStudent.id}
            onSelectStudent={onSelectStudent}
            onViewStudentDetail={onViewStudentDetail}
            externalDateFilter={selectedDate}
            onDateFilterChange={onDateChange}
          />
        </div>
        <div className="xl:col-span-4">
          <AIInsightPanel
            selectedStudent={selectedStudent}
            insight={currentInsight}
            activities={activities}
            onUpdateDecision={onUpdateDecision}
            onRefreshGeminiInsight={onRefreshGeminiInsight}
            isLoadingAI={isLoadingAI}
            onNavigateToTab={onNavigateToTab}
          />
        </div>
      </div>
    </div>
  );
};
