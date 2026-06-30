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
  Users,
  Heart,
  Quote,
  Mail,
  Send,
  Sun,
  Moon,
  Loader2,
  GraduationCap,
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
  courses_count?: number;
}

interface Instructor {
  id: number;
  name: string;
  image?: string;
}

interface Course {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  price: number | string;
  original_price?: number | string;
  duration_minutes?: number;
  lessons_count?: number;
  students_count?: number;
  rating?: number | string;
  discount_percentage?: number;
  language?: string;
  difficulty_level?: number;
  difficulty_label?: string;
  category?: Category;
  instructor?: Instructor;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
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
  total_courses: number;
  total_students: number;
  total_instructors: number;
  certificates_issued: number;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function formatPrice(price?: number | string) {
  const val = Number(price ?? 0);
  return val.toFixed(2);
}

function formatDuration(minutes?: number) {
  if (!minutes) return '0';
  if (minutes >= 60) {
    const h = (minutes / 60).toFixed(1);
    return `${h}h`;
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

function WishlistButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label='Wishlist'
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border transition',
        active
          ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-900 dark:bg-rose-900/30'
          : 'border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-800 dark:hover:text-rose-400'
      )}
    >
      <Heart size={18} className={cn(active && 'fill-current')} />
    </button>
  );
}

function CourseCard({ course, wishlisted, onToggleWishlist }: { course: Course; wishlisted: boolean; onToggleWishlist: () => void }) {
  const { t } = useTranslation();
  const price = Number(course.price ?? 0);
  const original = Number(course.original_price ?? 0);
  const discount = course.discount_percentage ?? 0;
  const isFree = price === 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={course.logo || '/placeholder-course.jpg'}
          alt={course.name}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
          loading='lazy'
        />
        <div className='absolute start-3 top-3 flex flex-wrap gap-2'>
          {discount > 0 && (
            <span className='rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white'>-{discount}%</span>
          )}
          {course.is_bestseller && (
            <span className='rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-secondary'>{t('packageCard.bestSeller')}</span>
          )}
          {course.is_new && (
            <span className='rounded-full bg-emerald-400 px-2 py-0.5 text-xs font-bold text-secondary'>{t('packageCard.new')}</span>
          )}
        </div>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <div className='mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
          <span className='rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800'>{course.category?.name}</span>
          <span className='inline-flex items-center gap-1'><Clock size={12} /> {formatDuration(course.duration_minutes)}</span>
        </div>
        <h3 className='mb-1 text-base font-bold text-slate-900 dark:text-white line-clamp-2'>{course.name}</h3>
        <p className='mb-3 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>{course.description}</p>

        {course.instructor && (
          <div className='mb-3 flex items-center gap-2'>
            {course.instructor.image ? (
              <img src={course.instructor.image} alt={course.instructor.name} className='h-6 w-6 rounded-full object-cover' />
            ) : (
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary'>
                {course.instructor.name.charAt(0)}
              </div>
            )}
            <span className='text-xs text-slate-600 dark:text-slate-300'>{course.instructor.name}</span>
          </div>
        )}

        <div className='mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
          <span className='inline-flex items-center gap-1'><BookOpen size={12} /> {course.lessons_count ?? 0} {t('courses.lessons')}</span>
          <span className='inline-flex items-center gap-1'><Users size={12} /> {course.students_count ?? 0}</span>
          <StarRating rating={course.rating} />
        </div>

        <div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
          <div className='flex flex-col'>
            {original > price && <span className='text-xs text-slate-400 line-through'>{formatPrice(original)}</span>}
            <span className={cn('text-lg font-extrabold', isFree ? 'text-emerald-500' : 'text-secondary dark:text-white')}>
              {isFree ? t('courses.free') : `${formatPrice(price)}`}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <WishlistButton active={wishlisted} onClick={onToggleWishlist} />
            <button
              onClick={() => toast.info(t('packageCard.enrollComingSoon', 'Enrollment flow coming soon'))}
              className='inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
            >
              {t('courses.enroll')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCourseCard({ course, wishlisted, onToggleWishlist }: { course: Course; wishlisted: boolean; onToggleWishlist: () => void }) {
  const { t } = useTranslation();
  const price = Number(course.price ?? 0);
  const original = Number(course.original_price ?? 0);
  const discount = course.discount_percentage ?? 0;
  const isFree = price === 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 sm:w-[360px]'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img src={course.logo || '/placeholder-course.jpg'} alt={course.name} className='h-full w-full object-cover' loading='lazy' />
        {discount > 0 && <span className='absolute start-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white'>-{discount}%</span>}
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <span className='mb-2 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary'>{t('courses.featuredTitle')}</span>
        <h3 className='mb-1 text-lg font-bold text-slate-900 dark:text-white'>{course.name}</h3>
        <p className='mb-3 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300'>{course.description}</p>
        <div className='mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
          <span className='inline-flex items-center gap-1'><BookOpen size={12} /> {course.lessons_count ?? 0} {t('courses.lessons')}</span>
          <span className='inline-flex items-center gap-1'><Users size={12} /> {course.students_count ?? 0}</span>
          <StarRating rating={course.rating} />
        </div>
        <div className='mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
          <div className='flex flex-col'>
            {original > price && <span className='text-xs text-slate-400 line-through'>{formatPrice(original)}</span>}
            <span className={cn('text-lg font-extrabold', isFree ? 'text-emerald-500' : 'text-secondary dark:text-white')}>
              {isFree ? t('courses.free') : `${formatPrice(price)}`}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <WishlistButton active={wishlisted} onClick={onToggleWishlist} />
            <button
              onClick={() => toast.info(t('packageCard.enrollComingSoon', 'Enrollment flow coming soon'))}
              className='inline-flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-secondary transition hover:bg-primary/90'
            >
              {t('courses.enroll')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className='group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-secondary'>
        <GraduationCap size={24} />
      </div>
      <div>
        <h4 className='font-bold text-slate-900 dark:text-white'>{category.name}</h4>
        <p className='text-xs text-slate-500 dark:text-slate-400'>{category.courses_count ?? 0} courses</p>
      </div>
    </motion.div>
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

function StatsSection({ stats }: { stats?: Stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  const items = [
    { key: 'totalCourses', icon: BookOpen, value: stats.total_courses },
    { key: 'totalStudents', icon: Users, value: stats.total_students },
    { key: 'totalInstructors', icon: GraduationCap, value: stats.total_instructors },
    { key: 'certificatesIssued', icon: Mail, value: stats.certificates_issued },
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
              <p className='mt-1 text-sm font-medium text-slate-300'>{t(`courses.stats.${key}`)}</p>
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
    toast.success(t('courses.newsletterSuccess'));
    setEmail('');
  };
  return (
    <section className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-slate-900 px-6 py-12 text-white shadow-xl sm:px-10 sm:py-16'>
        <div className='relative z-10 mx-auto max-w-2xl text-center'>
          <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm'>
            <Mail size={28} className='text-primary' />
          </div>
          <h2 className='mb-2 text-2xl font-bold sm:text-3xl'>{t('courses.newsletterTitle')}</h2>
          <p className='mb-6 text-slate-200'>{t('courses.newsletterSubtitle')}</p>
          <form onSubmit={submit} className='flex flex-col gap-3 sm:flex-row'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('courses.newsletterPlaceholder')}
              className='flex-1 rounded-xl border-0 bg-white/10 px-5 py-3 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary'
              required
            />
            <button type='submit' className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary transition hover:bg-primary/90'>
              {t('courses.newsletterButton')} <Send size={16} />
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
          src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80'
          alt=''
          className='absolute inset-0 h-full w-full object-cover opacity-15'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70' />
        <div className='relative z-10 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-4xl'>{t('courses.ctaTitle')}</h2>
          <p className='mx-auto mb-8 max-w-2xl text-slate-200'>{t('courses.ctaSubtitle')}</p>
          <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link to='/packages' className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-secondary transition hover:bg-primary/90'>
              {t('courses.ctaExplore')}
            </Link>
            <a href='mailto:info@rootsexams.com' className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/10'>
              {t('courses.ctaContact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CoursesPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [instructor, setInstructor] = useState('all');
  const [price, setPrice] = useState<'all' | 'free' | 'paid'>('all');
  const [language, setLanguage] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [duration, setDuration] = useState('all');
  const [sort, setSort] = useState<'newest' | 'popular' | 'rated'>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    api
      .get('/courses')
      .then((res) => {
        const data = res.data?.data || {};
        setFeatured(data.featured || []);
        setCourses(data.courses || []);
        setCategories(data.categories || []);
        setInstructors(data.instructors || []);
        setFaqs(data.faqs || []);
        setTestimonials(data.testimonials || []);
        setStats(data.stats || null);
      })
      .catch(() => toast.error(t('courses.noResults')))
      .finally(() => setLoading(false));
  }, [t]);

  const languages = useMemo(
    () => Array.from(new Set(courses.map((c) => c.language).filter(Boolean) as string[])),
    [courses]
  );

  const filtered = useMemo(() => {
    let list = [...courses];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.category?.name && c.category.name.toLowerCase().includes(q))
      );
    }
    if (category !== 'all') list = list.filter((c) => c.category?.name === category);
    if (instructor !== 'all') list = list.filter((c) => c.instructor?.name === instructor);
    if (price === 'free') list = list.filter((c) => Number(c.price ?? 0) === 0);
    if (price === 'paid') list = list.filter((c) => Number(c.price ?? 0) > 0);
    if (language !== 'all') list = list.filter((c) => c.language === language);
    if (difficulty !== 'all') {
      const map: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
      list = list.filter((c) => c.difficulty_level === map[difficulty]);
    }
    if (duration !== 'all') {
      const mins = (c: Course) => c.duration_minutes ?? 0;
      if (duration === 'short') list = list.filter((c) => mins(c) < 180);
      if (duration === 'medium') list = list.filter((c) => mins(c) >= 180 && mins(c) <= 360);
      if (duration === 'long') list = list.filter((c) => mins(c) > 360);
    }
    if (sort === 'popular') list.sort((a, b) => (b.students_count ?? 0) - (a.students_count ?? 0));
    if (sort === 'rated') list.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
    if (sort === 'newest') list.sort((a, b) => +new Date(b.created_at || 0) - +new Date(a.created_at || 0));
    return list;
  }, [courses, search, category, instructor, price, language, difficulty, duration, sort]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
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
                    <Home size={14} /> {t('courses.breadcrumbHome')}
                  </Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li className='text-white' aria-current='page'>{t('courses.breadcrumbCourses')}</li>
              </ol>
            </nav>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl'>
              {t('courses.heroTitle')}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mx-auto max-w-2xl text-lg text-slate-200'>
              {t('courses.heroSubtitle')}
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
                <Filter size={18} className='text-primary' /> {t('courses.sortBy')}
              </span>
              <button onClick={() => setFiltersOpen((v) => !v)} className='text-sm font-semibold text-primary'>
                {filtersOpen ? t('common.close') : t('common.open', 'Open')}
              </button>
            </div>
            <div className={cn('grid gap-3 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-8', !filtersOpen && 'hidden lg:grid')}>
              <div className='relative lg:col-span-2'>
                <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('courses.searchPlaceholder')}
                  className='w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allCategories')}</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <select value={instructor} onChange={(e) => setInstructor(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allInstructors')}</option>
                {instructors.map((i) => <option key={i.id} value={i.name}>{i.name}</option>)}
              </select>
              <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allPrices')}</option>
                <option value='free'>{t('courses.free')}</option>
                <option value='paid'>{t('courses.paid')}</option>
              </select>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allLanguages')}</option>
                {languages.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allDifficulties')}</option>
                <option value='beginner'>{t('courses.beginner')}</option>
                <option value='intermediate'>{t('courses.intermediate')}</option>
                <option value='advanced'>{t('courses.advanced')}</option>
              </select>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='all'>{t('courses.allDurations')}</option>
                <option value='short'>{t('courses.short')}</option>
                <option value='medium'>{t('courses.medium')}</option>
                <option value='long'>{t('courses.long')}</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'>
                <option value='newest'>{t('courses.newest')}</option>
                <option value='popular'>{t('courses.mostPopular')}</option>
                <option value='rated'>{t('courses.highestRated')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('courses.featuredTitle')}</h2>
            </div>
            <div className='flex gap-5 overflow-x-auto pb-4'>
              {featured.map((course) => (
                <FeaturedCourseCard
                  key={course.id}
                  course={course}
                  wishlisted={wishlist.has(course.id)}
                  onToggleWishlist={() => toggleWishlist(course.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All courses */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('courses.allTitle')}</h2>
            </div>
            <span className='text-sm text-slate-500 dark:text-slate-400'>{filtered.length} {t('courses.stats.totalCourses')}</span>
          </div>
          {filtered.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40'>
              {t('courses.noResults')}
            </p>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  wishlisted={wishlist.has(course.id)}
                  onToggleWishlist={() => toggleWishlist(course.id)}
                />
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
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('courses.categoriesTitle')}</h2>
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
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('courses.testimonialsTitle')}</h2>
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
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('courses.faqTitle')}</h2>
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
