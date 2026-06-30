import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { Clock, Timer } from 'lucide-react';

const options = [
  { key: 'automatic', icon: Clock },
  { key: 'min30', icon: Timer, value: 30 },
  { key: 'min45', icon: Timer, value: 45 },
  { key: 'min60', icon: Timer, value: 60 },
  { key: 'min90', icon: Timer, value: 90 },
  { key: 'unlimited', icon: Clock, value: 0 },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function DurationSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.duration.title')}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {options.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all',
                active
                  ? 'border-primary bg-primary/5 shadow-md dark:border-primary dark:bg-primary/10'
                  : 'border-slate-100 bg-white hover:border-primary dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              <Icon size={22} className={active ? 'text-primary' : 'text-slate-400'} />
              <span className="text-xs font-bold text-secondary dark:text-white">{t(`examBuilder.duration.${opt.key}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
