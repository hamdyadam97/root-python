import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  Stethoscope,
  GraduationCap,
  Award,
  HeartPulse,
  Microscope,
  Users,
  BookOpen,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

function useCountUp(end: number, duration = 2.5) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

function CounterItem({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-3 shadow-sm backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-lg font-extrabold text-secondary">
          +<span ref={ref}>{count.toLocaleString()}</span>
        </p>
        <p className="text-xs text-slate-600">{label}</p>
      </div>
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay },
      }}
      className={`absolute flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-lg ${className}`}
    >
      <Icon size={22} />
    </motion.div>
  );
}

export function HeroSection() {
  const { t } = useTranslation();

  const counters = [
    { value: 10000, label: t('hero.students', 'Students'), icon: Users },
    { value: 500, label: t('hero.courses', 'Courses'), icon: BookOpen },
    { value: 100, label: t('hero.instructors', 'Certified Instructors'), icon: Award },
    { value: 20, label: t('hero.certifications', 'Professional Certifications'), icon: GraduationCap },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 py-16 lg:py-24">
      {/* Abstract shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 20%, rgba(6,191,176,0.10), transparent 35%), radial-gradient(circle at 10% 80%, rgba(0,39,112,0.06), transparent 30%)',
        }}
      />
      <div className="pointer-events-none absolute -start-20 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -end-20 bottom-20 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Award size={16} />
              <span>{t('hero.badge', 'Accredited Medical Education')}</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-secondary sm:text-5xl lg:text-6xl">
              {t('hero.title', 'Advance Your Medical Career with Accredited Training')}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              {t(
                'hero.description',
                'Join thousands of healthcare professionals mastering in-demand skills through expert-led courses, hands-on training, and globally recognized certifications.'
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/packages"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
              >
                {t('hero.browseCourses', 'Browse Courses')}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white px-7 py-3.5 text-sm font-bold text-secondary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <MessageCircle size={18} />
                {t('hero.contactUs', 'Contact Us')}
              </Link>
            </div>

            {/* Counters */}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {counters.map((c) => (
                <CounterItem key={c.label} value={c.value} label={c.label} icon={c.icon} />
              ))}
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-secondary to-primary p-1 shadow-2xl">
              <div className="relative overflow-hidden rounded-[1.35rem] bg-white p-6 sm:p-10">
                <svg
                  viewBox="0 0 400 340"
                  className="w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Background circles */}
                  <circle cx="320" cy="80" r="60" fill="#06BFB0" fillOpacity="0.12" />
                  <circle cx="80" cy="260" r="50" fill="#002770" fillOpacity="0.08" />

                  {/* Desk / monitor */}
                  <rect x="60" y="200" width="280" height="14" rx="7" fill="#E2E8F0" />
                  <rect x="180" y="214" width="40" height="26" rx="4" fill="#CBD5E1" />

                  {/* Doctor figure */}
                  <circle cx="200" cy="110" r="38" fill="#FDBA74" />
                  <path
                    d="M162 148c0-21 17-38 38-38s38 17 38 38v34h-76v-34z"
                    fill="#06BFB0"
                  />
                  <path d="M150 182h100v60a10 10 0 01-10 10H160a10 10 0 01-10-10v-60z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <path d="M150 182h100v34a10 10 0 01-10 10H160a10 10 0 01-10-10v-34z" fill="#F1F5F9" />

                  {/* Stethoscope */}
                  <path
                    d="M138 160c0-20 10-30 28-30M234 160c0-20-10-30-28-30"
                    stroke="#475569"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle cx="150" cy="190" r="8" fill="#EF4444" />
                  <circle cx="250" cy="190" r="8" fill="#EF4444" />

                  {/* Certificate */}
                  <rect x="260" y="120" width="80" height="60" rx="6" fill="#FFFFFF" stroke="#002770" strokeWidth="2" />
                  <circle cx="300" cy="150" r="12" fill="#06BFB0" fillOpacity="0.2" />
                  <path d="M294 150l4 4 8-8" stroke="#06BFB0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M270 170h60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
                  <path d="M270 178h40" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

                  {/* Book stack */}
                  <rect x="70" y="210" width="60" height="14" rx="3" fill="#002770" />
                  <rect x="75" y="196" width="50" height="14" rx="3" fill="#06BFB0" />
                  <rect x="80" y="182" width="40" height="14" rx="3" fill="#002770" />
                </svg>

                {/* Floating icons */}
                <FloatingIcon icon={Stethoscope} className="start-4 top-6" delay={0.1} />
                <FloatingIcon icon={Microscope} className="end-6 top-10" delay={0.3} />
                <FloatingIcon icon={HeartPulse} className="bottom-16 start-8" delay={0.5} />
                <FloatingIcon icon={GraduationCap} className="bottom-10 end-8" delay={0.7} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
