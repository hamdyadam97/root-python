import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';

interface Props {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: { value: number; positive: boolean };
  color: string;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, suffix = '', prefix = '', trend, color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:shadow-none"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-secondary dark:text-white">
            <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
          </p>
          {trend && (
            <p className={`mt-2 inline-flex items-center gap-1 text-xs font-bold ${trend.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-6 -end-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}
