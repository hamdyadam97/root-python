import { useTranslation } from 'react-i18next';
import { CreditCard, RefreshCw, ArrowUpCircle } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { AnimatedCounter } from './AnimatedCounter';

export function SubscriptionCard() {
  const { t } = useTranslation();

  const included = 5000;
  const used = 3760;
  const remaining = included - used;
  const percent = Math.round((used / included) * 100);

  return (
    <SectionCard title={t('dashboard.subscription.title')} className="lg:col-span-1">
      <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-teal-50 p-5 dark:from-primary/10 dark:to-slate-800">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.subscription.packageName')}</p>
            <p className="text-lg font-extrabold text-secondary dark:text-white">Elite Medical</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-3 text-center shadow-sm dark:bg-slate-800">
            <p className="text-xl font-extrabold text-secondary dark:text-white"><AnimatedCounter value={included} /></p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('dashboard.subscription.questionsIncluded')}</p>
          </div>
          <div className="rounded-xl bg-white p-3 text-center shadow-sm dark:bg-slate-800">
            <p className="text-xl font-extrabold text-primary"><AnimatedCounter value={remaining} /></p>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('dashboard.remainingQuestions')}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-bold">
            <span className="text-slate-500 dark:text-slate-400">{t('dashboard.questionsUsed')}</span>
            <span className="text-secondary dark:text-white">{percent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          {t('dashboard.subscriptionExpiry')}: <span className="font-bold text-secondary dark:text-white">2026-12-31</span>
        </p>

        <div className="mt-5 flex gap-3">
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <RefreshCw size={16} /> {t('dashboard.subscription.renew')}
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:bg-primary/90">
            <ArrowUpCircle size={16} /> {t('dashboard.subscription.upgrade')}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
