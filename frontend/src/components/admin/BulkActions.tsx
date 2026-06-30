import { useTranslation } from 'react-i18next';
import { Archive, RotateCcw, Trash2, X } from 'lucide-react';

interface Props {
  count: number;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function BulkActions({ count, onArchive, onRestore, onDelete, onClear }: Props) {
  const { t } = useTranslation();
  if (!count) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary px-4 py-3 text-white shadow-lg">
      <span className="text-sm font-bold">{count} {t('admin.table.selected')}</span>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onArchive} className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20">
          <Archive size={14} /> {t('admin.actions.archive')}
        </button>
        <button type="button" onClick={onRestore} className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold transition hover:bg-white/20">
          <RotateCcw size={14} /> {t('admin.actions.restore')}
        </button>
        <button type="button" onClick={onDelete} className="flex items-center gap-1 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold transition hover:bg-rose-600">
          <Trash2 size={14} /> {t('admin.actions.delete')}
        </button>
        <button type="button" onClick={onClear} className="rounded-xl p-1.5 transition hover:bg-white/20">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
