import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/dashboard/AnimatedCounter';

interface Props {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay?: number;
}

export function AdminStatCard({ icon: Icon, label, value, suffix = '', color, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-800 dark:text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
