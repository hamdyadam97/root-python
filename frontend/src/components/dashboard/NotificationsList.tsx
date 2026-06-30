import { useTranslation } from 'react-i18next';
import { Calendar, Clock, BookOpen, Tag, Award, Bell } from 'lucide-react';
import { SectionCard } from './SectionCard';

interface Notification {
  id: number;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

interface Props {
  notifications: Notification[];
}

const iconMap: Record<string, any> = {
  upcomingExams: Calendar,
  subscriptionExpiry: Clock,
  questionBankUpdates: BookOpen,
  courseAnnouncements: BookOpen,
  offers: Tag,
  certificatesReady: Award,
};

export function NotificationsList({ notifications }: Props) {
  const { t } = useTranslation();

  const sample = notifications.length
    ? notifications.slice(0, 4)
    : [
        { id: 1, key: 'upcomingExams', title: t('dashboard.notifications.upcomingExams'), desc: 'Surgery exam in 2 days', is_read: false },
        { id: 2, key: 'subscriptionExpiry', title: t('dashboard.notifications.subscriptionExpiry'), desc: 'Your Elite plan expires in 10 days', is_read: false },
        { id: 3, key: 'questionBankUpdates', title: t('dashboard.notifications.questionBankUpdates'), desc: '500 new Internal Medicine questions added', is_read: true },
        { id: 4, key: 'offers', title: t('dashboard.notifications.offers'), desc: 'Get 30% off premium packages this week', is_read: true },
      ];

  return (
    <SectionCard title={t('dashboard.notifications.title')} className="lg:col-span-1">
      {sample.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 py-8 text-center dark:bg-slate-700/30">
          <Bell className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.notifications.empty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sample.map((note: any) => {
            const Icon = iconMap[note.key] || Bell;
            return (
              <div
                key={note.id}
                className={`flex items-start gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                  note.is_read
                    ? 'border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-700/30'
                    : 'border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10'
                }`}
              >
                <div className="mt-0.5 text-primary">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-secondary dark:text-white">{note.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{note.description || note.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
