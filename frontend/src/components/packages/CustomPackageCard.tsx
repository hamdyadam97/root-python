import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Loader2, Calculator, HelpCircle, Hash } from 'lucide-react';
import { api } from '@/lib/api';
import type { Package } from '@/types/package';

interface CustomPackageCardProps {
  pkg: Package;
  onSubscribe: (pkg: Package, customDays: number) => void;
  subscribingId: number | null;
}

export function CustomPackageCard({ pkg, onSubscribe, subscribingId }: CustomPackageCardProps) {
  const { t } = useTranslation();
  const [days, setDays] = useState<number>(7);
  const [calculated, setCalculated] = useState<{ price: number; period_days: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/packages/calculate-price', {
        package_id: pkg.id,
        custom_days: days,
      });
      setCalculated(res.data?.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to calculate price');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-secondary">{pkg.name}</h3>
          {pkg.code && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
              <Hash size={12} /> {pkg.code}
            </p>
          )}
        </div>
        {(pkg.logo || pkg.icon) && (
          <img
            src={(pkg.logo || pkg.icon) ?? undefined}
            alt={pkg.name}
            className="h-14 w-14 rounded-xl object-cover"
          />
        )}
      </div>
      <p className="mb-3 text-sm text-gray-600">
        {pkg.description || t('packages.customPackageDesc', 'Choose how many days you need')}
      </p>
      {pkg.number_of_questions != null && (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
          <HelpCircle size={12} /> {pkg.number_of_questions} {t('common.questions', 'questions')}
        </p>
      )}

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {t('packages.numberOfDays', 'Number of days')}
        </label>
        <input
          type="number"
          min={1}
          max={365}
          value={days}
          onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value))))}
          className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <button
        onClick={calculate}
        disabled={loading}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 py-2 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
        {t('packages.calculatePrice', 'Calculate price')}
      </button>

      {calculated && (
        <div className="mt-4 rounded-xl bg-primary/5 p-3 text-center">
          <p className="text-2xl font-bold text-primary">{calculated.price.toFixed(2)} JOD</p>
          <p className="text-xs text-gray-600">
            {calculated.period_days} {t('packages.days', 'days')}
          </p>
        </div>
      )}

      <button
        onClick={() => onSubscribe(pkg, days)}
        disabled={subscribingId === pkg.id}
        className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-2 text-white hover:bg-primary/90 disabled:opacity-50"
      >
        {subscribingId === pkg.id ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          t('packages.subscribe')
        )}
      </button>
    </div>
  );
}
