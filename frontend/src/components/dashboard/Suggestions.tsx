import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { toast } from 'sonner';

export function Suggestions() {
  const { t } = useTranslation();
  const [type, setType] = useState('newFeature');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('dashboard.suggestions.success'));
  };

  return (
    <SectionCard title={t('dashboard.suggestions.title')} className="lg:col-span-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {[
            { key: 'newFeature', value: 'newFeature' },
            { key: 'newQuestion', value: 'newQuestion' },
            { key: 'newCourse', value: 'newCourse' },
            { key: 'generalFeedback', value: 'generalFeedback' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                type === opt.value
                  ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                  : 'border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-700/30 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="suggestionType"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value)}
                className="h-4 w-4 accent-primary"
              />
              {t(`dashboard.suggestions.${opt.key}`)}
            </label>
          ))}
        </div>

        <textarea
          rows={3}
          placeholder={t('common.describe', 'Share your idea...')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-teal-500 py-2.5 text-sm font-bold text-white transition hover:shadow-lg"
        >
          <Send size={16} /> {t('dashboard.suggestions.submit')}
        </button>
      </form>
    </SectionCard>
  );
}
