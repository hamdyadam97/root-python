import { clsx } from 'clsx';

interface Props {
  steps: string[];
  current: number;
  onChange?: (index: number) => void;
}

export function Stepper({ steps, current, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
      {steps.map((label, idx) => {
        const active = idx === current;
        const completed = idx < current;
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange?.(idx)}
            disabled={!onChange}
            className="group flex items-center gap-3 whitespace-nowrap"
          >
            <span
              className={clsx(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold transition',
                active ? 'bg-primary text-white shadow-lg shadow-primary/30' :
                completed ? 'bg-emerald-500 text-white' :
                'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
              )}
            >
              {completed ? '✓' : idx + 1}
            </span>
            <span
              className={clsx(
                'hidden text-sm font-bold md:block',
                active ? 'text-primary' :
                completed ? 'text-emerald-600 dark:text-emerald-400' :
                'text-slate-400 dark:text-slate-500'
              )}
            >
              {label}
            </span>
            {idx < steps.length - 1 && (
              <span className={clsx('mx-2 h-0.5 w-8 rounded-full', completed ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800')} />
            )}
          </button>
        );
      })}
    </div>
  );
}
