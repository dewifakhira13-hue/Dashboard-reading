import React from 'react';
import { ReadingSessionRecord } from '../types';

interface Props {
  sessions: ReadingSessionRecord[];
}

export const EngagementAffectiveLineChart: React.FC<Props> = ({ sessions }) => {
  const sessionNames = ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'];
  const labels = ['S1', 'S2', 'S3', 'S4', 'S5'];

  const stats = sessionNames.map((sName) => {
    const list = sessions.filter((s) => s.session === sName);
    const count = list.length || 1;
    const avgEng = +(list.reduce((acc, curr) => acc + curr.engagement, 0) / count).toFixed(1);
    const avgConf = +(list.reduce((acc, curr) => acc + curr.confidence, 0) / count).toFixed(1);
    const avgAnx = +(list.reduce((acc, curr) => acc + curr.readingAnxiety, 0) / count).toFixed(1);

    return {
      name: sName,
      engagement: avgEng || 3.8,
      confidence: avgConf || 3.6,
      anxiety: avgAnx || 2.1,
    };
  });

  const chartWidth = 320;
  const chartHeight = 150;
  const yMin = 1;
  const yMax = 5;

  const getX = (index: number) => 35 + (index * (chartWidth - 60)) / 4;
  const getY = (val: number) => chartHeight - 24 - ((val - yMin) / (yMax - yMin)) * (chartHeight - 44);

  const engagementPoints = stats.map((d, i) => `${getX(i)},${getY(d.engagement)}`).join(' ');
  const confidencePoints = stats.map((d, i) => `${getX(i)},${getY(d.confidence)}`).join(' ');
  const anxietyPoints = stats.map((d, i) => `${getX(i)},${getY(d.anxiety)}`).join(' ');

  return (
    <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded-md bg-pink-50 text-pink-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          <h3 className="font-bold text-slate-800 text-sm">Engagement & Affective Indicators</h3>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#1677E8] rounded-full"></span>
            <span className="w-2 h-2 rounded-full bg-[#1677E8] -ml-2"></span>
            <span>Engagement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#20B486] rounded-full"></span>
            <span className="w-2 h-2 rounded-full bg-[#20B486] -ml-2"></span>
            <span>Confidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#F5A623] rounded-full"></span>
            <span className="w-2 h-2 rounded-full bg-[#F5A623] -ml-2"></span>
            <span className="text-[#D98200] font-medium">Anxiety (lower is better)</span>
          </div>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="relative w-full flex items-center justify-center">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[155px]">
          {/* Y Grid lines */}
          {[1, 2, 3, 4, 5].map((level) => {
            const yPos = getY(level);
            return (
              <g key={level}>
                <line x1="25" y1={yPos} x2={chartWidth - 10} y2={yPos} stroke="#F1F5F9" strokeWidth="1" />
                <text x="14" y={yPos + 3.5} textAnchor="end" fontSize="9" fill="#94A3B8">
                  {level}
                </text>
              </g>
            );
          })}

          {/* X axis labels */}
          {labels.map((lbl, idx) => (
            <text key={lbl} x={getX(idx)} y={chartHeight - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748B">
              {lbl}
            </text>
          ))}

          {/* Engagement Line */}
          <polyline fill="none" stroke="#1677E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={engagementPoints} />
          {stats.map((d, i) => (
            <g key={`eng-${i}`}>
              <circle cx={getX(i)} cy={getY(d.engagement)} r="4" fill="#FFFFFF" stroke="#1677E8" strokeWidth="2" />
              {i === stats.length - 1 && (
                <text x={getX(i) + 8} y={getY(d.engagement) + 3} fontSize="9" fontWeight="bold" fill="#1677E8">
                  {d.engagement}
                </text>
              )}
            </g>
          ))}

          {/* Confidence Line */}
          <polyline fill="none" stroke="#20B486" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={confidencePoints} />
          {stats.map((d, i) => (
            <g key={`conf-${i}`}>
              <circle cx={getX(i)} cy={getY(d.confidence)} r="4" fill="#FFFFFF" stroke="#20B486" strokeWidth="2" />
              {i === stats.length - 1 && (
                <text x={getX(i) + 8} y={getY(d.confidence) + 3} fontSize="9" fontWeight="bold" fill="#20B486">
                  {d.confidence}
                </text>
              )}
            </g>
          ))}

          {/* Anxiety Line */}
          <polyline fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={anxietyPoints} />
          {stats.map((d, i) => (
            <g key={`anx-${i}`}>
              <circle cx={getX(i)} cy={getY(d.anxiety)} r="4" fill="#FFFFFF" stroke="#F5A623" strokeWidth="2" />
              {i === stats.length - 1 && (
                <text x={getX(i) + 8} y={getY(d.anxiety) + 3} fontSize="9" fontWeight="bold" fill="#F5A623">
                  {d.anxiety}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
