import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { indexPackages } from '@/store/packagesSlice';
import type { AppDispatch, RootState } from '@/store';

export function UserPackagesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { packages } = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    dispatch(indexPackages());
  }, [dispatch]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-secondary">{t('common.packages')}</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {(packages || []).map((pkg: any) => (
          <div key={pkg.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-secondary">{pkg.name}</h3>
            <p className="mt-2 text-2xl font-bold text-primary">{pkg.price} JOD</p>
            <p className="text-sm text-gray-600">{t('packages.period')}: {pkg.period} days</p>
            <button className="mt-4 w-full rounded-lg bg-primary py-2 text-white hover:bg-primary/90">{t('packages.subscribe')}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
