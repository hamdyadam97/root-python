import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

interface Settings {
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showExplanations: boolean;
  showCorrect: boolean;
  allowReview: boolean;
  autoSave: boolean;
  countdown: boolean;
  fullscreen: boolean;
  saveTemplate: boolean;
}

interface Props {
  settings: Settings;
  onChange: (key: keyof Settings, value: boolean) => void;
}

const keys: (keyof Settings)[] = [
  'randomizeQuestions',
  'randomizeAnswers',
  'showExplanations',
  'showCorrect',
  'allowReview',
  'autoSave',
  'countdown',
  'fullscreen',
  'saveTemplate',
];

export function AdvancedSettings({ settings, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.advanced.title')}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => (
          <label
            key={key}
            className={clsx(
              'flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition',
              settings[key]
                ? 'border-primary bg-primary/5 dark:border-primary dark:bg-primary/10'
                : 'border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800'
            )}
          >
            <span className="text-sm font-bold text-secondary dark:text-white">{t(`examBuilder.advanced.${key}`)}</span>
            <div className="relative inline-flex h-6 w-11 items-center">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => onChange(key, e.target.checked)}
                className="peer sr-only"
              />
              <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-primary dark:bg-slate-600" />
              <span className="absolute start-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
