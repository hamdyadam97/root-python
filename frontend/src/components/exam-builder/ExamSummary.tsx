import { useTranslation } from 'react-i18next';
import { Rocket, Bookmark } from 'lucide-react';

interface Props {
  specialty: string;
  category: string;
  subcategory: string;
  topic: string;
  mode: string;
  difficulty: string;
  questionCount: number;
  duration: string;
  remainingAfter: number;
  onGenerate: () => void;
}

export function ExamSummary({
  specialty,
  category,
  subcategory,
  topic,
  mode,
  difficulty,
  questionCount,
  duration,
  remainingAfter,
  onGenerate,
}: Props) {
  const { t } = useTranslation();

  const rows = [
    { label: t('examBuilder.summary.specialty'), value: specialty || '-' },
    { label: t('examBuilder.summary.category'), value: category || '-' },
    { label: t('examBuilder.summary.subcategory'), value: subcategory || '-' },
    { label: t('examBuilder.summary.topic'), value: topic || '-' },
    { label: t('examBuilder.summary.mode'), value: mode ? t(`examBuilder.examMode.${mode}`) : '-' },
    { label: t('examBuilder.summary.difficulty'), value: difficulty ? t(`examBuilder.difficulty.${difficulty}`) : '-' },
    { label: t('examBuilder.summary.questions'), value: questionCount },
    { label: t('examBuilder.summary.duration'), value: duration ? t(`examBuilder.duration.${duration}`) : '-' },
    { label: t('examBuilder.summary.totalMarks'), value: questionCount },
    { label: t('examBuilder.summary.passingScore'), value: `${Math.round(questionCount * 0.6)} (${t('examBuilder.summary.passingScore')})` },
    { label: t('examBuilder.summary.willUse'), value: questionCount },
    { label: t('examBuilder.summary.remainingAfter'), value: remainingAfter },
  ];

  return (
    <div className="sticky top-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-secondary dark:text-white">
        <Bookmark size={20} className="text-primary" /> {t('examBuilder.summary.title')}
      </h3>

      <div className="mb-5 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-700/30">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{row.label}</span>
            <span className="text-sm font-bold text-secondary dark:text-white">{row.value}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-teal-500 py-4 text-base font-extrabold text-white shadow-lg shadow-primary/25 transition hover:shadow-xl"
      >
        <Rocket size={20} className="transition group-hover:-translate-y-1" />
        {t('examBuilder.summary.generate')}
      </button>

      <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
        {t('examBuilder.summary.consume', { count: questionCount })}
      </p>
    </div>
  );
}
