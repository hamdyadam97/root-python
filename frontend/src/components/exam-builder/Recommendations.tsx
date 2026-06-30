import { useTranslation } from 'react-i18next';
import { Brain, Target, BookOpen, Sparkles, RotateCcw } from 'lucide-react';

const recs = [
  { key: 'recommendedTopics', icon: Target, color: 'bg-primary/10 text-primary' },
  { key: 'weakSubjects', icon: Brain, color: 'bg-rose-100 text-rose-600' },
  { key: 'suggestedPractice', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
  { key: 'aiRecommendations', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  { key: 'continueSession', icon: RotateCcw, color: 'bg-amber-100 text-amber-600' },
];

export function Recommendations() {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.recommendations.title')}</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {recs.map((rec) => {
          const Icon = rec.icon;
          return (
            <button
              key={rec.key}
              type="button"
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${rec.color}`}>
                <Icon size={24} />
              </div>
              <span className="text-sm font-bold text-secondary dark:text-white">{t(`examBuilder.recommendations.${rec.key}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
