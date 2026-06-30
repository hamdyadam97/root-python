import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  HeartPulse,
  Pill,
  Syringe,
  Microscope,
  Brain,
  Eye,
  Bone,
  Activity,
  FlaskConical,
  ArrowRight,
  Sparkles,
  Flame,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  stethoscope: Stethoscope,
  'heart-pulse': HeartPulse,
  heartpulse: HeartPulse,
  pill: Pill,
  syringe: Syringe,
  microscope: Microscope,
  brain: Brain,
  eye: Eye,
  bone: Bone,
  activity: Activity,
  flask: FlaskConical,
  flaskconical: FlaskConical,
};

export interface Specialty {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  packages_count?: number;
  questions_count?: number;
  is_top?: boolean;
  is_new?: boolean;
}

interface SpecialtyCardProps {
  specialty: Specialty;
  index?: number;
}

export function SpecialtyCard({ specialty, index = 0 }: SpecialtyCardProps) {
  const { t, i18n } = useTranslation();
  const Icon = ICON_MAP[(specialty.icon || '').toLowerCase()] || Stethoscope;

  const packagesCount = specialty.packages_count ?? 0;
  const isRtl = i18n.language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link
        to={`/packages/category/${specialty.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl sm:p-7"
      >
        {/* subtle medical pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, #002770 1.5px, transparent 1.5px)',
            backgroundSize: '18px 18px',
          }}
        />

        {/* gradient glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-10 -start-10 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        {/* Icon */}
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 text-primary shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
          <Icon size={32} />
        </div>

        {/* Title */}
        <h3 className="relative text-xl font-extrabold text-secondary transition-colors duration-300 group-hover:text-primary">
          {specialty.name}
        </h3>

        {/* Description */}
        <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {specialty.description || t('specialtyCard.fallbackDescription', 'Explore expert-curated exam packages designed for this specialty.')}
        </p>

        {/* Badges */}
        <div className="relative mt-5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {packagesCount} {t('specialtyCard.packages', 'Exam Packages')}
          </span>
          {specialty.is_top && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600 ring-1 ring-inset ring-amber-200">
              <Flame size={12} />
              {t('specialtyCard.mostPopular', 'Most Popular')}
            </span>
          )}
          {specialty.is_new && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 ring-1 ring-inset ring-emerald-200">
              <Sparkles size={12} />
              {t('specialtyCard.new', 'New')}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="relative mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
          <span className="text-xs font-semibold text-slate-400 transition-colors duration-300 group-hover:text-primary">
            {t('specialtyCard.browse', 'Browse packages')}
          </span>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-primary group-hover:text-white ${
              isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
            }`}
          >
            <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
