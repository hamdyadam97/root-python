import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, Target, BookOpen, TrendingUp } from 'lucide-react';
import { SectionCard } from './SectionCard';

const topics = {
  strong: ['Cardiology', 'Endocrinology', 'Infectious Diseases'],
  weak: ['Neurology', 'Nephrology'],
  recommended: ['Pulmonology', 'Gastroenterology'],
  mastered: ['Anatomy', 'Physiology'],
  needs: ['Critical Care', 'Emergency Medicine'],
};

export function TopicAnalysis() {
  const { t } = useTranslation();

  const blocks = [
    { key: 'strongTopics', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10', items: topics.strong },
    { key: 'weakTopics', icon: AlertCircle, color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10', items: topics.weak },
    { key: 'recommendedTopics', icon: Target, color: 'text-primary bg-teal-50 dark:bg-primary/10', items: topics.recommended },
    { key: 'masteredSubjects', icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', items: topics.mastered },
    { key: 'needsImprovement', icon: TrendingUp, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10', items: topics.needs },
  ];

  return (
    <SectionCard title={t('dashboard.strengthWeakness.title')} className="lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.key}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-700/30"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${block.color}`}>
                  <Icon size={16} />
                </div>
                <h5 className="text-sm font-bold text-secondary dark:text-white">{t(`dashboard.strengthWeakness.${block.key}`)}</h5>
              </div>
              <ul className="space-y-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
