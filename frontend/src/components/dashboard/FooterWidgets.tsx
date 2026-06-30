import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusCircle, PlayCircle, BookOpen, BarChart2, CreditCard } from 'lucide-react';

export function FooterWidgets() {
  const { t } = useTranslation();

  const items = [
    { to: '/user/exam/create', icon: PlusCircle, label: t('dashboard.footer.createExam'), color: 'bg-rose-500' },
    { to: '/user/exam', icon: PlayCircle, label: t('dashboard.footer.continueLastExam'), color: 'bg-primary' },
    { to: '/courses', icon: BookOpen, label: t('dashboard.footer.browseCourses'), color: 'bg-blue-500' },
    { to: '/user/dashboard?tab=analytics', icon: BarChart2, label: t('dashboard.footer.performanceReport'), color: 'bg-purple-500' },
    { to: '/user/subscriptions', icon: CreditCard, label: t('dashboard.footer.subscriptionDetails'), color: 'bg-amber-500' },
  ];

  return (
    <div className="rounded-[2rem] bg-gradient-to-r from-secondary to-[#0a1f5c] p-6 text-white shadow-xl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition hover:bg-white/20"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color} text-white shadow`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
