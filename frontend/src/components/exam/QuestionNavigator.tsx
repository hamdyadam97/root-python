import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, Bookmark, Flag, Eye } from 'lucide-react';
import { clsx } from 'clsx';

interface Detail {
  answer_id?: number | null;
  is_correct?: boolean | null;
}

interface Props {
  questionIds: number[];
  detailsMap: Record<number, Detail>;
  currentIndex: number;
  saved: Set<number>;
  flagged: Set<number>;
  review: Set<number>;
  onNavigate: (index: number) => void;
}

export function QuestionNavigator({ questionIds, detailsMap, currentIndex, saved, flagged, review, onNavigate }: Props) {
  const { t } = useTranslation();

  const answered = questionIds.filter((id) => detailsMap[id]?.answer_id);
  const correct = questionIds.filter((id) => detailsMap[id]?.answer_id && detailsMap[id]?.is_correct);
  const wrong = questionIds.filter((id) => detailsMap[id]?.answer_id && detailsMap[id]?.is_correct === false);

  const counters = [
    { label: t('examPlayer.totalQuestions'), value: questionIds.length, color: 'bg-slate-100 text-slate-600' },
    { label: t('examPlayer.answered'), value: answered.length, color: 'bg-blue-100 text-blue-600' },
    { label: t('examPlayer.remaining'), value: questionIds.length - answered.length, color: 'bg-slate-100 text-slate-600' },
    { label: t('examPlayer.correct'), value: correct.length, color: 'bg-emerald-100 text-emerald-600' },
    { label: t('examPlayer.wrong'), value: wrong.length, color: 'bg-rose-100 text-rose-600' },
    { label: t('examPlayer.saved'), value: saved.size, color: 'bg-amber-100 text-amber-600' },
    { label: t('examPlayer.flagged'), value: flagged.size, color: 'bg-orange-100 text-orange-600' },
    { label: t('examPlayer.reviewLater'), value: review.size, color: 'bg-purple-100 text-purple-600' },
  ];

  const getState = (id: number, index: number) => {
    if (index === currentIndex) return 'current';
    if (flagged.has(id)) return 'flagged';
    if (saved.has(id)) return 'saved';
    if (review.has(id)) return 'review';
    const detail = detailsMap[id];
    if (detail?.answer_id) return detail.is_correct ? 'correct' : 'wrong';
    return 'empty';
  };

  const stateClasses: Record<string, string> = {
    current: 'bg-secondary text-white shadow-lg shadow-secondary/30 ring-2 ring-primary',
    flagged: 'bg-orange-100 text-orange-700 border-orange-200',
    saved: 'bg-amber-100 text-amber-700 border-amber-200',
    review: 'bg-purple-100 text-purple-700 border-purple-200',
    correct: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    wrong: 'bg-rose-100 text-rose-700 border-rose-200',
    empty: 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300',
  };

  const StateIcon = ({ state }: { state: string }) => {
    switch (state) {
      case 'correct': return <CheckCircle2 size={12} />;
      case 'wrong': return <XCircle size={12} />;
      case 'saved': return <Bookmark size={12} />;
      case 'flagged': return <Flag size={12} />;
      case 'review': return <Eye size={12} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t('examPlayer.questionNavigator')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {counters.slice(0, 4).map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-100 bg-white p-2 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-lg font-extrabold text-secondary dark:text-white">{c.value}</p>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {counters.slice(4).map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-100 bg-white p-2 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className={`text-base font-extrabold ${c.color.split(' ')[1]}`}>{c.value}</p>
              <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-4 gap-2">
          {questionIds.map((id, idx) => {
            const state = getState(id, idx);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(idx)}
                className={clsx(
                  'relative flex h-10 items-center justify-center rounded-xl border text-sm font-bold transition',
                  stateClasses[state]
                )}
                aria-label={`${t('examPlayer.question')} ${idx + 1}`}
              >
                {idx + 1}
                <span className="absolute -end-1 -top-1">
                  <StateIcon state={state} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-100 border border-emerald-200" /> {t('examPlayer.answeredCorrectly')}</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-100 border border-rose-200" /> {t('examPlayer.answeredIncorrectly')}</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-100 border border-amber-200" /> {t('examPlayer.saved')}</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-orange-100 border border-orange-200" /> {t('examPlayer.flagged')}</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-100 border border-purple-200" /> {t('examPlayer.markedForReview')}</div>
        <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-secondary" /> {t('examPlayer.currentQuestion')}</div>
      </div>
    </div>
  );
}
