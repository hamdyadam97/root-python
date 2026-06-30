import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ColumnDef } from '@/config/adminEntities';

interface Row {
  id: number;
  [key: string]: any;
}

interface Props {
  columns: ColumnDef[];
  rows: Row[];
  loading?: boolean;
  selected: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
  onArchive?: (row: Row) => void;
  onDuplicate?: (row: Row) => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

export function DataTable({
  columns,
  rows,
  loading,
  selected,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onArchive,
  onDuplicate,
  sortKey,
  sortDir,
  onSort,
}: Props) {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10',
      inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700',
      archived: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10',
      pending: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10',
      published: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10',
      draft: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10',
      completed: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10',
      failed: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10',
    };
    return map[status?.toLowerCase()] || 'bg-slate-100 text-slate-600 dark:bg-slate-700';
  };

  const renderCell = (row: Row, col: ColumnDef) => {
    if (col.type === 'status') {
      return <span className={clsx('rounded-full px-2.5 py-1 text-xs font-bold uppercase', statusBadge(row[col.key]))}>{row[col.key]}</span>;
    }
    if (col.type === 'date') {
      return <span className="text-sm text-slate-500 dark:text-slate-400">{row[col.key]}</span>;
    }
    return <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{row[col.key]}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-4 py-4 text-start">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 accent-primary"
                />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-4 text-start">
                  <button
                    type="button"
                    onClick={() => onSort?.(col.key)}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {t(col.labelKey)}
                    {sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-4 py-4 text-end text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('admin.actions.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {rows.map((row) => (
              <tr key={row.id} className="group transition hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => onSelect(row.id)}
                    className="h-4 w-4 accent-primary"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    {renderCell(row, col)}
                  </td>
                ))}
                <td className="px-4 py-4 text-end">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {openMenu === row.id && (
                      <div className="absolute end-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                        <button onClick={() => { onEdit(row); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">
                          <Pencil size={14} /> {t('admin.actions.edit')}
                        </button>
                        {onDuplicate && (
                          <button onClick={() => { onDuplicate(row); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">
                            <Copy size={14} /> {t('admin.actions.duplicate')}
                          </button>
                        )}
                        {onArchive && (
                          <button onClick={() => { onArchive(row); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">
                            <Archive size={14} /> {t('admin.actions.archive')}
                          </button>
                        )}
                        <button onClick={() => { onDelete(row); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                          <Trash2 size={14} /> {t('admin.actions.delete')}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                  {t('admin.table.noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
