import { useTranslation } from 'react-i18next';
import { Package, Layers, Clock, ArrowUpCircle } from 'lucide-react';
import { AnimatedCounter } from '@/components/dashboard/AnimatedCounter';

interface Props {
  name?: string;
  total?: number;
  used?: number;
  expiry?: string;
}

export function PackageOverview({ name, total = 5000, used = 1240, expiry = '2026-12-31' }: Props) {
  const { t } = useTranslation();
  const remaining = total - used;
  const percent = Math.round((used / total) * 100);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-secondary via-[#0a1f5c] to-primary p-6 text-white shadow-2xl md:p-8">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Package size={28} />
          </div>
          <div>
            <p className="text-sm text-white/70">{t('examBuilder.packageOverview.packageName')}</p>
            <h2 className="text-2xl font-extrabold">{name || 'Elite Medical'}</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-2xl font-extrabold"><AnimatedCounter value={total} /></p>
            <p className="text-xs text-white/70">{t('examBuilder.packageOverview.totalQuestions')}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-2xl font-extrabold"><AnimatedCounter value={used} /></p>
            <p className="text-xs text-white/70">{t('examBuilder.packageOverview.usedQuestions')}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
            <p className="text-2xl font-extrabold"><AnimatedCounter value={remaining} /></p>
            <p className="text-xs text-white/70">{t('examBuilder.packageOverview.remainingQuestions')}</p>
          </div>
        </div>

        <div className="min-w-[220px]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-white/80"><Layers size={14} /> {t('examBuilder.packageOverview.usedQuestions')}</span>
            <span className="font-bold">{percent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-white/70">
            <Clock size={12} /> {t('examBuilder.packageOverview.expiryDate')}: {expiry}
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-sm transition hover:bg-white/20"
          >
            <ArrowUpCircle size={14} /> {t('examBuilder.packageOverview.upgrade')}
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-16 -start-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 -end-16 h-48 w-48 rounded-full bg-teal-300/10 blur-3xl" />
    </div>
  );
}
