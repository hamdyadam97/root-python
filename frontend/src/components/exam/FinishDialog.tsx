import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  unanswered: number;
  flagged: number;
  review: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function FinishDialog({ unanswered, flagged, review, onCancel, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800">
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-extrabold">{t('examPlayer.finishDialog.title')}</h3>
            </div>
            <button type="button" onClick={onCancel} className="rounded-full p-1 hover:bg-white/20">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <p className="mb-4 text-slate-600 dark:text-slate-300">{t('examPlayer.finishDialog.confirm')}</p>
          <ul className="mb-6 space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400">{t('examPlayer.finishDialog.unanswered')}</span>
              <span className="font-extrabold text-secondary dark:text-white">{unanswered}</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400">{t('examPlayer.finishDialog.flagged')}</span>
              <span className="font-extrabold text-orange-500">{flagged}</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <span className="text-slate-500 dark:text-slate-400">{t('examPlayer.finishDialog.reviewLater')}</span>
              <span className="font-extrabold text-purple-500">{review}</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
            >
              {t('examPlayer.finishDialog.cancel')}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-xl bg-rose-500 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
            >
              {t('examPlayer.finishDialog.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
