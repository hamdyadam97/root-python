import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { CustomPackageCard } from '@/components/packages/CustomPackageCard';
import { PackageCard } from '@/components/packages/PackageCard';
import type { Package } from '@/types/package';
import type { RootState } from '@/store';

export function PackagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authenticated = useSelector((state: RootState) => state.auth.authenticated);
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscribingId, setSubscribingId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/packages/index').then((res) => setPackages(res.data?.data?.packages || []));
  }, []);

  const handleSubscribe = async (pkg: Package, customDays?: number) => {
    if (!authenticated) {
      navigate('/login');
      return;
    }
    setSubscribingId(pkg.id);
    try {
      const payload: any = { package_id: pkg.id };
      if (pkg.is_custom && customDays) {
        payload.custom_days = customDays;
      }
      const res = await api.post('/packages/subscribe', payload);
      const data = res.data?.data;
      if (data?.subscription) {
        toast.success(t('packages.subscribeSuccess', 'Subscribed successfully!'));
      } else if (data?.checkout?.url) {
        window.open(data.checkout.url, '_blank');
      } else {
        toast.info(t('packages.paymentNotConfigured', 'Redirect to payment (gateway not configured).'));
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || t('packages.subscribeError', 'Subscription failed.');
      toast.error(msg);
    } finally {
      setSubscribingId(null);
    }
  };

  if (packages.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-secondary sm:text-4xl">{t('common.packages')}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {t('packages.subtitle', 'Choose a premium package and start preparing for your medical exams.')}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, idx) =>
            pkg.is_custom ? (
              <CustomPackageCard key={pkg.id} pkg={pkg} onSubscribe={handleSubscribe} subscribingId={subscribingId} />
            ) : (
              <PackageCard key={pkg.id} pkg={pkg} index={idx} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
