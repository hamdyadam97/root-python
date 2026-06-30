import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { subscription } from '@/store/packagesSlice';
import type { AppDispatch, RootState } from '@/store';

export function SubscriptionsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions } = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    dispatch(subscription());
  }, [dispatch]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-secondary">{t('common.subscriptions')}</h1>
      <div className="space-y-4">
        {(subscriptions || []).map((sub: any) => (
          <div key={sub.id} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-secondary">{sub.package?.name}</h3>
            <p className="text-sm text-gray-600">{sub.start_date} → {sub.end_date}</p>
            <p className="mt-1 text-sm font-medium text-primary">{sub.subscription_status === 1 ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
