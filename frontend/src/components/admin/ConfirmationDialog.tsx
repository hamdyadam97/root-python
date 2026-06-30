import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmVariant?: 'danger' | 'primary';
}

export function ConfirmationDialog({ open, title, message, onCancel, onConfirm, confirmVariant = 'danger' }: Props) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle size={28} />
            <h3 className="text-xl font-extrabold">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300">{message}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {t('admin.actions.no')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition ${confirmVariant === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary hover:bg-primary/90'}`}
            >
              {t('admin.actions.yes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
