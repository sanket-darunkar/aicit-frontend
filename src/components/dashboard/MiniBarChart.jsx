import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { fmt } from './dashboardTheme.js';

/**
 * Horizontal-friendly vertical bar chart for small categorical breakdowns.
 *
 * props:
 *  - data    : [{ name, value, color }]
 *  - loading : boolean
 *  - height  : px (default 220)
 */
export default function MiniBarChart({ data = [], loading, height = 220 }) {
  if (loading) {
    return <div style={{ height }} className="flex items-center justify-center">
      <div className="w-full space-y-3 px-2">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" style={{ width: `${90 - i * 15}%` }} />
        ))}
      </div>
    </div>;
  }

  const hasData = data.some(d => d.value > 0);
  if (!hasData) {
    return <div style={{ height }} className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-2">📈</div>
      <p className="text-sm text-gray-400">No data yet</p>
    </div>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'rgba(59,130,246,0.06)' }}
          formatter={(v) => [fmt(v), 'Count']}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0',
                          fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
