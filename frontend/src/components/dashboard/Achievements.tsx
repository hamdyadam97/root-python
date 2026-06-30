import { useTranslation } from 'react-i18next';
import { Trophy, Medal, Flame, Star, Target, Zap } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { AnimatedCounter } from './AnimatedCounter';

const stats = [
  { key: 'points', icon: Star, value: 12450, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
  { key: 'xp', icon: Zap, value: 8320, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  { key: 'badges', icon: Medal, value: 18, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
  { key: 'achievements', icon: Trophy, value: 24, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
];

export function Achievements() {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('dashboard.achievements.title')} className="lg:col-span-2">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.key}
              className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-2xl font-extrabold text-secondary dark:text-white"><AnimatedCounter value={s.value} /></p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t(`dashboard.achievements.${s.key}`)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-50 p-4 dark:from-amber-500/10 dark:to-transparent">
          <Flame className="text-amber-500" size={28} />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.achievements.currentLeague')}</p>
            <p className="font-bold text-secondary dark:text-white">Gold League</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 to-teal-50 p-4 dark:from-primary/10 dark:to-transparent">
          <Target className="text-primary" size={28} />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.achievements.monthlyRanking')}</p>
            <p className="font-bold text-secondary dark:text-white">#12</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-100 to-slate-50 p-4 dark:from-blue-500/10 dark:to-transparent">
          <Trophy className="text-blue-500" size={28} />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.achievements.completion')}</p>
            <p className="font-bold text-secondary dark:text-white">68%</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
