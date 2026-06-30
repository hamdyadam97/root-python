import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Search,
  X,
  Award,
  TrendingUp,
  BadgeCheck,
  Share2,
  Trophy,
  ShieldCheck,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Eye,
  Sun,
  Moon,
  Loader2,
  GraduationCap,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';

interface Certificate {
  id: number;
  certificate_id: string;
  title: string;
  description?: string;
  student_name?: string;
  related_course?: string;
  instructor_name?: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  image?: string;
  pdf_url?: string;
  is_verified?: boolean;
  is_featured?: boolean;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface Stats {
  certificates_issued: number;
  certified_students: number;
  partner_organizations: number;
  available_programs: number;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function formatDate(date?: string, locale = 'en') {
  if (!date) return '-';
  return new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <div ref={ref} className='text-3xl font-extrabold text-secondary dark:text-white md:text-4xl'>
      {count.toLocaleString()}{suffix}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className='mb-8 text-center'>
      <div className='mb-3 flex items-center justify-center gap-3'>
        <div className='h-1 w-8 rounded-full bg-primary' />
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{title}</h2>
        <div className='h-1 w-8 rounded-full bg-primary' />
      </div>
      {subtitle && <p className='mx-auto max-w-2xl text-slate-500 dark:text-slate-400'>{subtitle}</p>}
    </div>
  );
}

function FAQItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60'>
      <button onClick={onToggle} className='flex w-full items-center justify-between gap-4 p-5 text-start' aria-expanded={isOpen}>
        <span className='font-bold text-slate-900 dark:text-white'>{faq.question}</span>
        <span className='shrink-0 rounded-full bg-slate-50 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {isOpen && (
        <div className='border-t border-slate-100 px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300'>
          <p className='pt-3'>{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

function FeaturedCertificateCard({ certificate }: { certificate: Certificate }) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 sm:w-[360px]'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={certificate.image || '/placeholder-certificate.jpg'}
          alt={certificate.title}
          className='h-full w-full object-cover'
          loading='lazy'
        />
        <div className='absolute end-3 top-3 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-secondary'>
          {t('certificates.featured')}
        </div>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='mb-1 text-lg font-bold text-slate-900 dark:text-white line-clamp-2'>{certificate.title}</h3>
        <p className='mb-3 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300'>{certificate.description}</p>
        <div className='mb-3 space-y-1 text-xs text-slate-500 dark:text-slate-400'>
          {certificate.related_course && <p className='truncate'>{t('certificates.relatedCourse')}: {certificate.related_course}</p>}
          {certificate.issuing_organization && <p className='truncate'>{t('certificates.issuingOrganization')}: {certificate.issuing_organization}</p>}
        </div>
        <button
          onClick={() => toast.info(t('certificates.viewDetails') + ' — coming soon')}
          className='mt-auto inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
        >
          <Eye size={14} /> {t('certificates.viewDetails')}
        </button>
      </div>
    </motion.div>
  );
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const { t, i18n } = useTranslation();
  const verified = certificate.is_verified;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={certificate.image || '/placeholder-certificate.jpg'}
          alt={certificate.title}
          className='h-full w-full object-cover'
          loading='lazy'
        />
        <div className={cn(
          'absolute start-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold',
          verified ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        )}>
          {verified ? <CheckCircle size={12} /> : <X size={12} />}
          {verified ? t('certificates.verified') : t('certificates.notVerified')}
        </div>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='mb-1 text-base font-bold text-slate-900 dark:text-white line-clamp-2'>{certificate.title}</h3>
        <div className='mb-3 space-y-1 text-xs text-slate-500 dark:text-slate-400'>
          {certificate.related_course && <p className='truncate'>{t('certificates.relatedCourse')}: {certificate.related_course}</p>}
          {certificate.instructor_name && <p className='truncate'>{t('certificates.instructor')}: {certificate.instructor_name}</p>}
          <div className='flex flex-wrap gap-3 pt-1'>
            <span className='inline-flex items-center gap-1'><Calendar size={12} /> {formatDate(certificate.issue_date, i18n.language)}</span>
            {certificate.expiry_date && <span className='inline-flex items-center gap-1'><Clock size={12} /> {formatDate(certificate.expiry_date, i18n.language)}</span>}
          </div>
          <p className='truncate font-mono text-slate-400'>{t('certificates.certificateId')}: {certificate.certificate_id}</p>
        </div>
        <div className='mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800'>
          <button
            onClick={() => toast.info(t('certificates.viewCertificate') + ' — coming soon')}
            className='inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
          >
            <Eye size={14} /> {t('certificates.viewCertificate')}
          </button>
          {certificate.pdf_url ? (
            <a
              href={certificate.pdf_url}
              target='_blank'
              rel='noreferrer'
              className='inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            >
              <Download size={14} /> {t('certificates.downloadPdf')}
            </a>
          ) : (
            <button
              onClick={() => toast.info(t('certificates.pdfNotAvailable'))}
              className='inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800'
            >
              <Download size={14} /> {t('certificates.downloadPdf')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BenefitCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'>
      <div className='mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
        <Icon size={28} />
      </div>
      <h3 className='mb-2 text-lg font-bold text-slate-900 dark:text-white'>{title}</h3>
      <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className='relative flex gap-4'>
      <div className='flex flex-col items-center'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-secondary'>
          {number}
        </div>
        {number < 4 && <div className='mt-2 h-full w-0.5 bg-primary/30' />}
      </div>
      <div className='pb-10'>
        <h3 className='mb-1 text-lg font-bold text-slate-900 dark:text-white'>{title}</h3>
        <p className='text-sm text-slate-600 dark:text-slate-300'>{description}</p>
      </div>
    </div>
  );
}

export function CertificatesPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Certificate[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [certId, setCertId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedCert, setVerifiedCert] = useState<Certificate | null>(null);
  const [search, setSearch] = useState('');
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    api
      .get('/certificates')
      .then((res) => {
        const data = res.data?.data || {};
        setFeatured(data.featured || []);
        setCertificates(data.certificates || []);
        setFaqs(data.faqs || []);
        setStats(data.stats || null);
      })
      .catch(() => toast.error(t('certificates.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return certificates;
    return certificates.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.student_name && c.student_name.toLowerCase().includes(q)) ||
        (c.related_course && c.related_course.toLowerCase().includes(q)) ||
        (c.instructor_name && c.instructor_name.toLowerCase().includes(q)) ||
        c.certificate_id.toLowerCase().includes(q)
    );
  }, [certificates, search]);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) {
      toast.error(t('certificates.certIdRequired'));
      return;
    }
    setVerifying(true);
    setVerifiedCert(null);
    try {
      const res = await api.post('/certificates/verify', {
        certificate_id: certId.trim(),
        student_name: studentName.trim() || undefined,
      });
      const cert = res.data?.data?.certificate;
      if (cert) {
        setVerifiedCert(cert);
        toast.success(t('certificates.verifySuccess'));
      } else {
        toast.error(t('certificates.verifyNotFound'));
      }
    } catch {
      toast.error(t('certificates.verifyNotFound'));
    } finally {
      setVerifying(false);
    }
  };

  const clearVerification = () => {
    setCertId('');
    setStudentName('');
    setVerifiedCert(null);
  };

  const toggleFaq = (id: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    );
  }

  const benefits = [
    { icon: Award, title: t('certificates.benefit1Title'), description: t('certificates.benefit1Desc') },
    { icon: TrendingUp, title: t('certificates.benefit2Title'), description: t('certificates.benefit2Desc') },
    { icon: BadgeCheck, title: t('certificates.benefit3Title'), description: t('certificates.benefit3Desc') },
    { icon: Share2, title: t('certificates.benefit4Title'), description: t('certificates.benefit4Desc') },
    { icon: Trophy, title: t('certificates.benefit5Title'), description: t('certificates.benefit5Desc') },
    { icon: ShieldCheck, title: t('certificates.benefit6Title'), description: t('certificates.benefit6Desc') },
  ];

  const steps = [
    { title: t('certificates.step1Title'), description: t('certificates.step1Desc') },
    { title: t('certificates.step2Title'), description: t('certificates.step2Desc') },
    { title: t('certificates.step3Title'), description: t('certificates.step3Desc') },
    { title: t('certificates.step4Title'), description: t('certificates.step4Desc') },
  ];

  return (
    <div className={cn('min-h-screen bg-white transition-colors', isDark && 'dark')}>
      <div className='bg-white pb-16 dark:bg-slate-950'>
        {/* Hero */}
        <section className='relative overflow-hidden bg-gradient-to-br from-secondary to-slate-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28'>
          <div className='relative z-10 mx-auto max-w-7xl text-center'>
            <nav aria-label='Breadcrumb' className='mb-6'>
              <ol className='flex flex-wrap items-center justify-center gap-2 text-sm text-slate-300'>
                <li>
                  <Link to='/' className='inline-flex items-center gap-1 hover:text-primary'>
                    <Home size={14} /> {t('certificates.breadcrumbHome')}
                  </Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li className='text-white' aria-current='page'>{t('certificates.heroTitle')}</li>
              </ol>
            </nav>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl'>
              {t('certificates.heroTitle')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mx-auto max-w-2xl text-lg text-slate-200'>
              {t('certificates.heroSubtitle')}
            </motion.p>
          </div>
          <button
            onClick={() => setIsDark((v) => !v)}
            className='absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20'
            aria-label={isDark ? t('blogPost.lightMode') : t('blogPost.darkMode')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </section>

        {/* Verification */}
        <section className='mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-3xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/60 sm:p-8'>
            <h2 className='mb-4 text-xl font-bold text-slate-900 dark:text-white'>{t('certificates.verifyTitle')}</h2>
            <form onSubmit={verify} className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='relative'>
                  <label className='mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300'>{t('certificates.certIdLabel')}</label>
                  <input
                    type='text'
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder={t('certificates.certIdPlaceholder')}
                    className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                  />
                </div>
                <div className='relative'>
                  <label className='mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300'>{t('certificates.studentNameLabel')}</label>
                  <input
                    type='text'
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={t('certificates.studentNamePlaceholder')}
                    className='w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <button
                  type='submit'
                  disabled={verifying}
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary transition hover:bg-primary/90 disabled:opacity-60'
                >
                  {verifying ? <Loader2 size={18} className='animate-spin' /> : <Search size={18} />}
                  {t('certificates.verifyButton')}
                </button>
                <button
                  type='button'
                  onClick={clearVerification}
                  className='inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                >
                  <X size={18} /> {t('certificates.clearButton')}
                </button>
              </div>
            </form>

            {verifiedCert && (
              <div className='mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-900/20'>
                <div className='mb-3 flex items-center gap-2 text-emerald-700 dark:text-emerald-300'>
                  <BadgeCheck size={22} />
                  <span className='font-bold'>{t('certificates.verifySuccess')}</span>
                </div>
                <div className='grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2'>
                  <p><span className='font-semibold'>{t('certificates.certificateId')}:</span> {verifiedCert.certificate_id}</p>
                  <p><span className='font-semibold'>{t('certificates.title')}:</span> {verifiedCert.title}</p>
                  {verifiedCert.student_name && <p><span className='font-semibold'>{t('certificates.studentName')}:</span> {verifiedCert.student_name}</p>}
                  {verifiedCert.related_course && <p><span className='font-semibold'>{t('certificates.relatedCourse')}:</span> {verifiedCert.related_course}</p>}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <SectionTitle title={t('certificates.featuredTitle')} />
            <div className='flex gap-5 overflow-x-auto pb-4'>
              {featured.map((cert) => (
                <FeaturedCertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          </section>
        )}

        {/* All certificates */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <SectionTitle title={t('certificates.allTitle')} />
            <div className='relative sm:w-80'>
              <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('certificates.searchPlaceholder')}
                className='w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              />
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40'>
              {t('certificates.noResults')}
            </p>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          )}
        </section>

        {/* Benefits */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <SectionTitle title={t('certificates.benefitsTitle')} subtitle={t('certificates.benefitsSubtitle')} />
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {benefits.map((b) => (
              <BenefitCard key={b.title} icon={b.icon} title={b.title} description={b.description} />
            ))}
          </div>
        </section>

        {/* Stats */}
        {stats && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='rounded-3xl bg-gradient-to-br from-secondary to-slate-900 p-8 shadow-xl sm:p-12'>
              <div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4'>
                <div className='flex flex-col items-center'>
                  <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                    <Award size={28} />
                  </div>
                  <AnimatedCounter target={stats.certificates_issued} suffix='+' />
                  <p className='mt-1 text-sm font-medium text-slate-300'>{t('certificates.statCertificates')}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                    <Users size={28} />
                  </div>
                  <AnimatedCounter target={stats.certified_students} suffix='+' />
                  <p className='mt-1 text-sm font-medium text-slate-300'>{t('certificates.statStudents')}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                    <Building2 size={28} />
                  </div>
                  <AnimatedCounter target={stats.partner_organizations} suffix='+' />
                  <p className='mt-1 text-sm font-medium text-slate-300'>{t('certificates.statPartners')}</p>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                    <GraduationCap size={28} />
                  </div>
                  <AnimatedCounter target={stats.available_programs} suffix='+' />
                  <p className='mt-1 text-sm font-medium text-slate-300'>{t('certificates.statPrograms')}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How it works */}
        <section className='mx-auto mt-16 max-w-3xl px-4 sm:px-6 lg:px-8'>
          <SectionTitle title={t('certificates.howItWorksTitle')} subtitle={t('certificates.howItWorksSubtitle')} />
          <div className='rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-10'>
            {steps.map((step, idx) => (
              <StepCard key={idx} number={idx + 1} title={step.title} description={step.description} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className='mx-auto mt-16 max-w-3xl px-4 sm:px-6 lg:px-8'>
            <SectionTitle title={t('certificates.faqTitle')} />
            <div className='space-y-3'>
              {faqs.map((faq) => (
                <FAQItem key={faq.id} faq={faq} isOpen={openFaqs.has(faq.id)} onToggle={() => toggleFaq(faq.id)} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='relative overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-center text-white shadow-xl sm:px-10 sm:py-20'>
            <img
              src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'
              alt=''
              className='absolute inset-0 h-full w-full object-cover opacity-15'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70' />
            <div className='relative z-10'>
              <h2 className='mb-3 text-2xl font-bold sm:text-4xl'>{t('certificates.ctaTitle')}</h2>
              <p className='mx-auto mb-8 max-w-2xl text-slate-200'>{t('certificates.ctaSubtitle')}</p>
              <Link to='/packages' className='inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-secondary transition hover:bg-primary/90'>
                <GraduationCap size={20} /> {t('certificates.ctaButton')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
