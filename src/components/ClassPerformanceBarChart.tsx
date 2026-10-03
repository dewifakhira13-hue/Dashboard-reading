import React from 'react';
import { ReadingSessionRecord } from '../types';

interface Props {
  sessions: ReadingSessionRecord[];
}

export const ClassPerformanceBarChart: React.FC<Props> = ({ sessions }) => {
  const sessionNames = ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'];
  const labels = ['S1', 'S2', 'S3', 'S4', 'S5'];

  // Aggregate averages per session
  const data = sessionNames.map((sName) => {
    const sessionItems = sessions.filter((s) => s.session === sName);
    const count = sessionItems.length || 1;
    const mainIdea = Math.round(sessionItems.reduce((acc, curr) => acc + curr.mainIdeaScore, 0) / count);
    const specificInfo = Math.round(sessionItems.reduce((acc, curr) => acc + curr.specificInformationScore, 0) / count);
    const inference = Math.round(sessionItems.reduce((acc, curr) => acc + curr.inferenceScore, 0) / count);
    const vocab = Math.round(sessionItems.reduce((acc, curr) => acc + curr.vocabularyScore, 0) / count);

    return {
      name: sName,
      mainIdea: mainIdea || 82,
      specificInfo: specificInfo || 78,
      inference: inference || 65,
      vocab: vocab || 58,
    };
  });

  const maxHeight = 160; // pixels for 100%

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <h3 className="font-bold text-slate-800 text-sm">Class Performance Overview</h3>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1677E8]"></span>
            <span>Main Idea</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#20B486]"></span>
            <span>Specific Information</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F5A623]"></span>
            <span>Inference</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#7654E8]"></span>
            <span>Vocabulary in Context</span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative pt-6 pb-2">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 pl-6 pr-2">
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>100</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>80</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>60</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>40</span>
          </div>
          <div className="border-b border-slate-100 flex items-center justify-between pb-0.5">
            <span>20</span>
          </div>
          <div className="border-b border-slate-200 flex items-center justify-between pb-0.5">
            <span>0</span>
          </div>
        </div>

        {/* Bars */}
        <div className="relative z-10 flex items-end justify-between pl-8 pr-2 h-[160px]">
          {data.map((item, idx) => (
            <div key={item.name} className="flex flex-col items-center gap-1.5 group">
              <div className="flex items-end gap-1">
                {/* Main Idea Bar */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mb-0.5">
                    {item.mainIdea}
                  </span>
                  <div
                    style={{ height: `${(item.mainIdea / 100) * maxHeight}px` }}
                    className="w-3 rounded-t-xs bg-[#1677E8] transition-all duration-300 hover:brightness-110"
                    title={`Main Idea: ${item.mainIdea}%`}
                  ></div>
                </div>

                {/* Specific Information Bar */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mb-0.5">
                    {item.specificInfo}
                  </span>
                  <div
                    style={{ height: `${(item.specificInfo / 100) * maxHeight}px` }}
                    className="w-3 rounded-t-xs bg-[#20B486] transition-all duration-300 hover:brightness-110"
                    title={`Specific Information: ${item.specificInfo}%`}
                  ></div>
                </div>

                {/* Inference Bar */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mb-0.5">
                    {item.inference}
                  </span>
                  <div
                    style={{ height: `${(item.inference / 100) * maxHeight}px` }}
                    className="w-3 rounded-t-xs bg-[#F5A623] transition-all duration-300 hover:brightness-110"
                    title={`Inference: ${item.inference}%`}
                  ></div>
                </div>

                {/* Vocabulary Bar */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -mb-0.5">
                    {item.vocab}
                  </span>
                  <div
                    style={{ height: `${(item.vocab / 100) * maxHeight}px` }}
                    className="w-3 rounded-t-xs bg-[#7654E8] transition-all duration-300 hover:brightness-110"
                    title={`Vocabulary: ${item.vocab}%`}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600">{labels[idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
