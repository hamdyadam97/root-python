import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const levels = ['easy', 'medium', 'hard', 'mixed'] as const;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function DifficultySelector({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.difficulty.title')}</h3>
      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={clsx(
              'rounded-xl px-6 py-2.5 text-sm font-bold transition',
              value === level
                ? 'bg-secondary text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            {t(`examBuilder.difficulty.${level}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
