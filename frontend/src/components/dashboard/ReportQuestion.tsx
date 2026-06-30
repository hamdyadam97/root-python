import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Upload, X } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { toast } from 'sonner';

export function ReportQuestion() {
  const { t } = useTranslation();
  const [type, setType] = useState('wrongAnswer');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('dashboard.reportQuestion.success'));
    setFile(null);
  };

  return (
    <SectionCard title={t('dashboard.reportQuestion.title')} className="lg:col-span-1">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {[
            { key: 'wrongAnswer', value: 'wrongAnswer' },
            { key: 'duplicate', value: 'duplicate' },
            { key: 'technicalIssue', value: 'technicalIssue' },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                type === opt.value
                  ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                  : 'border-slate-100 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-700/30 dark:text-slate-300'
              }`}
            >
              <input
                type="radio"
                name="reportType"
                value={opt.value}
                checked={type === opt.value}
                onChange={() => setType(opt.value)}
                className="h-4 w-4 accent-primary"
              />
              {t(`dashboard.reportQuestion.${opt.key}`)}
            </label>
          ))}
        </div>

        <textarea
          rows={3}
          placeholder={t('common.describe', 'Describe the issue...')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            id="report-screenshot"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label
            htmlFor="report-screenshot"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-500 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            <Upload size={16} />
            {file ? file.name : t('dashboard.reportQuestion.uploadScreenshot')}
          </label>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-200 p-1 dark:bg-slate-700"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-sm font-bold text-white transition hover:bg-secondary/90"
        >
          <Flag size={16} /> {t('dashboard.reportQuestion.submit')}
        </button>
      </form>
    </SectionCard>
  );
}
