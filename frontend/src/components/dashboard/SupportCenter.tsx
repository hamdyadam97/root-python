import { useTranslation } from 'react-i18next';
import { MessageCircle, HelpCircle, Wrench, Phone, Mail } from 'lucide-react';
import { SectionCard } from './SectionCard';

const items = [
  { key: 'liveChat', icon: MessageCircle, color: 'bg-primary/10 text-primary' },
  { key: 'faq', icon: HelpCircle, color: 'bg-blue-100 text-blue-600' },
  { key: 'technicalSupport', icon: Wrench, color: 'bg-amber-100 text-amber-600' },
  { key: 'whatsapp', icon: Phone, color: 'bg-emerald-100 text-emerald-600' },
  { key: 'contactUs', icon: Mail, color: 'bg-rose-100 text-rose-600' },
];

export function SupportCenter() {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('dashboard.support.title')} className="lg:col-span-1">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}>
                <Icon size={22} />
              </div>
              <span className="text-xs font-bold text-secondary dark:text-white">{t(`dashboard.support.${item.key}`)}</span>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
