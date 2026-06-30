import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  FileText,
  Clock,
  Calendar,
  Star,
  Users,
  Award,
  Flame,
  Sparkles,
  Eye,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import type { Package } from '@/types/package';

interface PackageCardProps {
  pkg: Package;
  index?: number;
  showPreview?: boolean;
}

function formatPrice(value: string | number | undefined | null) {
  if (value === undefined || value === null) return '0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isNaN(num) ? '0' : num.toFixed(2);
}

function getAccessPeriod(days: number | null | undefined, t: any) {
  if (!days) return t('packageCard.lifetime', 'Lifetime');
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `${years} ${t(years === 1 ? 'packageCard.year' : 'packageCard.years', years === 1 ? 'Year' : 'Years')}`;
  }
  return `${days} ${t('packageCard.days', 'days')}`;
}

function getDifficultyColor(level?: number | null) {
  switch (level) {
    case 1:
      return 'bg-emerald-50 text-emerald-600 ring-emerald-200';
    case 3:
      return 'bg-rose-50 text-rose-600 ring-rose-200';
    default:
      return 'bg-blue-50 text-blue-600 ring-blue-200';
  }
}

export function PackageCard({ pkg, index = 0, showPreview = true }: PackageCardProps) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const coverUrl = pkg.logo || pkg.icon;
  const categoryName = pkg.category?.name || t('packageCard.medical', 'Medical');
  const hasDiscount = !!pkg.discount_percentage && pkg.discount_percentage > 0;
  const finalPrice = formatPrice(pkg.price);
  const originalPrice = formatPrice(pkg.original_price);
  const rating = pkg.rating ? Number(pkg.rating).toFixed(1) : '0.0';
  const students = pkg.students_count ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={pkg.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
            <Stethoscope size={48} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Ribbons */}
        <div className="absolute start-4 top-4 flex flex-wrap gap-2">
          {pkg.is_bestseller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-white shadow">
              <Award size={12} />
              {t('packageCard.bestSeller', 'Best Seller')}
            </span>
          )}
          {pkg.is_new && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow">
              <Sparkles size={12} />
              {t('packageCard.new', 'New')}
            </span>
          )}
          {!pkg.is_bestseller && !pkg.is_new && pkg.students_count && pkg.students_count > 2000 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
              <Flame size={12} />
              {t('packageCard.popular', 'Popular')}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        {/* Specialty badge */}
        <span className="mb-3 w-fit rounded-full bg-secondary/5 px-3 py-1 text-xs font-bold text-secondary">
          {categoryName}
        </span>

        {/* Title & description */}
        <h3 className="text-xl font-extrabold text-secondary transition-colors duration-300 group-hover:text-primary">
          {pkg.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
          {pkg.description || t('packageCard.fallbackDescription', 'Comprehensive exam preparation package designed by medical experts.')}
        </p>

        {/* Meta grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HelpCircle size={14} className="text-primary" />
            <span>{pkg.number_of_questions ?? '-'} {t('common.questions', 'Questions')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            <span>{pkg.exam_count ?? '-'} {t('packageCard.mockExams', 'Mock Exams')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary" />
            <span>{pkg.duration_minutes ?? '-'} {t('packageCard.minutes', 'Min')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            <span>{getAccessPeriod(pkg.period_days, t)}</span>
          </div>
        </div>

        {/* Difficulty & Rating */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {pkg.difficulty_level && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${getDifficultyColor(
                pkg.difficulty_level
              )}`}
            >
              {pkg.difficulty_label || t('packageCard.intermediate', 'Intermediate')}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 ring-1 ring-inset ring-amber-200">
            <Star size={12} fill="currentColor" />
            {rating}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Users size={12} />
            {students.toLocaleString()} {t('packageCard.enrolled', 'enrolled')}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5 flex items-end gap-3">
          <p className="text-2xl font-extrabold text-primary">{finalPrice} JOD</p>
          {hasDiscount && (
            <p className="mb-1 text-sm font-medium text-slate-400 line-through">{originalPrice} JOD</p>
          )}
          {hasDiscount && (
            <span className="mb-1 rounded bg-rose-50 px-1.5 py-0.5 text-xs font-bold text-rose-600">
              -{pkg.discount_percentage}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-3 pt-2">
          <Link
            to={pkg.category?.id ? `/packages/category/${pkg.category.id}` : '/packages'}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
          >
            {t('packageCard.viewPackage', 'View Package')}
            <ArrowRight size={16} className={isRtl ? 'rotate-180' : ''} />
          </Link>
          {showPreview && (
            <button
              type="button"
              onClick={() => toast.info(t('packageCard.previewComingSoon', 'Preview coming soon'))}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-secondary transition-all duration-300 hover:border-primary hover:text-primary"
            >
              <Eye size={16} />
              {t('packageCard.preview', 'Preview')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
