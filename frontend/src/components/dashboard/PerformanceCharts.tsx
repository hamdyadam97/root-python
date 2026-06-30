import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SectionCard } from './SectionCard';
import { useDarkMode } from '@/hooks/useDarkMode';

const monthlyData = [
  { name: 'Jan', score: 62, time: 12 },
  { name: 'Feb', score: 68, time: 15 },
  { name: 'Mar', score: 71, time: 18 },
  { name: 'Apr', score: 69, time: 14 },
  { name: 'May', score: 74, time: 20 },
  { name: 'Jun', score: 79, time: 22 },
];

const weeklyData = [
  { name: 'Mon', correct: 45, wrong: 12 },
  { name: 'Tue', correct: 52, wrong: 8 },
  { name: 'Wed', correct: 38, wrong: 15 },
  { name: 'Thu', correct: 60, wrong: 10 },
  { name: 'Fri', correct: 55, wrong: 9 },
  { name: 'Sat', correct: 48, wrong: 11 },
  { name: 'Sun', correct: 63, wrong: 7 },
];

const subjectData = [
  { name: 'Internal Medicine', value: 35 },
  { name: 'Surgery', value: 25 },
  { name: 'Pediatrics', value: 20 },
  { name: 'Pharmacology', value: 15 },
  { name: 'Pathology', value: 5 },
];

const tabs = ['monthlyProgress', 'averageScores', 'successRate', 'timeSpent', 'improvementTrend', 'dailyActivity', 'weeklyProgress'] as const;

export function PerformanceCharts() {
  const { t } = useTranslation();
  const { isDark } = useDarkMode();
  const [active, setActive] = useState<(typeof tabs)[number]>('monthlyProgress');

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const subjectColors = ['#06bfb0', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <SectionCard
      title={t('dashboard.performance.title')}
      action={
        <select
          value={active}
          onChange={(e) => setActive(e.target.value as any)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-secondary outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100"
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>{t(`dashboard.performance.${tab}`)}</option>
          ))}
        </select>
      }
      className="lg:col-span-3"
    >
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {active === 'monthlyProgress' || active === 'averageScores' || active === 'improvementTrend' ? (
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06bfb0" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#06bfb0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: isDark ? '#1e293b' : '#fff',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#06bfb0" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          ) : active === 'weeklyProgress' || active === 'dailyActivity' ? (
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: isDark ? '#1e293b' : '#fff',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                }}
              />
              <Bar dataKey="correct" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
              <Bar dataKey="wrong" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: isDark ? '#1e293b' : '#fff',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                }}
              />
              <Pie data={subjectData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                {subjectData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={subjectColors[i % subjectColors.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
