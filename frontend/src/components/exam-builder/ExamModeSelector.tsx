import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Shuffle,
  BrainCircuit,
  XCircle,
  Bookmark,
  Heart,
  Timer,
} from 'lucide-react';

const modes = [
  { key: 'practice', icon: BookOpen },
  { key: 'mock', icon: ClipboardCheck },
  { key: 'final', icon: GraduationCap },
  { key: 'random', icon: Shuffle },
  { key: 'adaptive', icon: BrainCircuit },
  { key: 'wrongOnly', icon: XCircle },
  { key: 'savedOnly', icon: Bookmark },
  { key: 'favoritesOnly', icon: Heart },
  { key: 'timedPractice', icon: Timer },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ExamModeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.examMode.title')}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const active = value === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => onChange(mode.key)}
              className={clsx(
                'flex items-start gap-4 rounded-2xl border p-5 text-start transition-all duration-200',
                active
                  ? 'border-primary bg-primary/5 shadow-md dark:border-primary dark:bg-primary/10'
                  : 'border-slate-100 bg-white hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              <div className={clsx(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
              )}>
                <Icon size={22} />
              </div>
              <div>
                <p className="font-bold text-secondary dark:text-white">{t(`examBuilder.examMode.${mode.key}`)}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t(`examBuilder.examMode.${mode.key}Desc`, `${mode.key} mode`)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
