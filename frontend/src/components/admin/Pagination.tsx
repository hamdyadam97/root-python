import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: Props) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{t('admin.table.rowsPerPage')}</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          {[10, 25, 50, 100].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {t('admin.table.showing')} {page} {t('admin.table.of')} {totalPages || 1}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-700"
        >
          {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
