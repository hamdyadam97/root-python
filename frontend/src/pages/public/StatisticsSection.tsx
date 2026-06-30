import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  value: number;
  label: string;
  icon: LucideIcon;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

function useCountUp(end: number, duration = 2.5, decimals = 0) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration, decimals]);

  return { count, ref };
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const Icon = stat.icon;
  const { count, ref } = useCountUp(stat.value, 2.2, stat.decimals ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white hover:shadow-xl sm:p-7"
    >
      {/* gradient top border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* soft glow */}
      <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Icon size={28} />
        </div>
        <p className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl">
          {stat.prefix ?? ''}
          <span ref={ref}>{count.toLocaleString()}</span>
          {stat.suffix ?? ''}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
      </div>
    </motion.div>
  );
}

interface StatisticsSectionProps {
  stats: StatItem[];
}

export function StatisticsSection({ stats }: StatisticsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* subtle medical pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #002770 1.5px, transparent 1.5px), radial-gradient(circle at 75% 75%, #06BFB0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* background shapes */}
      <div className="pointer-events-none absolute -start-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -end-20 bottom-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
          >
            {t('statistics.badge', 'Our Impact')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-secondary sm:text-4xl"
          >
            {t('statistics.title', 'Trusted by Healthcare Professionals')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
          >
            {t(
              'statistics.subtitle',
              'Join thousands of medical professionals advancing their careers through our accredited training and exam preparation packages.'
            )}
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} stat={stat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
