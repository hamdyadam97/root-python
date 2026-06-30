import { useTranslation } from 'react-i18next';
import { Gift, Percent, Clock, Star, ArrowRight } from 'lucide-react';
import { SectionCard } from './SectionCard';

const offers = [
  { key: 'newPackages', icon: Gift, gradient: 'from-rose-500 to-pink-600' },
  { key: 'seasonalDiscounts', icon: Percent, gradient: 'from-primary to-teal-500' },
  { key: 'limitedTime', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
  { key: 'newCourses', icon: Star, gradient: 'from-blue-500 to-indigo-600' },
  { key: 'featuredExams', icon: Gift, gradient: 'from-purple-500 to-fuchsia-600' },
];

export function OffersSection() {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('dashboard.offers.title')} className="lg:col-span-1">
      <div className="space-y-3">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.key}
              className={`group flex items-center justify-between rounded-2xl bg-gradient-to-r ${offer.gradient} p-4 text-white shadow-md transition hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Icon size={20} />
                </div>
                <p className="text-sm font-bold">{t(`dashboard.offers.${offer.key}`)}</p>
              </div>
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
