import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  GraduationCap,
  HeartPulse,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Award,
  Clock,
} from 'lucide-react';

interface CTASectionProps {
  students?: number;
  packages?: number;
  successRate?: number;
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
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      animate={{ y: [0, -10, 0] }}
      className={`absolute hidden items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg backdrop-blur-md lg:flex ${className}`}
      style={{ animation: `float 4s ease-in-out ${delay}s infinite` }}
    >
      <Icon size={24} />
    </motion.div>
  );
}

export function CTASection({ students = 10000, packages = 50, successRate = 96 }: CTASectionProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80"
          alt="Medical professionals"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-primary/80" />
      </div>

      {/* Floating medical icons */}
      <FloatingIcon icon={Stethoscope} className="start-[8%] top-[15%] h-14 w-14" delay={0.1} />
      <FloatingIcon icon={HeartPulse} className="end-[10%] top-[20%] h-14 w-14" delay={0.3} />
      <FloatingIcon icon={GraduationCap} className="start-[12%] bottom-[20%] h-16 w-16" delay={0.5} />
      <FloatingIcon icon={ShieldCheck} className="end-[8%] bottom-[18%] h-14 w-14" delay={0.7} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md ring-1 ring-white/20 sm:p-12 lg:p-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white"
          >
            <Award size={16} />
            {t('cta.badge', 'Join Thousands of Healthcare Professionals')}
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl"
          >
            {t('cta.title', 'Start Your Medical Success Journey Today')}
          </motion.h2>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg"
          >
            {t(
              'cta.description',
              'Access high-quality exam preparation packages, practice questions, mock exams, and accredited learning resources designed for healthcare professionals.'
            )}
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/80"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <ShieldCheck size={14} />
              {t('cta.trust1', 'Accredited Content')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Clock size={14} />
              {t('cta.trust2', '24/7 Access')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
              <Award size={14} />
              {t('cta.trust3', 'Expert-Led')}
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/packages"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-secondary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl sm:w-auto"
            >
              {t('cta.explorePackages', 'Explore Packages')}
              <ArrowRight size={18} className={`transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:border-white sm:w-auto"
            >
              {t('cta.createAccount', 'Create Free Account')}
            </Link>
          </motion.div>

          {/* Glassmorphism stats card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-md sm:gap-6 sm:p-6"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white/80">
                <Users size={16} />
                <span className="text-lg font-extrabold text-white">{students.toLocaleString()}+</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{t('cta.students', 'Students')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white/80">
                <Package size={16} />
                <span className="text-lg font-extrabold text-white">{packages}+</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{t('cta.packages', 'Packages')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-white/80">
                <TrendingUp size={16} />
                <span className="text-lg font-extrabold text-white">{successRate}%</span>
              </div>
              <p className="mt-1 text-xs text-white/70">{t('cta.successRate', 'Success Rate')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
