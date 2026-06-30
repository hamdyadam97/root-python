import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  delay?: number;
  className?: string;
}

export function SectionCard({ title, children, action, delay = 0, className = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800 dark:shadow-none ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-secondary dark:text-white">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}
