import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { CustomPackageCard } from '@/components/packages/CustomPackageCard';
import { PackageCard } from '@/components/packages/PackageCard';
import type { Package } from '@/types/package';
import type { RootState } from '@/store';

export function PackagesCategoryPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authenticated = useSelector((state: RootState) => state.auth.authenticated);
  const [category, setCategory] = useState<any>(null);
  const [subscribingId, setSubscribingId] = useState<number | null>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([api.get(`/categories/${id}/subcategories`), api.get('/categories')])
      .then(([subRes, catRes]) => {
        setSubCategories(subRes.data?.data?.sub_categories || []);
        const cats = catRes.data?.data?.categories || [];
        setCategory(cats.find((c: any) => String(c.id) === id));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const loadPackages = (subId: number) => {
    setSelectedSub(subId);
    api.get(`/subcategories/${subId}/packages`).then((res) => {
      setPackages(res.data?.data?.packages || []);
    });
  };

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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">{t('packages.categoryNotFound', 'Category not found')}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          {t('common.back_home', 'Back to home')}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-secondary sm:text-4xl">{category.name}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {t('packages.chooseSubcategory', 'Choose a subcategory to view available exam packages.')}
          </p>
        </div>

        <h2 className="mb-4 text-xl font-semibold text-secondary">{t('common.subcategories', 'Subcategories')}</h2>
        {subCategories.length === 0 ? (
          <p className="text-gray-600">{t('packages.noSubcategories', 'No subcategories available.')}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subCategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => loadPackages(sub.id)}
                className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
                  selectedSub === sub.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <h3 className="text-lg font-semibold text-secondary">{sub.name}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {sub.questions_count} {t('common.questions', 'questions')}
                </p>
              </button>
            ))}
          </div>
        )}

        {selectedSub && (
          <div className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-secondary">{t('common.packages', 'Packages')}</h2>
            {packages.length === 0 ? (
              <p className="text-gray-600">{t('packages.noPackages', 'No packages available for this subcategory.')}</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg, idx) =>
                  pkg.is_custom ? (
                    <CustomPackageCard key={pkg.id} pkg={pkg} onSubscribe={handleSubscribe} subscribingId={subscribingId} />
                  ) : (
                    <PackageCard key={pkg.id} pkg={pkg} index={idx} />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
