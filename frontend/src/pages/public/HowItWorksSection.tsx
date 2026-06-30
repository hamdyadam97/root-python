import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Stethoscope, ClipboardCheck, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: User,
    titleKey: 'howItWorks.step1.title',
    titleFallback: 'Create Your Account',
    descKey: 'howItWorks.step1.description',
    descFallback: 'Sign up in seconds and access your personalized learning dashboard.',
  },
  {
    number: '02',
    icon: Stethoscope,
    titleKey: 'howItWorks.step2.title',
    titleFallback: 'Choose Your Medical Specialty',
    descKey: 'howItWorks.step2.description',
    descFallback: 'Browse all available medical specialties and select the one you want to study.',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    titleKey: 'howItWorks.step3.title',
    titleFallback: 'Select Your Exam Package',
    descKey: 'howItWorks.step3.description',
    descFallback: 'Choose the package that suits your goals and start practicing with questions, mock exams, and study materials immediately.',
  },
];

export function HowItWorksSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* subtle medical pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #06BFB0 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* soft background shapes */}
      <div className="pointer-events-none absolute -start-16 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -end-16 bottom-20 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
          >
            {t('howItWorks.badge', 'Simple Process')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-secondary sm:text-4xl"
          >
            {t('howItWorks.title', 'How It Works?')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-slate-600"
          >
            {t('howItWorks.subtitle', 'Start your learning journey in just three simple steps.')}
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="pointer-events-none absolute start-0 top-24 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

          {/* Connecting line — mobile */}
          <div className="pointer-events-none absolute start-11 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent lg:hidden" />

          <div className="relative grid gap-10 lg:grid-cols-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="group relative"
                >
                  {/* Card */}
                  <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl sm:p-8">
                    {/* gradient glow */}
                    <div className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Step number */}
                    <span className="absolute end-5 top-5 text-5xl font-extrabold text-slate-100 transition-colors duration-300 group-hover:text-primary/10 sm:text-6xl">
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={28} />
                    </div>

                    {/* Content */}
                    <h3 className="relative text-xl font-extrabold text-secondary">
                      {t(step.titleKey, step.titleFallback)}
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-slate-600">
                      {t(step.descKey, step.descFallback)}
                    </p>
                  </div>

                  {/* Timeline node */}
                  <div className="absolute start-11 top-24 hidden h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-primary shadow-md lg:start-1/2 lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-primary/90 hover:shadow-xl"
          >
            {t('howItWorks.cta', 'Start Learning Now')}
            <ArrowRight size={18} className={`transition-transform duration-300 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
