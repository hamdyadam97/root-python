import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, RotateCcw, ArrowRight } from 'lucide-react';

interface CardProps {
  icon: any;
  title: string;
  subtitle: string;
  progress: number;
  to: string;
  color: string;
  delay: number;
}

function ContinueCard({ icon: Icon, title, subtitle, progress, to, color, delay }: CardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <h4 className="text-lg font-bold text-secondary dark:text-white">{title}</h4>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{t('dashboard.progress', 'Progress')}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400"
          />
        </div>
      </div>
      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:gap-3"
      >
        {t('dashboard.continueLearning.continue')} <ArrowRight size={16} />
      </Link>
    </motion.div>
  );
}

export function ContinueLearning() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <ContinueCard
        icon={PlayCircle}
        title={t('dashboard.continueLearning.lastExam')}
        subtitle="Internal Medicine - Cardiology"
        progress={65}
        to="/user/exam"
        color="bg-rose-100 text-rose-600"
        delay={0.1}
      />
      <ContinueCard
        icon={BookOpen}
        title={t('dashboard.continueLearning.lastCourse')}
        subtitle="Pharmacology Mastery"
        progress={42}
        to="/courses"
        color="bg-blue-100 text-blue-600"
        delay={0.2}
      />
      <ContinueCard
        icon={RotateCcw}
        title={t('dashboard.continueLearning.practice')}
        subtitle="Weak questions review"
        progress={28}
        to="/user/exam/create"
        color="bg-emerald-100 text-emerald-600"
        delay={0.3}
      />
    </div>
  );
}
