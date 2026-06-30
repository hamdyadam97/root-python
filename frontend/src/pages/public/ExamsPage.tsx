import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Search,
  Filter,
  Star,
  Clock,
  BookOpen,
  Quote,
  Mail,
  Send,
  Sun,
  Moon,
  Loader2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  PlayCircle,
  CheckCircle,
  ClipboardList,
  Target,
  Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';

interface Category {
  id: number;
  name: string;
  icon?: string;
  exams_count?: number;
}

interface RelatedCourse {
  id: number;
  name: string;
  logo?: string;
}

interface Exam {
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
  is_featured?: boolean;
  status?: number;
  order?: number;
  questions_count?: number;
  category?: Category;
  sub_category?: Category;
  sub_sub_category?: Category;
  related_course?: RelatedCourse | null;
  created_at?: string;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface Testimonial {
  id: number;
  name: string;
  content: string;
  rating?: number;
  specialty?: string;
  profile_image?: string;
}

interface Stats {
  total_exams: number;
  total_questions: number;
  total_attempts: number;
  certificates_issued: number;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function formatDuration(minutes?: number) {
  if (!minutes) return '0';
  if (minutes >= 60) {
    return `${(minutes / 60).toFixed(1)}h`;
  }
  return `${minutes}min`;
}

function StarRating({ rating }: { rating?: number | string }) {
  const value = Math.min(5, Math.max(0, Number(rating || 0)));
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            'fill-current',
            i <= Math.round(value) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'
          )}
        />
      ))}
      <span className='ms-1 text-xs font-semibold text-slate-600 dark:text-slate-300'>{value.toFixed(1)}</span>
    </div>
  );
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

function FAQItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900/60'>
      <button onClick={onToggle} className='flex w-full items-center justify-between gap-4 p-5 text-start' aria-expanded={isOpen}>
        <span className='font-bold text-slate-900 dark:text-white'>{faq.question}</span>
        <span className='shrink-0 rounded-full bg-slate-50 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className='border-t border-slate-100 px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300'>
              <p className='pt-3'>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div whileHover={{ y: -4 }} className='relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'>
      <Quote className='absolute end-6 top-6 h-8 w-8 text-primary/20' />
      <div className='flex items-center gap-3'>
        {testimonial.profile_image ? (
          <img src={testimonial.profile_image} alt={testimonial.name} className='h-12 w-12 rounded-full object-cover' loading='lazy' />
        ) : (
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white'>
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className='font-bold text-slate-900 dark:text-white'>{testimonial.name}</p>
          {testimonial.specialty && <p className='text-xs text-slate-500'>{testimonial.specialty}</p>}
        </div>
      </div>
      <p className='mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{testimonial.content}</p>
      {testimonial.rating && <div className='mt-4'><StarRating rating={testimonial.rating} /></div>}
    </motion.div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className='group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-secondary'>
        {category.icon ? <img src={category.icon} alt='' className='h-6 w-6 object-contain' loading='lazy' /> : <GraduationCap size={24} />}
      </div>
      <div>
        <h4 className='font-bold text-slate-900 dark:text-white'>{category.name}</h4>
        <p className='text-xs text-slate-500 dark:text-slate-400'>{category.exams_count ?? 0} {t('exams.examsCount')}</p>
      </div>
    </motion.div>
  );
}

function ExamMeta({ exam }: { exam: Exam }) {
  const { t } = useTranslation();
  return (
    <div className='mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
      <span className='inline-flex items-center gap-1' title={t('exams.duration')}><Clock size={12} /> {formatDuration(exam.duration_minutes)}</span>
      <span className='inline-flex items-center gap-1' title={t('exams.questions')}><BookOpen size={12} /> {exam.questions_count ?? 0}</span>
      {typeof exam.score === 'number' && (
        <span className='inline-flex items-center gap-1' title={t('exams.passingScore')}><Target size={12} /> {exam.score}%</span>
      )}
      <span className='inline-flex items-center gap-1' title={t('exams.attempts')}><Zap size={12} /> {exam.attempts_allowed ?? 1}</span>
      {exam.certificate_available && <span className='inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400'><Award size={12} /> {t('exams.certificate')}</span>}
    </div>
  );
}

function ExamCard({ exam, status }: { exam: Exam; status?: 'upcoming' | 'completed' }) {
  const { t } = useTranslation();

  const actionLabel = status === 'completed' ? t('exams.reviewExam') : status === 'upcoming' ? t('exams.continueExam') : t('exams.startExam');

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        {exam.icon ? (
          <img src={exam.icon} alt={exam.title} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' loading='lazy' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-slate-800 text-white'>
            <ClipboardList size={48} className='opacity-50' />
          </div>
        )}
        <div className='absolute start-3 top-3 flex flex-wrap gap-2'>
          {exam.difficulty_label && (
            <span className={cn(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              exam.difficulty_level === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
              exam.difficulty_level === 3 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
            )}>
              {exam.difficulty_label}
            </span>
          )}
          {status === 'completed' && (
            <span className='inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white'>
              <CheckCircle size={12} /> {t('exams.completed')}
            </span>
          )}
          {status === 'upcoming' && (
            <span className='inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-secondary'>
              <PlayCircle size={12} /> {t('exams.upcoming')}
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <div className='mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
          <span className='rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800'>{exam.category?.name}</span>
        </div>
        <Link to={`/exams/${exam.id}`} className='group/title'>
          <h3 className='mb-1 text-base font-bold text-slate-900 transition group-hover/title:text-primary dark:text-white line-clamp-2'>{exam.title}</h3>
        </Link>
        <p className='mb-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{exam.description}</p>
        <ExamMeta exam={exam} />
        {exam.related_course && (
          <div className='mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
            <BookOpen size={12} />
            <span>{exam.related_course.name}</span>
          </div>
        )}
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
          <button
            onClick={() => toast.info(t('exams.startExam') + ' — coming soon')}
            className='inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
          >
            {actionLabel}
          </button>
          <Link to={`/exams/${exam.id}`} className='text-xs font-semibold text-primary hover:underline'>
            {t('blog.readMore', 'View details')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedExamCard({ exam }: { exam: Exam }) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 sm:w-[360px]'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        {exam.icon ? (
          <img src={exam.icon} alt={exam.title} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-slate-800 text-white'>
            <ClipboardList size={48} className='opacity-50' />
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <span className='mb-2 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary'>{t('exams.featuredTitle')}</span>
        <Link to={`/exams/${exam.id}`}>
          <h3 className='mb-1 text-lg font-bold text-slate-900 transition hover:text-primary dark:text-white'>{exam.title}</h3>
        </Link>
        <p className='mb-3 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300'>{exam.description}</p>
        <ExamMeta exam={exam} />
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
          <button
            onClick={() => toast.info(t('exams.startExam') + ' — coming soon')}
            className='inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
          >
            {t('exams.startExam')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatsSection({ stats }: { stats?: Stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  const items = [
    { key: 'totalExams', icon: BookOpen, value: stats.total_exams },
    { key: 'totalQuestions', icon: Target, value: stats.total_questions },
    { key: 'totalAttempts', icon: TrendingUp, value: stats.total_attempts },
    { key: 'certificatesIssued', icon: Award, value: stats.certificates_issued },
  ];
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='rounded-3xl bg-gradient-to-br from-secondary to-slate-900 p-8 shadow-xl sm:p-12'>
        <div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4'>
          {items.map(({ key, icon: Icon, value }) => (
            <div key={key} className='flex flex-col items-center'>
              <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                <Icon size={28} />
              </div>
              <AnimatedCounter target={value} suffix='+' />
              <p className='mt-1 text-sm font-medium text-slate-300'>{t(`exams.stats.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error(t('footer.newsletter.invalid'));
      return;
    }
    toast.success(t('exams.newsletterSuccess'));
    setEmail('');
  };
  return (
    <section className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-slate-900 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16'>
        <div className='relative z-10 mx-auto max-w-2xl text-center'>
          <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm'>
            <Mail size={28} className='text-primary' />
          </div>
          <h2 className='mb-2 text-2xl font-bold sm:text-3xl'>{t('exams.newsletterTitle')}</h2>
          <p className='mb-6 text-slate-200'>{t('exams.newsletterSubtitle')}</p>
          <form onSubmit={submit} className='flex flex-col gap-3 sm:flex-row'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('exams.newsletterPlaceholder')}
              className='flex-1 rounded-xl border-0 bg-white/10 px-5 py-3 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
            <button type='submit' className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary transition hover:bg-primary/90'>
              {t('exams.newsletterButton')} <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const { t } = useTranslation();
  return (
    <section className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-white shadow-xl sm:px-10 sm:py-20'>
        <img
          src='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80'
          alt=''
          className='absolute inset-0 h-full w-full object-cover opacity-15'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70' />
        <div className='relative z-10 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-4xl'>{t('exams.ctaTitle')}</h2>
          <p className='mx-auto mb-8 max-w-2xl text-slate-200'>{t('exams.ctaSubtitle')}</p>
          <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link to='/exams' className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-secondary transition hover:bg-primary/90'>
              {t('exams.ctaExplore')}
            </Link>
            <a href='mailto:info@rootsexams.com' className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/10'>
              {t('exams.ctaContact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExamsPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Exam[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [upcoming, setUpcoming] = useState<Exam[]>([]);
  const [completed, setCompleted] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [duration, setDuration] = useState('all');
  const [status, setStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [course, setCourse] = useState('all');
  const [sort, setSort] = useState<'newest' | 'mostPopular' | 'hardest' | 'easiest'>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    api
      .get('/exams')
      .then((res) => {
        const data = res.data?.data || {};
        setFeatured(data.featured || []);
        setExams(data.exams || []);
        setUpcoming(data.upcoming || []);
        setCompleted(data.completed || []);
        setCategories(data.categories || []);
        setFaqs(data.faqs || []);
        setTestimonials(data.testimonials || []);
        setStats(data.stats || null);
      })
      .catch(() => toast.error(t('exams.noResults')))
      .finally(() => setLoading(false));
  }, [t]);

  const upcomingIds = useMemo(() => new Set(upcoming.map((e) => e.id)), [upcoming]);
  const completedIds = useMemo(() => new Set(completed.map((e) => e.id)), [completed]);

  const courses = useMemo(
    () => Array.from(new Set(exams.map((e) => e.related_course?.name).filter(Boolean) as string[])),
    [exams]
  );

  const filtered = useMemo(() => {
    let list = [...exams];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.category?.name && e.category.name.toLowerCase().includes(q)) ||
          (e.related_course?.name && e.related_course.name.toLowerCase().includes(q))
      );
    }
    if (category !== 'all') list = list.filter((e) => e.category?.name === category);
    if (course !== 'all') list = list.filter((e) => e.related_course?.name === course);
    if (difficulty !== 'all') {
      const map: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
      list = list.filter((e) => e.difficulty_level === map[difficulty]);
    }
    if (duration !== 'all') {
      const mins = (e: Exam) => e.duration_minutes ?? 0;
      if (duration === 'short') list = list.filter((e) => mins(e) < 30);
      if (duration === 'medium') list = list.filter((e) => mins(e) >= 30 && mins(e) <= 90);
      if (duration === 'long') list = list.filter((e) => mins(e) > 90);
    }
    if (status === 'active') list = list.filter((e) => e.status === 1);
    if (status === 'upcoming') list = list.filter((e) => upcomingIds.has(e.id));
    if (status === 'completed') list = list.filter((e) => completedIds.has(e.id));

    if (sort === 'mostPopular') list.sort((a, b) => (b.questions_count ?? 0) - (a.questions_count ?? 0));
    if (sort === 'hardest') list.sort((a, b) => (b.difficulty_level ?? 0) - (a.difficulty_level ?? 0));
    if (sort === 'easiest') list.sort((a, b) => (a.difficulty_level ?? 0) - (b.difficulty_level ?? 0));
    if (sort === 'newest') list.sort((a, b) => +new Date(b.created_at || 0) - +new Date(a.created_at || 0));
    return list;
  }, [exams, search, category, course, difficulty, duration, status, sort, upcomingIds, completedIds]);

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
                    <Home size={14} /> {t('exams.breadcrumbHome')}
                  </Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li className='text-white' aria-current='page'>{t('exams.breadcrumbExams')}</li>
              </ol>
            </nav>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl'>
              {t('exams.heroTitle')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mx-auto max-w-2xl text-lg text-slate-200'>
              {t('exams.heroSubtitle')}
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

        {/* Filters */}
        <section className='mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-2xl border border-slate-100 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 sm:p-6'>
            <div className='mb-4 flex items-center justify-between lg:hidden'>
              <span className='inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white'>
                <Filter size={18} className='text-primary' /> {t('exams.sortBy')}
              </span>
              <button onClick={() => setFiltersOpen((v) => !v)} className='text-sm font-semibold text-primary'>
                {filtersOpen ? t('common.close') : t('common.open', 'Open')}
              </button>
            </div>
            <div className={cn('grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8', !filtersOpen && 'hidden lg:grid')}>
              <div className='relative lg:col-span-2'>
                <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('exams.searchPlaceholder')}
                  className='w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('exams.allCategories')}</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('exams.allCourses')}</option>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('exams.allDifficulties')}</option>
                <option value='beginner'>{t('exams.beginner')}</option>
                <option value='intermediate'>{t('exams.intermediate')}</option>
                <option value='advanced'>{t('exams.advanced')}</option>
              </select>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('exams.allDurations')}</option>
                <option value='short'>{t('exams.short')}</option>
                <option value='medium'>{t('exams.medium')}</option>
                <option value='long'>{t('exams.long')}</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('exams.allStatuses')}</option>
                <option value='active'>{t('exams.active')}</option>
                <option value='upcoming'>{t('exams.upcoming')}</option>
                <option value='completed'>{t('exams.completed')}</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='newest'>{t('exams.newest')}</option>
                <option value='mostPopular'>{t('exams.mostPopular')}</option>
                <option value='hardest'>{t('exams.hardest')}</option>
                <option value='easiest'>{t('exams.easiest')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('exams.featuredTitle')}</h2>
            </div>
            <div className='flex gap-5 overflow-x-auto pb-4'>
              {featured.map((exam) => (
                <FeaturedExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-amber-400' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('exams.upcomingTitle')}</h2>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {upcoming.map((exam) => (
                <ExamCard key={exam.id} exam={exam} status='upcoming' />
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-emerald-500' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('exams.completedTitle')}</h2>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {completed.map((exam) => (
                <ExamCard key={exam.id} exam={exam} status='completed' />
              ))}
            </div>
          </section>
        )}

        {/* All exams */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('exams.allTitle')}</h2>
            </div>
            <span className='text-sm text-slate-500 dark:text-slate-400'>{filtered.length} {t('exams.allTitle')}</span>
          </div>
          {filtered.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40'>
              {t('exams.noResults')}
            </p>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <StatsSection stats={stats || undefined} />

        {/* Categories */}
        {categories.length > 0 && (
          <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('exams.categoriesTitle')}</h2>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('exams.testimonialsTitle')}</h2>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {testimonials.slice(0, 3).map((tm) => (
                <TestimonialCard key={tm.id} testimonial={tm} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('exams.faqTitle')}</h2>
            </div>
            <div className='space-y-3'>
              {faqs.map((faq) => (
                <FAQItem key={faq.id} faq={faq} isOpen={openFaqs.has(faq.id)} onToggle={() => toggleFaq(faq.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <Newsletter />

        {/* CTA */}
        <CTABanner />
      </div>
    </div>
  );
}
