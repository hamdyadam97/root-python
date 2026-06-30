import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export interface Partner {
  id: number;
  name: string;
  logo?: string | null;
  website_url?: string | null;
  order?: number;
}

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  const { t } = useTranslation();
  const active = partners.filter((p) => p.logo);

  if (active.length === 0) return null;

  // duplicate for seamless infinite scroll
  const items = [...active, ...active];

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
          >
            {t('partners.badge', 'Collaborations')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-secondary sm:text-4xl"
          >
            {t('partners.title', 'Our Partners')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-lg text-slate-600"
          >
            {t('partners.subtitle', 'Trusted by leading healthcare and educational institutions.')}
          </motion.p>
        </div>
      </div>

      {/* marquee */}
      <div className="relative">
        {/* fade edges */}
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {items.map((partner, idx) => (
            <a
              key={`${partner.id}-${idx}`}
              href={partner.website_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-4 flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md sm:mx-6 sm:w-52"
            >
              {partner.logo ? (
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-12 w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                />
              ) : (
                <span className="text-sm font-bold text-slate-400">{partner.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
