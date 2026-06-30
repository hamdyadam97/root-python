import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Award, BookOpen, Users, Layers, Package, FileText,
  ArrowLeft, TrendingUp, ScrollText,
} from 'lucide-react';
import { api } from '@/lib/api';
import { HeroSection } from './HeroSection';
import { SpecialtyCard } from '@/components/SpecialtyCard';
import { PackageCard } from '@/components/packages/PackageCard';
import { StatisticsSection } from './StatisticsSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection } from './TestimonialsSection';
import { PartnersSection } from './PartnersSection';
import { LocationContactSection } from './LocationContactSection';
import { CTASection } from './CTASection';

export function HomePage() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>({ categories: [], blogs: [], testimonials: [], packages: [], partners: [], app_info: null });

  useEffect(() => {
    api.get('/landing/index').then((res) => setData(res.data?.data || {}));
  }, []);

  const categories = data.categories || [];
  const testimonials = data.testimonials || [];
  const packages = data.packages || [];
  const featured = packages.slice(0, 3);

  const totalQuestions = categories.reduce((acc: number, c: any) => acc + (c.questions_count || 0), 0);
  const totalStudents = packages.reduce((acc: number, p: any) => acc + (p.students_count || 0), 0) || testimonials.length * 120;
  const totalMockExams = packages.reduce((acc: number, p: any) => acc + (p.exam_count || 0), 0);

  const specialties = categories.slice(0, 4);

  const stats = [
    { value: totalStudents, label: t('statistics.totalStudents', 'Total Students'), icon: Users, suffix: '+' },
    { value: categories.length, label: t('statistics.specialties', 'Medical Specialties'), icon: Layers, suffix: '+' },
    { value: packages.length, label: t('statistics.packages', 'Exam Packages'), icon: Package, suffix: '+' },
    { value: totalQuestions, label: t('statistics.questions', 'Practice Questions'), icon: BookOpen, suffix: '+' },
    { value: totalMockExams, label: t('statistics.mockExams', 'Mock Exams'), icon: FileText, suffix: '+' },
    { value: 120, label: t('statistics.instructors', 'Certified Instructors'), icon: Award, suffix: '+' },
    { value: 96, label: t('statistics.successRate', 'Success Rate'), icon: TrendingUp, suffix: '%' },
    { value: 8500, label: t('statistics.certificates', 'Certificates Issued'), icon: ScrollText, suffix: '+' },
  ];

  return (
    <div className="overflow-hidden">
      <HeroSection />

      {/* Specialties */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 10%, rgba(6,191,176,0.06), transparent 30%), radial-gradient(circle at 90% 90%, rgba(0,39,112,0.04), transparent 30%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary">
              {t('specialties.badge', 'Medical Specialties')}
            </span>
            <h2 className="text-3xl font-bold text-secondary sm:text-4xl">
              {t('specialties.title', 'Choose Your Medical Specialty')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {t('specialties.subtitle', 'Premium exam packages tailored for every healthcare professional.')}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map((cat: any, idx: number) => (
              <SpecialtyCard key={cat.id} specialty={cat} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Exams / Packages */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-secondary">الباقات المميزة</h2>
              <p className="mt-2 text-gray-600">باقات مختارة لمساعدتك في التحضير</p>
            </div>
            <Link to="/packages" className="hidden items-center gap-1 text-primary hover:underline md:inline-flex">
              كل الباقات
              <ArrowLeft size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((pkg: any, idx: number) => (
              <PackageCard key={pkg.id} pkg={pkg} index={idx} showPreview={false} />
            ))}
          </div>
        </div>
      </section>

      <StatisticsSection stats={stats} />

      <HowItWorksSection />

      <TestimonialsSection testimonials={testimonials} />

      <PartnersSection partners={data.partners || []} />

      <LocationContactSection appInfo={data.app_info || null} />

      <CTASection
        students={totalStudents}
        packages={packages.length}
        successRate={96}
      />
    </div>
  );
}
