import { useTranslation } from 'react-i18next';
import { Award, Eye, Download, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionCard } from './SectionCard';

const certs = [
  { id: 1, name: 'Internal Medicine Certification', date: '2026-05-15' },
  { id: 2, name: 'Surgery Fundamentals', date: '2026-04-22' },
];

export function CertificatesList() {
  const { t } = useTranslation();

  return (
    <SectionCard
      title={t('dashboard.certificates.title')}
      action={
        <Link to="/certificates" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
          {t('common.viewAll', 'View all')} <ChevronRight size={16} />
        </Link>
      }
      className="lg:col-span-1"
    >
      <div className="space-y-3">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-700/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-yellow-400 text-white shadow">
              <Award size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-secondary dark:text-white">{cert.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('dashboard.certificates.issueDate')}: {cert.date}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-primary dark:hover:bg-slate-800"
                aria-label={t('dashboard.certificates.view')}
              >
                <Eye size={18} />
              </button>
              <button
                type="button"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-primary dark:hover:bg-slate-800"
                aria-label={t('dashboard.certificates.download')}
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
