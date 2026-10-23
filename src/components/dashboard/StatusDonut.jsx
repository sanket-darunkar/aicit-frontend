import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fmt } from './dashboardTheme.js';

/**
 * Donut chart with a centered total and a compact legend.
 *
 * props:
 *  - data   : [{ name, value, color }]
 *  - total  : optional number for the center (defaults to sum of values)
 *  - unit   : center label under the total (e.g. 'certificates')
 *  - loading: boolean
 */
export default function StatusDonut({ data = [], total, unit = '', loading }) {
  const items = data.filter(d => d.value > 0);
  const sum = total ?? data.reduce((a, d) => a + (d.value || 0), 0);

  if (loading) {
    return <div className="h-56 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full border-8 border-gray-100 border-t-primary-200 animate-spin" />
    </div>;
  }

  if (items.length === 0) {
    return <div className="h-56 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-2">📊</div>
      <p className="text-sm text-gray-400">No data yet</p>
    </div>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-44 h-44 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={items} dataKey="value" nameKey="name"
                 innerRadius={56} outerRadius={80} paddingAngle={2}
                 strokeWidth={0} startAngle={90} endAngle={-270}>
              {items.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip
              formatter={(v, n) => [fmt(v), n]}
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0',
                              fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-heading font-extrabold text-gray-900 tabular-nums">{fmt(sum)}</span>
          {unit && <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{unit}</span>}
        </div>
      </div>
      <ul className="flex-1 w-full space-y-1.5">
        {data.map((d, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="font-semibold text-gray-900 tabular-nums">{fmt(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
