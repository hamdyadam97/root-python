import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Layers,
  BookOpen,
  Award,
  CreditCard,
  Clock,
  TrendingUp,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { getProfileData } from '@/store/authSlice';
import { getExams } from '@/store/examSlice';
import { api } from '@/lib/api';
import type { AppDispatch, RootState } from '@/store';

import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { ContinueLearning } from '@/components/dashboard/ContinueLearning';
import { RecentExams, type Exam } from '@/components/dashboard/RecentExams';
import { PerformanceCharts } from '@/components/dashboard/PerformanceCharts';
import { TopicAnalysis } from '@/components/dashboard/TopicAnalysis';
import { AiRecommendations } from '@/components/dashboard/AiRecommendations';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { CertificatesList } from '@/components/dashboard/CertificatesList';
import { Achievements } from '@/components/dashboard/Achievements';
import { OffersSection } from '@/components/dashboard/OffersSection';
import { NotificationsList } from '@/components/dashboard/NotificationsList';
import { SupportCenter } from '@/components/dashboard/SupportCenter';
import { ReportQuestion } from '@/components/dashboard/ReportQuestion';
import { Suggestions } from '@/components/dashboard/Suggestions';
import { FooterWidgets } from '@/components/dashboard/FooterWidgets';

interface Notification {
  id: number;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

export function DashboardPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const exams = useSelector((state: RootState) => state.exam.exams);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    dispatch(getProfileData());
    dispatch(getExams(1));
    api.get('/notifications')
      .then((res) => setNotifications(res.data?.data?.notifications || []))
      .catch(() => setNotifications([]));
  }, [dispatch]);

  const recentExams = useMemo(() => (Array.isArray(exams) ? exams.slice(0, 5) : []) as Exam[], [exams]);
  const fullName = `${String(user.first_name || '')} ${String(user.last_name || '')}`.trim() || t('common.user', 'Student');

  const statItems = [
    { icon: Layers, label: t('dashboard.stats.remainingQuestions'), value: 1240, suffix: '', color: 'bg-primary/10 text-primary' },
    { icon: CheckCircle2, label: t('dashboard.stats.completedExams'), value: 48, color: 'bg-emerald-100 text-emerald-600' },
    { icon: BookOpen, label: t('dashboard.stats.averageScore'), value: 78, suffix: '%', color: 'bg-blue-100 text-blue-600' },
    { icon: Trophy, label: t('dashboard.stats.bestScore'), value: 96, suffix: '%', color: 'bg-amber-100 text-amber-600' },
    { icon: TrendingUp, label: t('dashboard.stats.successRate'), value: 82, suffix: '%', color: 'bg-purple-100 text-purple-600' },
    { icon: Clock, label: t('dashboard.stats.studyHours'), value: 156, suffix: 'h', color: 'bg-rose-100 text-rose-600' },
    { icon: Award, label: t('dashboard.stats.currentRank'), value: 42, prefix: '#', color: 'bg-teal-100 text-teal-600' },
    { icon: CreditCard, label: t('dashboard.stats.earnedCertificates'), value: 3, color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      <WelcomeHero name={fullName} />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat, i) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            prefix={stat.prefix}
            color={stat.color}
            delay={i * 0.05}
          />
        ))}
      </section>

      <section>
        <ContinueLearning />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <RecentExams exams={recentExams} />
        <AiRecommendations />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <PerformanceCharts />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <TopicAnalysis />
        <SubscriptionCard />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Achievements />
        <CertificatesList />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <NotificationsList notifications={notifications} />
        <OffersSection />
        <SupportCenter />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ReportQuestion />
        <Suggestions />
        <div className="hidden lg:block" />
      </section>

      <section>
        <FooterWidgets />
      </section>
    </div>
  );
}
