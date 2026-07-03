import React from 'react';
import { Card } from '../common';

const StatsCharts = ({ tasks = [] }) => {
  const total = tasks.length;

  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  const low = tasks.filter(t => t.priority === 'Low').length;
  const medium = tasks.filter(t => t.priority === 'Medium').length;
  const high = tasks.filter(t => t.priority === 'High').length;

  // Donut chart calculations
  const r = 50;
  const circ = 2 * Math.PI * r; // ~314.16

  const statusData = [
    { label: 'Completed', value: completed, color: '#22c55e', bgClass: 'bg-success-500' },
    { label: 'In Progress', value: inProgress, color: '#3b82f6', bgClass: 'bg-primary-500' },
    { label: 'Pending', value: pending, color: '#ea580c', bgClass: 'bg-warning-500' },
  ];

  let accumulatedPercent = 0;
  const donutSlices = statusData.map(item => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const strokeDashoffset = circ - (circ * percent) / 100;
    const rotation = (accumulatedPercent * 360) / 100;
    accumulatedPercent += percent;
    return {
      ...item,
      percent,
      strokeDashoffset,
      rotation,
    };
  });

  const priorityData = [
    { label: 'High Priority', value: high, colorClass: 'bg-danger-500', textClass: 'text-danger-600 dark:text-danger-400', pct: total > 0 ? (high / total) * 100 : 0 },
    { label: 'Medium Priority', value: medium, colorClass: 'bg-warning-500', textClass: 'text-warning-600 dark:text-warning-400', pct: total > 0 ? (medium / total) * 100 : 0 },
    { label: 'Low Priority', value: low, colorClass: 'bg-primary-500', textClass: 'text-primary-600 dark:text-primary-400', pct: total > 0 ? (low / total) * 100 : 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Status Donut Chart Card */}
      <Card className="p-6 sm:p-8 dark:bg-neutral-900 dark:border-neutral-800">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-6">Task Status Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
          {/* SVG Donut */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {total === 0 ? (
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={r}
                  fill="transparent"
                  stroke="#e5e5e5"
                  strokeWidth="14"
                  className="dark:stroke-neutral-800"
                />
              </svg>
            ) : (
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={idx}
                    cx="70"
                    cy="70"
                    r={r}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="14"
                    strokeDasharray={circ}
                    strokeDashoffset={slice.strokeDashoffset}
                    transform={`rotate(${slice.rotation} 70 70)`}
                    className="transition-all duration-500 ease-out origin-center"
                  />
                ))}
              </svg>
            )}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">{total}</span>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Tasks</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full sm:w-auto space-y-4">
            {donutSlices.map((slice, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full ${slice.bgClass}`} />
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{slice.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{slice.value}</span>
                  <span className="text-xs text-neutral-400 font-medium ml-1.5">({Math.round(slice.percent)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Priority Progress Bars Card */}
      <Card className="p-6 sm:p-8 dark:bg-neutral-900 dark:border-neutral-800">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-6">Priority Distribution</h3>
        <div className="space-y-6">
          {priorityData.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-neutral-700 dark:text-neutral-300">{item.label}</span>
                <span className={`${item.textClass} font-bold`}>
                  {item.value} <span className="text-xs text-neutral-400 font-normal ml-1">({Math.round(item.pct)}%)</span>
                </span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-4 overflow-hidden">
                <div
                  className={`${item.colorClass} h-full rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default StatsCharts;
