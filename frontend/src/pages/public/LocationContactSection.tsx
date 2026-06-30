import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Navigation,
  MessageSquare,
} from 'lucide-react';

export interface AppInfo {
  map_url?: string | null;
  address?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  working_hours?: string | null;
}

interface LocationContactSectionProps {
  appInfo: AppInfo | null;
}

export function LocationContactSection({ appInfo }: LocationContactSectionProps) {
  const { t } = useTranslation();

  if (!appInfo) return null;

  const contactItems = [
    {
      icon: MapPin,
      label: t('location.address', 'Address'),
      value: appInfo.address,
      href: null,
    },
    {
      icon: Phone,
      label: t('location.phone', 'Phone'),
      value: appInfo.phone,
      href: appInfo.phone ? `tel:${appInfo.phone}` : null,
    },
    {
      icon: MessageCircle,
      label: t('location.whatsapp', 'WhatsApp'),
      value: appInfo.whatsapp,
      href: appInfo.whatsapp ? `https://wa.me/${appInfo.whatsapp.replace(/\D/g, '')}` : null,
    },
    {
      icon: Mail,
      label: t('location.email', 'Email'),
      value: appInfo.email,
      href: appInfo.email ? `mailto:${appInfo.email}` : null,
    },
    {
      icon: Clock,
      label: t('location.workingHours', 'Working Hours'),
      value: appInfo.working_hours,
      href: null,
    },
  ].filter((item) => item.value);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      {/* subtle pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #002770 1.5px, transparent 1.5px), radial-gradient(circle at 80% 80%, #06BFB0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary"
          >
            {t('location.badge', 'Visit Us')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-secondary sm:text-4xl"
          >
            {t('location.title', 'Our Location')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-3 max-w-2xl text-lg text-slate-600"
          >
            {t('location.subtitle', 'Reach out to us or visit our office. We are here to support your medical education journey.')}
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[1.35rem] border border-slate-100 bg-white p-2 shadow-sm lg:col-span-3"
          >
            {appInfo.map_url ? (
              <iframe
                src={appInfo.map_url}
                title={t('location.mapTitle', 'Office Location')}
                className="h-80 w-full rounded-2xl sm:h-96"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:h-96">
                {t('location.noMap', 'Map not configured')}
              </div>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {contactItems.map((item, idx) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 font-medium text-secondary">{item.value}</p>
                  </div>
                </div>
              );

              return item.href ? (
                <a key={idx} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {content}
                </a>
              ) : (
                <div key={idx}>{content}</div>
              );
            })}

            {/* Buttons */}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <a
                href={appInfo.map_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
              >
                <Navigation size={16} />
                {t('location.getDirections', 'Get Directions')}
              </a>
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-secondary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <MessageSquare size={16} />
                {t('location.contactUs', 'Contact Us')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
