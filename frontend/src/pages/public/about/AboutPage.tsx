import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import {
  Award,
  Lightbulb,
  ShieldCheck,
  Users,
  TrendingUp,
  HeartHandshake,
  BookOpen,
  MonitorPlay,
  BadgeCheck,
  Headphones,
  Target,
  Eye,
  ArrowRight,
  Mail,
} from 'lucide-react';
import { TestimonialsSection } from '../TestimonialsSection';

function useCountUp(end: number, duration = 2.5) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return { count, ref };
}

function SectionHeading({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
      >
        {badge}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-extrabold text-secondary sm:text-4xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80"
          alt="About us"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-primary/80" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-white sm:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold sm:text-5xl lg:text-6xl"
        >
          {t('about.hero.title', 'About Us')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-90"
        >
          {t(
            'about.hero.subtitle',
            'We empower healthcare professionals with accredited medical education, exam preparation, and lifelong learning resources.'
          )}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-secondary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 hover:shadow-xl"
          >
            {t('about.hero.cta', 'Contact Us')}
            <ArrowRight size={18} className={`transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StorySection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="overflow-hidden rounded-[1.5rem] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80"
                alt="Company story"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary">
              {t('about.story.badge', 'Our Story')}
            </span>
            <h2 className="text-3xl font-extrabold text-secondary sm:text-4xl">
              {t('about.story.title', 'A Journey Towards Medical Excellence')}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              {t(
                'about.story.p1',
                'Founded by a team of medical educators and technology enthusiasts, our platform was born from a simple belief: every healthcare professional deserves access to world-class exam preparation and continuing education.'
              )}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {t(
                'about.story.p2',
                'From a small library of practice questions, we have grown into a comprehensive ecosystem serving thousands of students, institutions, and healthcare organizations across the region.'
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  const { t } = useTranslation();

  const cards = [
    {
      icon: Target,
      titleKey: 'about.mission.title',
      titleFallback: 'Our Mission',
      descKey: 'about.mission.description',
      descFallback:
        'To provide accessible, accredited, and high-quality medical education that helps healthcare professionals excel in their exams and careers.',
    },
    {
      icon: Eye,
      titleKey: 'about.vision.title',
      titleFallback: 'Our Vision',
      descKey: 'about.vision.description',
      descFallback:
        'To become the leading digital medical education platform trusted by healthcare professionals and institutions worldwide.',
    },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.missionVision.badge', 'Purpose')}
          title={t('about.missionVision.title', 'Mission & Vision')}
        />
        <div className="grid gap-8 md:grid-cols-2">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6 }}
                className="rounded-[1.35rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-secondary">{t(card.titleKey, card.titleFallback)}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{t(card.descKey, card.descFallback)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function ValuesSection() {
  const { t } = useTranslation();

  const values = [
    { icon: Award, titleKey: 'about.values.quality.title', titleFallback: 'Quality', descKey: 'about.values.quality.description', descFallback: 'We uphold the highest standards in every course, question, and exam we create.' },
    { icon: Lightbulb, titleKey: 'about.values.innovation.title', titleFallback: 'Innovation', descKey: 'about.values.innovation.description', descFallback: 'We continuously adopt modern technology to improve learning outcomes.' },
    { icon: ShieldCheck, titleKey: 'about.values.trust.title', titleFallback: 'Trust', descKey: 'about.values.trust.description', descFallback: 'Transparency and integrity guide every interaction with our learners.' },
    { icon: Users, titleKey: 'about.values.professionalism.title', titleFallback: 'Professionalism', descKey: 'about.values.professionalism.description', descFallback: 'Our team of medical experts ensures clinically accurate, reliable content.' },
    { icon: HeartHandshake, titleKey: 'about.values.customerSuccess.title', titleFallback: 'Customer Success', descKey: 'about.values.customerSuccess.description', descFallback: 'Your success is our success; we support you at every step.' },
    { icon: TrendingUp, titleKey: 'about.values.development.title', titleFallback: 'Continuous Development', descKey: 'about.values.development.description', descFallback: 'We never stop improving our platform, content, and user experience.' },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.values.badge', 'What We Stand For')}
          title={t('about.values.title', 'Our Values')}
          subtitle={t('about.values.subtitle', 'The principles that define our culture and drive our work every day.')}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="rounded-[1.25rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-extrabold text-secondary">{t(value.titleKey, value.titleFallback)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(value.descKey, value.descFallback)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, titleKey: 'about.why.feature1.title', titleFallback: 'Expert-Curated Content', descKey: 'about.why.feature1.description', descFallback: 'All materials are reviewed by certified medical professionals and educators.' },
    { icon: MonitorPlay, titleKey: 'about.why.feature2.title', titleFallback: 'Interactive Learning', descKey: 'about.why.feature2.description', descFallback: 'Engaging mock exams, analytics, and personalized study paths.' },
    { icon: BadgeCheck, titleKey: 'about.why.feature3.title', titleFallback: 'Accredited Programs', descKey: 'about.why.feature3.description', descFallback: 'Courses and packages aligned with recognized medical standards.' },
    { icon: Headphones, titleKey: 'about.why.feature4.title', titleFallback: 'Dedicated Support', descKey: 'about.why.feature4.description', descFallback: 'Our support team is ready to help you throughout your learning journey.' },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.why.badge', 'Why Us')}
          title={t('about.why.title', 'Why Choose Us')}
          subtitle={t('about.why.subtitle', 'Discover the advantages that make us the preferred choice for medical professionals.')}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-[1.25rem] border border-slate-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-extrabold text-secondary">{t(feature.titleKey, feature.titleFallback)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(feature.descKey, feature.descFallback)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { t } = useTranslation();

  const stats = [
    { value: 12000, suffix: '+', labelKey: 'about.stats.clients', labelFallback: 'Happy Clients' },
    { value: 500, suffix: '+', labelKey: 'about.stats.courses', labelFallback: 'Courses' },
    { value: 8500, suffix: '+', labelKey: 'about.stats.certificates', labelFallback: 'Certificates' },
    { value: 10, suffix: '+', labelKey: 'about.stats.experience', labelFallback: 'Years of Experience' },
    { value: 45, suffix: '+', labelKey: 'about.stats.team', labelFallback: 'Team Members' },
  ];

  return (
    <section className="relative overflow-hidden bg-secondary py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, idx) => {
            const { count, ref } = useCountUp(stat.value);
            return (
              <motion.div
                key={stat.labelKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="text-center"
              >
                <p className="text-4xl font-extrabold">
                  <span ref={ref}>{count.toLocaleString()}</span>
                  {stat.suffix}
                </p>
                <p className="mt-2 text-sm text-white/80">{t(stat.labelKey, stat.labelFallback)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const { t } = useTranslation();

  const team = [
    { name: 'Dr. Ahmad Khaldi', roleKey: 'about.team.role1', roleFallback: 'Founder & Medical Director', bioKey: 'about.team.bio1', bioFallback: 'Former university professor with 15+ years in medical education.', image: 'https://i.pravatar.cc/300?u=11' },
    { name: 'Dr. Sara Al-Omari', roleKey: 'about.team.role2', roleFallback: 'Head of Content', bioKey: 'about.team.bio2', bioFallback: 'Specialist in curriculum design and assessment development.', image: 'https://i.pravatar.cc/300?u=12' },
    { name: 'Omar Haddad', roleKey: 'about.team.role3', roleFallback: 'Chief Technology Officer', bioKey: 'about.team.bio3', bioFallback: 'Tech leader focused on building scalable learning platforms.', image: 'https://i.pravatar.cc/300?u=13' },
    { name: 'Lina Nasser', roleKey: 'about.team.role4', roleFallback: 'Student Success Manager', bioKey: 'about.team.bio4', bioFallback: 'Dedicated to helping every learner achieve their goals.', image: 'https://i.pravatar.cc/300?u=14' },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.team.badge', 'Our People')}
          title={t('about.team.title', 'Meet Our Team')}
          subtitle={t('about.team.subtitle', 'Passionate experts committed to transforming medical education.')}
        />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-secondary">{member.name}</h3>
                <p className="text-sm font-semibold text-primary">{t(member.roleKey, member.roleFallback)}</p>
                <p className="mt-2 text-sm text-slate-600">{t(member.bioKey, member.bioFallback)}</p>
                <div className="mt-4 flex items-center gap-3 text-slate-400">
                  <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="X (Twitter)" className="transition-colors hover:text-primary">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a href="#" aria-label="Email" className="transition-colors hover:text-primary"><Mail size={16} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


function TimelineSection() {
  const { t } = useTranslation();

  const events = [
    { year: '2016', titleKey: 'about.timeline.2016.title', titleFallback: 'Founded', descKey: 'about.timeline.2016.description', descFallback: 'Started with a mission to simplify medical exam preparation.' },
    { year: '2018', titleKey: 'about.timeline.2018.title', titleFallback: 'First 1,000 Students', descKey: 'about.timeline.2018.description', descFallback: 'Reached our first milestone of active learners.' },
    { year: '2020', titleKey: 'about.timeline.2020.title', titleFallback: 'Platform Expansion', descKey: 'about.timeline.2020.description', descFallback: 'Launched mock exams, analytics, and mobile-friendly access.' },
    { year: '2022', titleKey: 'about.timeline.2022.title', titleFallback: 'Partnerships', descKey: 'about.timeline.2022.description', descFallback: 'Collaborated with hospitals, universities, and medical associations.' },
    { year: '2026', titleKey: 'about.timeline.2026.title', titleFallback: 'Regional Leader', descKey: 'about.timeline.2026.description', descFallback: 'Serving tens of thousands of healthcare professionals across the region.' },
  ];

  return (
    <section className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.timeline.badge', 'Our Journey')}
          title={t('about.timeline.title', 'Company Timeline')}
        />
        <div className="relative">
          {/* vertical line */}
          <div className="absolute start-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary to-secondary sm:start-1/2 sm:-translate-x-1/2" />
          {events.map((event, idx) => (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative mb-12 flex items-start gap-6 sm:gap-0 ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
            >
              {/* node */}
              <div className="absolute start-4 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-primary shadow sm:start-1/2 sm:top-2" />

              {/* year */}
              <div className="hidden w-1/2 px-8 sm:block">
                <div className={`text-2xl font-extrabold text-secondary ${idx % 2 === 0 ? 'text-end' : 'text-start'}`}>{event.year}</div>
              </div>

              {/* card */}
              <div className="ms-10 w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:ms-0 sm:w-1/2 sm:px-8">
                <span className="text-sm font-bold text-primary sm:hidden">{event.year}</span>
                <h3 className="mt-1 text-lg font-extrabold text-secondary">{t(event.titleKey, event.titleFallback)}</h3>
                <p className="mt-2 text-sm text-slate-600">{t(event.descKey, event.descFallback)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutTestimonials() {
  const { t } = useTranslation();

  const testimonials = [
    { id: 1, name: 'Dr. Rania M.', specialty: 'Pediatrics', country: 'Jordan', profile_image: 'https://i.pravatar.cc/150?u=21', is_verified: true, content: 'This platform transformed the way I prepare for my board exams. Highly recommended!', rating: 5, created_at: '2026-05-12' },
    { id: 2, name: 'Ahmad K.', specialty: 'General Medicine', country: 'Saudi Arabia', profile_image: 'https://i.pravatar.cc/150?u=22', is_verified: true, content: 'The mock exams are very close to the real test. I passed on my first attempt.', rating: 5, created_at: '2026-04-20' },
    { id: 3, name: 'Lina S.', specialty: 'Pharmacy', country: 'UAE', profile_image: 'https://i.pravatar.cc/150?u=23', is_verified: true, content: 'Excellent support team and well-structured content. Worth every penny.', rating: 4, created_at: '2026-03-15' },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={t('about.testimonials.badge', 'Testimonials')}
          title={t('about.testimonials.title', 'What Our Students Say')}
        />
        <TestimonialsSection testimonials={testimonials} />
      </div>
    </section>
  );
}

function AboutCTA() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="relative overflow-hidden bg-secondary py-20 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary" />
      <div className="pointer-events-none absolute -start-20 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -end-20 bottom-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold sm:text-4xl"
        >
          {t('about.cta.title', 'Ready to Start Your Success Story?')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-white/90"
        >
          {t('about.cta.subtitle', 'Join a growing community of healthcare professionals and take the next step in your career.')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-bold text-secondary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
          >
            {t('about.cta.explore', 'Explore Packages')}
            <ArrowRight size={18} className={`transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
          >
            <Mail size={18} />
            {t('about.cta.contact', 'Contact Us')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <ValuesSection />
      <WhyChooseUsSection />
      <StatsSection />
      <TeamSection />
      <TimelineSection />
      <AboutTestimonials />
      <AboutCTA />
    </div>
  );
}
