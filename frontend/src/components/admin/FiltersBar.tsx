import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Download, Upload } from 'lucide-react';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
}

export function FiltersBar({ search, onSearch, status, onStatus }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative flex-1">
        <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={t('admin.actions.search')}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pe-4 ps-10 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="all">{t('admin.filters.all')}</option>
          <option value="active">{t('admin.filters.active')}</option>
          <option value="inactive">{t('admin.filters.inactive')}</option>
          <option value="archived">{t('admin.filters.archived')}</option>
        </select>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <SlidersHorizontal size={16} /> {t('admin.actions.filter')}
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Upload size={16} /> {t('admin.actions.import')}
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Download size={16} /> {t('admin.actions.export')}
        </button>
      </div>
    </div>
  );
}
