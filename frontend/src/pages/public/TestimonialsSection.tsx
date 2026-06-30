import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {
  Star,
  Quote,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface Testimonial {
  id: number;
  name: string;
  specialty?: string | null;
  country?: string | null;
  profile_image?: string | null;
  is_verified?: boolean;
  content: string;
  rating?: number | null;
  created_at?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useTranslation();
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  const rating = testimonial.rating || 5;

  return (
    <div className="relative h-full rounded-[1.35rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:p-7">
      {/* quote icon */}
      <div className="absolute end-6 top-6 text-primary/10">
        <Quote size={48} />
      </div>

      {/* header */}
      <div className="relative mb-5 flex items-center gap-4">
        {testimonial.profile_image ? (
          <img
            src={testimonial.profile_image}
            alt={testimonial.name}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
            {initials}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-secondary">{testimonial.name}</h4>
            {testimonial.is_verified && (
              <BadgeCheck size={16} className="text-primary" aria-label={t('testimonials.verified', 'Verified Student')} />
            )}
          </div>
          <p className="text-xs text-slate-500">
            {testimonial.specialty}
            {testimonial.specialty && testimonial.country && ' • '}
            {testimonial.country}
          </p>
        </div>
      </div>

      {/* rating */}
      <div className="mb-4 flex items-center gap-1 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? 'currentColor' : 'none'}
            className={i < rating ? '' : 'text-slate-300'}
          />
        ))}
      </div>

      {/* review */}
      <p className="relative text-sm leading-relaxed text-slate-700">
        “{testimonial.content}”
      </p>

      {testimonial.created_at && (
        <p className="mt-5 text-xs text-slate-400">{formatDate(testimonial.created_at)}</p>
      )}
    </div>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t, i18n } = useTranslation();
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const isRtl = i18n.language === 'ar';

  const approved = testimonials.filter((t) => t.rating && t.content);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      {/* subtle pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #002770 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
            >
              {t('testimonials.badge', 'Student Stories')}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold text-secondary sm:text-4xl"
            >
              {t('testimonials.title', 'Students Testimonials')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-lg text-slate-600"
            >
              {t('testimonials.subtitle', 'Hear from medical professionals who advanced their careers with us.')}
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <button
              ref={prevRef}
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary shadow-sm transition-all duration-300 hover:border-primary hover:text-primary"
              aria-label={t('testimonials.prev', 'Previous')}
            >
              {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button
              ref={nextRef}
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-secondary shadow-sm transition-all duration-300 hover:border-primary hover:text-primary"
              aria-label={t('testimonials.next', 'Next')}
            >
              {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        {approved.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-slate-300 bg-white py-16 text-center"
          >
            <Users size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-secondary">
              {t('testimonials.emptyTitle', 'No testimonials yet')}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {t('testimonials.emptySubtitle', 'Be the first to share your experience.')}
            </p>
          </motion.div>
        ) : (
          <>
            <Swiper
              onSwiper={(swiper) => { swiperRef.current = swiper; }}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              loop={approved.length > 2}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-14"
            >
              {approved.map((item) => (
                <SwiperSlide key={item.id} className="!h-auto">
                  <TestimonialCard testimonial={item} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-8 text-center">
              <Link
                to="/testimonials"
                className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-white px-7 py-3 text-sm font-bold text-secondary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                {t('testimonials.viewAll', 'View All Reviews')}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
