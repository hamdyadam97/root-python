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
  Users,
  BookOpen,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  ArrowRight,
  Quote,
  Loader2,
  X,
  GraduationCap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';

interface Category {
  id: number;
  name: string;
}

interface Instructor {
  id: number;
  name: string;
  title?: string;
  image?: string | null;
  specialization?: string | null;
  category?: Category | null;
  bio?: string | null;
  years_of_experience?: number;
  students_count?: number;
  courses_count?: number;
  certificates_count?: number;
  rate?: number | string;
  facebook?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  is_featured?: boolean;
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
  is_verified?: boolean;
}

interface Stats {
  total_instructors: number;
  total_students: number;
  total_courses: number;
  certificates_issued: number;
  years_of_experience: number;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
    </svg>
  );
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

function SocialLinks({ instructor }: { instructor: Instructor }) {
  const links = [
    { href: instructor.facebook, icon: FacebookIcon, label: 'Facebook' },
    { href: instructor.twitter, icon: XIcon, label: 'X' },
    { href: instructor.linkedin, icon: LinkedInIcon, label: 'LinkedIn' },
  ].filter((l) => l.href);
  if (links.length === 0) return null;
  return (
    <div className='flex items-center gap-2'>
      {links.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href || '#'}
          target='_blank'
          rel='noreferrer'
          aria-label={label}
          className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-400'
        >
          <Icon className='h-4 w-4' />
        </a>
      ))}
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
      <button
        onClick={onToggle}
        className='flex w-full items-center justify-between gap-4 p-5 text-start'
        aria-expanded={isOpen}
      >
        <span className='font-bold text-slate-900 dark:text-white'>{faq.question}</span>
        <span className='shrink-0 rounded-full bg-slate-50 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300'>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className='border-t border-slate-100 px-5 pb-5 pt-0 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300'>
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
    <motion.div
      whileHover={{ y: -4 }}
      className='relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60'
    >
      <Quote className='absolute end-6 top-6 h-8 w-8 text-primary/20' />
      <div className='flex items-center gap-3'>
        {testimonial.profile_image ? (
          <img
            src={testimonial.profile_image}
            alt={testimonial.name}
            className='h-12 w-12 rounded-full object-cover'
            loading='lazy'
          />
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

function InstructorCard({ instructor, onSelect }: { instructor: Instructor; onSelect: (i: Instructor) => void }) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60'
    >
      <div className='relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={instructor.image || '/placeholder-instructor.jpg'}
          alt={instructor.name}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
          loading='lazy'
        />
        <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4'>
          <span className='rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-secondary backdrop-blur-sm'>
            {instructor.specialization}
          </span>
        </div>
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{instructor.name}</h3>
        {instructor.title && <p className='text-sm font-medium text-primary'>{instructor.title}</p>}
        <p className='mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
          {instructor.bio}
        </p>
        <div className='mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400'>
          <span className='inline-flex items-center gap-1'><Clock size={12} /> {instructor.years_of_experience ?? 0} {t('instructors.yearsExp')}</span>
          <span className='inline-flex items-center gap-1'><Users size={12} /> {instructor.students_count ?? 0}</span>
          <span className='inline-flex items-center gap-1'><BookOpen size={12} /> {instructor.courses_count ?? 0} {t('instructors.courses')}</span>
          <span className='inline-flex items-center gap-1'><Star size={12} className='text-amber-400' /> {Number(instructor.rate ?? 0).toFixed(1)}</span>
        </div>
        <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800'>
          <SocialLinks instructor={instructor} />
          <button
            onClick={() => onSelect(instructor)}
            className='inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-secondary/90'
          >
            {t('instructors.viewProfile')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedInstructorCard({ instructor, onSelect }: { instructor: Instructor; onSelect: (i: Instructor) => void }) {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className='flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60 sm:w-[320px]'
    >
      <div className='relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800'>
        <img
          src={instructor.image || '/placeholder-instructor.jpg'}
          alt={instructor.name}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <div className='mb-2 flex items-center justify-between'>
          <span className='rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'>
            {t('instructors.featuredTitle')}
          </span>
          <StarRating rating={instructor.rate} />
        </div>
        <h3 className='text-lg font-bold text-slate-900 dark:text-white'>{instructor.name}</h3>
        {instructor.title && <p className='text-sm font-medium text-primary'>{instructor.title}</p>}
        <p className='mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
          {instructor.bio}
        </p>
        <div className='mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400'>
          <span className='inline-flex items-center gap-1'><Users size={12} /> {instructor.students_count ?? 0}</span>
          <span className='inline-flex items-center gap-1'><BookOpen size={12} /> {instructor.courses_count ?? 0}</span>
        </div>
        <button
          onClick={() => onSelect(instructor)}
          className='mt-4 w-full rounded-xl bg-primary py-2 text-sm font-bold text-secondary transition hover:bg-primary/90'
        >
          {t('instructors.viewProfile')}
        </button>
      </div>
    </motion.div>
  );
}

function StatsSection({ stats }: { stats?: Stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  const items = [
    { key: 'total_instructors', icon: GraduationCap, value: stats.total_instructors },
    { key: 'total_students', icon: Users, value: stats.total_students },
    { key: 'total_courses', icon: BookOpen, value: stats.total_courses },
    { key: 'certificates_issued', icon: Award, value: stats.certificates_issued },
    { key: 'years_experience', icon: Clock, value: stats.years_of_experience },
  ];
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='rounded-3xl bg-gradient-to-br from-secondary to-slate-900 p-8 shadow-xl sm:p-12'>
        <div className='grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-5'>
          {items.map(({ key, icon: Icon, value }) => (
            <div key={key} className='flex flex-col items-center'>
              <div className='mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary backdrop-blur-sm'>
                <Icon size={28} />
              </div>
              <AnimatedCounter target={value} suffix='+' />
              <p className='mt-1 text-sm font-medium text-slate-300'>{t(`instructors.stats.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BecomeInstructor() {
  const { t } = useTranslation();
  return (
    <section className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-3xl bg-primary/10 px-6 py-14 dark:bg-slate-900/60 sm:px-12 sm:py-20'>
        <div className='relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:justify-between'>
          <div className='max-w-2xl text-center lg:text-start'>
            <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-secondary'>
              <GraduationCap size={32} />
            </div>
            <h2 className='mb-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('instructors.becomeTitle')}</h2>
            <p className='text-slate-600 dark:text-slate-300'>{t('instructors.becomeSubtitle')}</p>
          </div>
          <a
            href='mailto:partners@rootsexams.com?subject=Instructor Application'
            className='inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-3 font-bold text-white shadow-lg transition hover:bg-secondary/90'
          >
            {t('instructors.applyNow')} <ArrowRight size={18} />
          </a>
        </div>
        <Award className='absolute -bottom-6 -end-6 h-40 w-40 text-primary/10' />
      </div>
    </section>
  );
}

function FinalCTA() {
  const { t } = useTranslation();
  return (
    <section className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
      <div className='relative overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-white shadow-xl sm:px-10 sm:py-20'>
        <img
          src='https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80'
          alt=''
          className='absolute inset-0 h-full w-full object-cover opacity-15'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70' />
        <div className='relative z-10 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-4xl'>{t('instructors.ctaTitle')}</h2>
          <p className='mx-auto mb-8 max-w-2xl text-slate-200'>{t('instructors.ctaSubtitle')}</p>
          <div className='flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              to='/packages'
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-secondary transition hover:bg-primary/90'
            >
              {t('instructors.ctaExplore')}
            </Link>
            <a
              href='mailto:info@rootsexams.com'
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold backdrop-blur-sm transition hover:bg-white/10'
            >
              {t('instructors.ctaContact')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileModal({ instructor, onClose }: { instructor: Instructor; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className='relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-10'
        >
          <button
            onClick={onClose}
            className='absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            aria-label='Close'
          >
            <X size={20} />
          </button>
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
            <img
              src={instructor.image || '/placeholder-instructor.jpg'}
              alt={instructor.name}
              className='h-32 w-32 rounded-2xl object-cover shadow-lg sm:h-40 sm:w-40'
            />
            <div className='flex-1 text-center sm:text-start'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{instructor.name}</h2>
              {instructor.title && <p className='text-primary font-medium'>{instructor.title}</p>}
              <div className='mt-2 flex flex-wrap justify-center gap-2 sm:justify-start'>
                <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                  {instructor.specialization}
                </span>
                {instructor.category && (
                  <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                    {instructor.category.name}
                  </span>
                )}
              </div>
              <div className='mt-4 flex justify-center gap-6 text-sm sm:justify-start'>
                <div className='text-center'>
                  <p className='text-lg font-bold text-secondary dark:text-white'>{instructor.years_of_experience}</p>
                  <p className='text-xs text-slate-500'>{t('instructors.yearsExp')}</p>
                </div>
                <div className='text-center'>
                  <p className='text-lg font-bold text-secondary dark:text-white'>{instructor.students_count}</p>
                  <p className='text-xs text-slate-500'>{t('instructors.students')}</p>
                </div>
                <div className='text-center'>
                  <p className='text-lg font-bold text-secondary dark:text-white'>{instructor.courses_count}</p>
                  <p className='text-xs text-slate-500'>{t('instructors.courses')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6'>
            <h3 className='mb-2 font-bold text-slate-900 dark:text-white'>{t('instructors.viewProfile')}</h3>
            <p className='leading-relaxed text-slate-600 dark:text-slate-300'>{instructor.bio}</p>
          </div>
          <div className='mt-6 flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800'>
            <SocialLinks instructor={instructor} />
            <StarRating rating={instructor.rate} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function InstructorsPage() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Instructor[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selected, setSelected] = useState<Instructor | null>(null);

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [category, setCategory] = useState('all');
  const [experience, setExperience] = useState('all');
  const [sort, setSort] = useState<'popular' | 'rated' | 'newest'>('popular');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    api.get('/instructors').then((res) => {
      const data = res.data?.data || {};
      setFeatured(data.featured || []);
      setInstructors(data.instructors || []);
      setFaqs(data.faqs || []);
      setTestimonials(data.testimonials || []);
      setStats(data.stats || null);
    }).catch(() => toast.error(t('instructors.noResults'))).finally(() => setLoading(false));
  }, [t]);

  const specializations = useMemo(
    () => Array.from(new Set(instructors.map((i) => i.specialization).filter(Boolean) as string[])),
    [instructors]
  );
  const categories = useMemo(
    () => Array.from(new Set(instructors.map((i) => i.category?.name).filter(Boolean) as string[])),
    [instructors]
  );

  const filtered = useMemo(() => {
    let list = [...instructors];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.bio && i.bio.toLowerCase().includes(q)) ||
          (i.specialization && i.specialization.toLowerCase().includes(q))
      );
    }
    if (specialization !== 'all') {
      list = list.filter((i) => i.specialization === specialization);
    }
    if (category !== 'all') {
      list = list.filter((i) => i.category?.name === category);
    }
    if (experience !== 'all') {
      const years = (i: Instructor) => i.years_of_experience ?? 0;
      if (experience === 'beginner') list = list.filter((i) => years(i) >= 1 && years(i) <= 5);
      if (experience === 'intermediate') list = list.filter((i) => years(i) >= 6 && years(i) <= 10);
      if (experience === 'expert') list = list.filter((i) => years(i) > 10);
    }
    if (sort === 'popular') list.sort((a, b) => (b.students_count ?? 0) - (a.students_count ?? 0));
    if (sort === 'rated') list.sort((a, b) => Number(b.rate ?? 0) - Number(a.rate ?? 0));
    if (sort === 'newest') list.sort((a, b) => +new Date(b.created_at || 0) - +new Date(a.created_at || 0));
    return list;
  }, [instructors, search, specialization, category, experience, sort]);

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
                    <Home size={14} /> {t('instructors.breadcrumbHome')}
                  </Link>
                </li>
                <li><ChevronRight size={14} /></li>
                <li className='text-white' aria-current='page'>{t('instructors.breadcrumbInstructors')}</li>
              </ol>
            </nav>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mb-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl'
            >
              {t('instructors.heroTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='mx-auto max-w-2xl text-lg text-slate-200'
            >
              {t('instructors.heroSubtitle')}
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
                <Filter size={18} className='text-primary' /> {t('instructors.sortBy')}
              </span>
              <button onClick={() => setFiltersOpen((v) => !v)} className='text-sm font-semibold text-primary'>
                {filtersOpen ? t('common.close') : t('common.open', 'Open')}
              </button>
            </div>
            <div className={cn('grid gap-3 lg:grid-cols-5', !filtersOpen && 'hidden lg:grid')}>
              <div className='relative'>
                <Search className='absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <input
                  type='text'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('instructors.searchPlaceholder')}
                  className='w-full rounded-xl border border-slate-200 bg-white py-2.5 ps-9 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                />
              </div>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              >
                <option value='all'>{t('instructors.allSpecializations')}</option>
                {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              >
                <option value='all'>{t('instructors.allCategories')}</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              >
                <option value='all'>{t('instructors.allExperience')}</option>
                <option value='beginner'>{t('instructors.beginner')}</option>
                <option value='intermediate'>{t('instructors.intermediate')}</option>
                <option value='expert'>{t('instructors.expert')}</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white'
              >
                <option value='popular'>{t('instructors.mostPopular')}</option>
                <option value='rated'>{t('instructors.highestRated')}</option>
                <option value='newest'>{t('instructors.newest')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('instructors.featuredTitle')}</h2>
            </div>
            <div className='flex gap-5 overflow-x-auto pb-4'>
              {featured.map((instructor) => (
                <FeaturedInstructorCard key={instructor.id} instructor={instructor} onSelect={setSelected} />
              ))}
            </div>
          </section>
        )}

        {/* All instructors */}
        <section className='mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='h-8 w-1 rounded-full bg-primary' />
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>{t('instructors.allTitle')}</h2>
            </div>
            <span className='text-sm text-slate-500 dark:text-slate-400'>{filtered.length} {t('instructors.stats.total_instructors')}</span>
          </div>
          {filtered.length === 0 ? (
            <p className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40'>
              {t('instructors.noResults')}
            </p>
          ) : (
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filtered.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} onSelect={setSelected} />
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        <StatsSection stats={stats || undefined} />

        {/* Become instructor */}
        <BecomeInstructor />

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('instructors.testimonialsTitle')}</h2>
            </div>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mb-8 text-center'>
              <h2 className='text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl'>{t('instructors.faqTitle')}</h2>
            </div>
            <div className='space-y-3'>
              {faqs.map((faq) => (
                <FAQItem key={faq.id} faq={faq} isOpen={openFaqs.has(faq.id)} onToggle={() => toggleFaq(faq.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <FinalCTA />

        {/* Profile modal */}
        {selected && <ProfileModal instructor={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
