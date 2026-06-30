import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { clsx } from 'clsx';
import type { AdminEntityConfig } from '@/config/adminEntities';

interface Props {
  open: boolean;
  onClose: () => void;
  config: AdminEntityConfig;
  initialData?: any;
  onSave: (data: any) => void;
}

export function EntityModal({ open, onClose, config, initialData, onSave }: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', description: '', status: 'active', meta: {} });

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm(initialData || { name: '', description: '', status: 'active', meta: {} });
    }
  }, [open, initialData]);

  if (!open) return null;

  const steps = [t('admin.entity.basicInfo'), t('admin.entity.settings')];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-700">
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
            {initialData ? t('admin.entity.edit', { entity: t(config.labelKey) }) : t('admin.entity.create', { entity: t(config.labelKey) })}
          </h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-700">
          {steps.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(idx)}
              className={clsx(
                'flex-1 py-3 text-sm font-bold transition',
                step === idx ? 'border-b-2 border-primary text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.entity.name')}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.entity.description')}</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{t('admin.filters.status')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {['active', 'inactive', 'archived'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      className={clsx(
                        'rounded-xl border px-4 py-3 text-sm font-bold transition',
                        form.status === s ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                      )}
                    >
                      {t(`admin.filters.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-700/30 dark:text-slate-400">
                {t('admin.entity.metadata')}: {config.columns.map((c) => t(c.labelKey)).join(', ')}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 p-5 dark:border-slate-700">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t('admin.actions.previous')}
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              {t('admin.actions.next')} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSave(form)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
            >
              <Save size={16} /> {t('admin.actions.save')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
