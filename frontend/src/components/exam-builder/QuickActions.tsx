import { useTranslation } from 'react-i18next';
import { PlayCircle, XCircle, Bookmark, Heart, BookOpen, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  { key: 'continueLastExam', icon: PlayCircle, to: '/user/exam', color: 'bg-primary/10 text-primary' },
  { key: 'reviewWrong', icon: XCircle, to: '/user/dashboard?tab=wrong', color: 'bg-rose-100 text-rose-600' },
  { key: 'reviewSaved', icon: Bookmark, to: '/user/dashboard?tab=saved', color: 'bg-amber-100 text-amber-600' },
  { key: 'reviewFavorites', icon: Heart, to: '/user/dashboard?tab=favorite', color: 'bg-pink-100 text-pink-600' },
  { key: 'browseCourses', icon: BookOpen, to: '/courses', color: 'bg-blue-100 text-blue-600' },
  { key: 'performanceReport', icon: BarChart2, to: '/user/dashboard?tab=analytics', color: 'bg-purple-100 text-purple-600' },
];

export function QuickActions() {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examBuilder.quickActions.title')}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.key}
              to={action.to}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.color}`}>
                <Icon size={22} />
              </div>
              <span className="text-sm font-bold text-secondary dark:text-white">{t(`examBuilder.quickActions.${action.key}`)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
