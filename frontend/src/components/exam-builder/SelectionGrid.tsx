import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { Check } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  available_questions?: number;
}

interface Props {
  title: string;
  items: Item[];
  selected: number[];
  onToggle: (id: number) => void;
  iconFn?: (name: string) => LucideIcon;
  showAll?: boolean;
  onSelectAll?: () => void;
}

export function SelectionGrid({ title, items, selected, onToggle, iconFn, showAll, onSelectAll }: Props) {
  const { t } = useTranslation();

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800">
        <p>{t('common.noData', 'No options available')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-secondary dark:text-white">{title}</h3>
        {showAll && onSelectAll && (
          <button
            type="button"
            onClick={onSelectAll}
            className="text-sm font-bold text-primary hover:underline"
          >
            {t('examBuilder.selection.all')}
          </button>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = iconFn?.(item.name);
          const isSelected = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={clsx(
                'relative flex items-start gap-4 rounded-2xl border p-5 text-start transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md dark:border-primary dark:bg-primary/10'
                  : 'border-slate-100 bg-white hover:-translate-y-0.5 hover:border-primary hover:shadow-md dark:border-slate-700 dark:bg-slate-800'
              )}
            >
              {isSelected && (
                <span className="absolute end-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Check size={14} />
                </span>
              )}
              {Icon && (
                <div className={clsx(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                )}>
                  <Icon size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-secondary dark:text-white">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('examBuilder.selection.availableQuestions', { count: item.available_questions ?? 0 })}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
