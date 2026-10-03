import React from 'react';
import { Student } from '../types';

interface Props {
  students: Student[];
}

export const PerformanceDonutChart: React.FC<Props> = ({ students }) => {
  const total = students.length || 1;

  const excellentCount = students.filter((s) => s.readingScore >= 85).length;
  const goodCount = students.filter((s) => s.readingScore >= 70 && s.readingScore < 85).length;
  const fairCount = students.filter((s) => s.readingScore >= 55 && s.readingScore < 70).length;
  const needsSupportCount = students.filter((s) => s.readingScore < 55).length;

  const slices = [
    { label: 'Excellent (85–100)', count: excellentCount, color: '#20B486', pct: Math.round((excellentCount / total) * 100) },
    { label: 'Good (70–84)', count: goodCount, color: '#1677E8', pct: Math.round((goodCount / total) * 100) },
    { label: 'Fair (55–69)', count: fairCount, color: '#F5A623', pct: Math.round((fairCount / total) * 100) },
    { label: 'Needs Support (<55)', count: needsSupportCount, color: '#F06A87', pct: Math.round((needsSupportCount / total) * 100) },
  ];

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-purple-50 text-purple-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </span>
        <h3 className="font-bold text-slate-800 text-sm">Performance Level Distribution</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Donut Chart SVG */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {slices.map((slice, idx) => {
              const strokeDasharray = `${(slice.pct / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slice.pct;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out hover:opacity-85"
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-extrabold text-slate-800 leading-tight">{total}</span>
            <span className="text-[11px] font-medium text-slate-500">Students</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 text-xs flex-1">
          {slices.map((slice, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                <span className="text-slate-600 font-medium text-[11px]">{slice.label}</span>
              </div>
              <span className="font-bold text-slate-700 text-xs">
                {slice.count} <span className="text-slate-400 font-normal">({slice.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
