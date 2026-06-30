import { useTranslation } from 'react-i18next';
import { User, FileText, CheckCircle2, XCircle, Bookmark, Flag, Eye, Clock, Timer } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

interface Props {
  studentName: string;
  examName: string;
  currentIndex: number;
  total: number;
  answered: number;
  remaining: number;
  correct: number;
  wrong: number;
  saved: number;
  flagged: number;
  review: number;
  elapsedSeconds: number;
  totalSeconds?: number;
}

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function ExamSummary({
  studentName,
  examName,
  currentIndex,
  total,
  answered,
  remaining,
  correct,
  wrong,
  saved,
  flagged,
  review,
  elapsedSeconds,
  totalSeconds,
}: Props) {
  const { t } = useTranslation();
  const completion = total ? (answered / total) * 100 : 0;
  const remainingTime = totalSeconds ? Math.max(totalSeconds - elapsedSeconds, 0) : null;

  const rows = [
    { icon: User, label: t('examPlayer.summary.student'), value: studentName },
    { icon: FileText, label: t('examPlayer.summary.exam'), value: examName },
    { icon: CheckCircle2, label: t('examPlayer.summary.currentQuestion'), value: `${currentIndex + 1} / ${total}` },
    { icon: CheckCircle2, label: t('examPlayer.summary.answered'), value: answered, color: 'text-emerald-500' },
    { icon: Timer, label: t('examPlayer.summary.remaining'), value: remaining, color: 'text-slate-500' },
    { icon: CheckCircle2, label: t('examPlayer.summary.correct'), value: correct, color: 'text-emerald-500' },
    { icon: XCircle, label: t('examPlayer.summary.wrong'), value: wrong, color: 'text-rose-500' },
    { icon: Bookmark, label: t('examPlayer.summary.saved'), value: saved, color: 'text-amber-500' },
    { icon: Flag, label: t('examPlayer.summary.flagged'), value: flagged, color: 'text-orange-500' },
    { icon: Eye, label: t('examPlayer.summary.reviewLater'), value: review, color: 'text-purple-500' },
  ];

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {t('examPlayer.summary.exam')}
      </h2>

      <div className="mb-6 flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-3 text-center text-xs font-bold text-slate-500 dark:text-slate-400">{t('examPlayer.summary.completion')}</p>
        <CircularProgress value={completion} />
        <p className="mt-3 text-center text-lg font-extrabold text-secondary dark:text-white">{answered}/{total}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          <div>
            <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{t('examPlayer.summary.elapsed')}</p>
            <p className="text-sm font-bold text-secondary dark:text-white">{formatTime(elapsedSeconds)}</p>
          </div>
        </div>
        {remainingTime !== null && (
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-rose-500" />
            <div>
              <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{t('examPlayer.summary.remainingTime')}</p>
              <p className="text-sm font-bold text-secondary dark:text-white">{formatTime(remainingTime)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex items-center justify-between rounded-xl bg-white p-3 dark:bg-slate-800">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Icon size={16} />
                <span className="text-xs font-medium">{row.label}</span>
              </div>
              <span className={`text-sm font-bold ${row.color || 'text-secondary dark:text-white'}`}>{row.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
