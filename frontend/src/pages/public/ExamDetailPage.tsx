import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  ChevronLeft,
  Clock,
  BookOpen,
  Target,
  Zap,
  Award,
  Globe,
  FileText,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  PlayCircle,
  Sun,
  Moon,
  Loader2,
  GraduationCap,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';

interface Category {
  id: number;
  name: string;
  icon?: string;
}

interface Instructor {
  id: number;
  name: string;
  title?: string;
  image?: string;
  specialization?: string;
  bio?: string;
  years_of_experience?: number;
  students_count?: number;
  courses_count?: number;
  rate?: number | string;
}

interface RelatedCourse {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  price?: number | string;
  original_price?: number | string;
  category?: Category;
  instructor?: Instructor;
  rating?: number | string;
  students_count?: number;
}

interface RelatedExam {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  duration_minutes?: number;
  questions_count?: number;
  difficulty_label?: string;
  category?: Category;
}

interface ExamFeature {
  key: string;
  enabled: boolean;
}

interface ExamDetail {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  duration_minutes?: number;
  score?: number;
  attempts_allowed?: number;
  certificate_available?: boolean;
  difficulty_level?: number;
  difficulty_label?: string;
  language?: string;
  exam_type?: string;
  exam_type_label?: string;
  what_youll_be_tested_on?: string;
  skills_covered?: string;
  instructions?: string;
  requirements?: string;
  rules_policies?: string;
  features?: ExamFeature[];
  category?: Category;
  sub_category?: Category;
  instructor?: Instructor;
  questions_count?: number;
  related_courses?: RelatedCourse[];
  related_exams?: RelatedExam[];
  created_at?: string;
  updated_at?: string;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function formatDuration(minutes?: number) {
  if (!minutes) return '0';
  if (minutes >= 60) return `${(minutes / 60).toFixed(1)}h`;
  return `${minutes}min`;
}

function formatDate(date?: string, locale = 'en') {
  if (!date) return '-';
  return new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className='mb-4 flex items-center gap-3'>
      <div className='h-8 w-1 rounded-full bg-primary' />
      <h2 className='text-xl font-bold text-slate-900 dark:text-white sm:text-2xl'>{title}</h2>
    </div>
  );
}

function TextBlock({ title, content }: { title: string; content?: string }) {
  if (!content) return null;
  return (
    <section className='mb-10'>
      <SectionTitle title={title} />
      <div className='rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-6'>
        <p className='whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{content}</p>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className='flex items-start gap-3 py-3'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
        <Icon size={18} />
      </div>
      <div>
        <p className='text-xs font-medium text-slate-500 dark:text-slate-400'>{label}</p>
        <p className='font-semibold text-slate-900 dark:text-white'>{value}</p>
      </div>
    </div>
  );
}

function FeatureItem({ feature }: { feature: ExamFeature }) {
  const { t } = useTranslation();
  const label = t(`examDetail.feature_${feature.key}`, feature.key);
  return (
    <div className='flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60'>
      {feature.enabled ? (
        <CheckCircle2 size={22} className='shrink-0 text-emerald-500' />
      ) : (
        <XCircle size={22} className='shrink-0 text-slate-300 dark:text-slate-600' />
      )}
      <span className={cn('text-sm font-semibold', feature.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500')}>
        {label}
      </span>
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

function RelatedCourseCard({ course }: { course: RelatedCourse }) {
  const { t } = useTranslation();
  const price = Number(course.price ?? 0);
  const original = Number(course.original_price ?? 0);
  return (
    <motion.div whileHover={{ y: -4 }} className='flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'>
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img src={course.logo || '/placeholder-course.jpg'} alt={course.name} className='h-full w-full object-cover' loading='lazy' />
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <span className='mb-1 text-xs text-slate-500 dark:text-slate-400'>{course.category?.name}</span>
        <h4 className='mb-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2'>{course.name}</h4>
        <div className='mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
          {course.instructor && <span className='inline-flex items-center gap-1'><Users size={12} /> {course.instructor.name}</span>}
          {course.rating && <span className='inline-flex items-center gap-1'><Star size={12} className='text-amber-400' /> {Number(course.rating).toFixed(1)}</span>}
        </div>
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800'>
          <div className='flex flex-col'>
            {original > price && <span className='text-xs text-slate-400 line-through'>{original.toFixed(2)}</span>}
            <span className='text-sm font-extrabold text-secondary dark:text-white'>{price.toFixed(2)}</span>
          </div>
          <Link to='/packages' className='rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-secondary transition hover:bg-primary/90'>
            {t('courses.enroll')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function RelatedExamCard({ exam }: { exam: RelatedExam }) {
  return (
    <motion.div whileHover={{ y: -4 }} className='flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'>
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        {exam.icon ? (
          <img src={exam.icon} alt={exam.title} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-slate-800 text-white'>
            <FileText size={36} className='opacity-50' />
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <span className='mb-1 text-xs text-slate-500 dark:text-slate-400'>{exam.category?.name}</span>
        <h4 className='mb-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-2'>{exam.title}</h4>
        <div className='mt-auto flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
          <span className='inline-flex items-center gap-1'><Clock size={12} /> {formatDuration(exam.duration_minutes)}</span>
          <span className='inline-flex items-center gap-1'><BookOpen size={12} /> {exam.questions_count ?? 0}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function ExamDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!id) return;
    setLoading(true);
    api
      .get(`/exams/${id}`)
      .then((res) => {
        const data = res.data?.data || {};
        setExam(data.exam || null);
        setFaqs(data.faqs || []);
        if (data.exam?.title) {
          document.title = `${data.exam.title} | ${t('common.appName', 'RootsExams')}`;
        }
      })
      .catch(() => toast.error(t('examDetail.notFound')))
      .finally(() => setLoading(false));
  }, [id, t, i18n.language]);

  const toggleFaq = (faqId: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(faqId)) next.delete(faqId); else next.add(faqId);
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

  if (!exam) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <h1 className='mb-2 text-2xl font-bold text-slate-900 dark:text-white'>{t('examDetail.notFound')}</h1>
        <Link to='/exams' className='mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 font-bold text-secondary transition hover:bg-primary/90'>
          <ChevronLeft size={16} /> {t('examDetail.backToExams')}
        </Link>
      </div>
    );
  }

  const features = exam.features || [];
  const relatedCourses = exam.related_courses || [];
  const relatedExams = exam.related_exams || [];

  return (
    <div className={cn('min-h-screen bg-white transition-colors', isDark && 'dark')}>
      <div className='bg-white pb-16 dark:bg-slate-950'>
        {/* Hero */}
        <section className='relative overflow-hidden bg-gradient-to-br from-secondary to-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24'>
          <div className='relative z-10 mx-auto max-w-7xl'>
            <nav aria-label='Breadcrumb' className='mb-6'>
              <ol className='flex flex-wrap items-center gap-2 text-sm text-slate-300'>
                <li>
                  <Link to='/' className='inline-flex items-center gap-1 hover:text-primary'>
                    <Home size={14} /> {t('examDetail.breadcrumbHome')}
                  </Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li>
                  <Link to='/exams' className='hover:text-primary'>{t('examDetail.breadcrumbExams')}</Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li className='text-white' aria-current='page'>{exam.title}</li>
              </ol>
            </nav>

            <Link to='/exams' className='mb-4 inline-flex items-center gap-1 text-sm text-slate-300 hover:text-primary'>
              <ChevronLeft size={14} /> {t('examDetail.backToExams')}
            </Link>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl'>
              {exam.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='max-w-3xl text-lg text-slate-200'>
              {exam.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='mt-6 flex flex-wrap items-center gap-3 text-sm'>
              {exam.category && (
                <span className='inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm'>
                  <GraduationCap size={14} /> {exam.category.name}
                </span>
              )}
              {exam.difficulty_label && (
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold',
                  exam.difficulty_level === 1 ? 'bg-emerald-400/20 text-emerald-300' :
                  exam.difficulty_level === 3 ? 'bg-rose-400/20 text-rose-300' :
                  'bg-amber-400/20 text-amber-300'
                )}>
                  <Target size={14} /> {exam.difficulty_label}
                </span>
              )}
              {exam.exam_type_label && (
                <span className='inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm'>
                  <FileText size={14} /> {exam.exam_type_label}
                </span>
              )}
              {exam.instructor && (
                <span className='inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm'>
                  <Users size={14} /> {exam.instructor.name}
                </span>
              )}
              {relatedCourses[0] && (
                <span className='inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-sm'>
                  <BookOpen size={14} /> {relatedCourses[0].name}
                </span>
              )}
            </motion.div>
          </div>

          <button
            onClick={() => setIsDark((v) => !v)}
            className='absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20'
            aria-label={isDark ? t('blogPost.lightMode') : t('blogPost.darkMode')}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </section>

        {/* Main content */}
        <section className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {/* Left column */}
            <div className='lg:col-span-2'>
              <TextBlock title={t('examDetail.whatYoullBeTestedOn')} content={exam.what_youll_be_tested_on} />
              <TextBlock title={t('examDetail.skillsCovered')} content={exam.skills_covered} />
              <TextBlock title={t('examDetail.instructions')} content={exam.instructions} />
              <TextBlock title={t('examDetail.requirements')} content={exam.requirements} />
              <TextBlock title={t('examDetail.rulesAndPolicies')} content={exam.rules_policies} />

              {/* Features */}
              {features.length > 0 && (
                <section className='mb-10'>
                  <SectionTitle title={t('examDetail.featuresTitle')} />
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {features.map((feature) => (
                      <FeatureItem key={feature.key} feature={feature} />
                    ))}
                  </div>
                </section>
              )}

              {/* Instructor */}
              {exam.instructor && (
                <section className='mb-10'>
                  <SectionTitle title={t('examDetail.instructorTitle')} />
                  <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                      {exam.instructor.image ? (
                        <img src={exam.instructor.image} alt={exam.instructor.name} className='h-20 w-20 rounded-2xl object-cover' loading='lazy' />
                      ) : (
                        <div className='flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary'>
                          {exam.instructor.name.charAt(0)}
                        </div>
                      )}
                      <div className='flex-1'>
                        <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{exam.instructor.name}</h3>
                        <p className='text-sm text-slate-500 dark:text-slate-400'>{exam.instructor.title || exam.instructor.specialization}</p>
                        <div className='mt-2 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400'>
                          {exam.instructor.years_of_experience ? <span>{exam.instructor.years_of_experience} {t('instructors.yearsExp')}</span> : null}
                          {exam.instructor.students_count ? <span>{exam.instructor.students_count} {t('instructors.students')}</span> : null}
                          {exam.instructor.courses_count ? <span>{exam.instructor.courses_count} {t('instructors.courses')}</span> : null}
                          {exam.instructor.rate ? <span className='inline-flex items-center gap-1'><Star size={12} className='text-amber-400' /> {Number(exam.instructor.rate).toFixed(1)}</span> : null}
                        </div>
                      </div>
                    </div>
                    {exam.instructor.bio && <p className='mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{exam.instructor.bio}</p>}
                  </div>
                </section>
              )}

              {/* FAQ */}
              {faqs.length > 0 && (
                <section className='mb-10'>
                  <SectionTitle title={t('examDetail.faqTitle')} />
                  <div className='space-y-3'>
                    {faqs.map((faq) => (
                      <FAQItem key={faq.id} faq={faq} isOpen={openFaqs.has(faq.id)} onToggle={() => toggleFaq(faq.id)} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right sticky card */}
            <aside className='lg:col-span-1'>
              <div className='sticky top-24 space-y-6'>
                <div className='rounded-3xl border border-slate-100 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60'>
                  <h2 className='mb-4 text-xl font-bold text-slate-900 dark:text-white'>{t('examDetail.overviewTitle')}</h2>
                  <div className='divide-y divide-slate-100 dark:divide-slate-800'>
                    <InfoItem icon={Clock} label={t('examDetail.duration')} value={formatDuration(exam.duration_minutes)} />
                    <InfoItem icon={BookOpen} label={t('examDetail.questions')} value={exam.questions_count ?? 0} />
                    <InfoItem icon={Target} label={t('examDetail.passingScore')} value={`${exam.score ?? 0}%`} />
                    <InfoItem icon={Zap} label={t('examDetail.attemptsAllowed')} value={exam.attempts_allowed ?? 1} />
                    <InfoItem
                      icon={Award}
                      label={t('examDetail.certificateAvailable')}
                      value={exam.certificate_available ? t('common.yes', 'Yes') : t('common.no', 'No')}
                    />
                    <InfoItem icon={Globe} label={t('examDetail.language')} value={exam.language || '-'} />
                    <InfoItem icon={FileText} label={t('examDetail.examType')} value={exam.exam_type_label || exam.exam_type || '-'} />
                    <InfoItem icon={ShieldCheck} label={t('examDetail.lastUpdated')} value={formatDate(exam.updated_at || exam.created_at, i18n.language)} />
                  </div>
                  <button
                    onClick={() => toast.info(t('examDetail.startExam') + ' — coming soon')}
                    className='mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-secondary transition hover:bg-primary/90'
                  >
                    <PlayCircle size={20} /> {t('examDetail.startExam')}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Related courses */}
        {relatedCourses.length > 0 && (
          <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <SectionTitle title={t('examDetail.relatedCoursesTitle')} />
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {relatedCourses.map((course) => (
                <RelatedCourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Related exams */}
        {relatedExams.length > 0 && (
          <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <SectionTitle title={t('examDetail.relatedExamsTitle')} />
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {relatedExams.map((e) => (
                <Link key={e.id} to={`/exams/${e.id}`}>
                  <RelatedExamCard exam={e} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='relative overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-center text-white shadow-xl sm:px-10 sm:py-20'>
            <img
              src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80'
              alt=''
              className='absolute inset-0 h-full w-full object-cover opacity-15'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70' />
            <div className='relative z-10'>
              <h2 className='mb-3 text-2xl font-bold sm:text-4xl'>{t('examDetail.ctaTitle')}</h2>
              <p className='mx-auto mb-8 max-w-2xl text-slate-200'>{t('examDetail.ctaSubtitle')}</p>
              <button
                onClick={() => toast.info(t('examDetail.startExam') + ' — coming soon')}
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-bold text-secondary transition hover:bg-primary/90'
              >
                <PlayCircle size={22} /> {t('examDetail.startExam')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
