import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { ImageViewer } from './ImageViewer';

interface Answer {
  id: number;
  answer: string;
}

interface Question {
  id: number;
  text_question: string;
  answers?: Answer[];
  correct_answer_id?: number | string;
  correct_answer_ids?: number[];
  notes?: string;
  references?: string;
  question_type?: string;
  is_review?: boolean;
}

interface Detail {
  answer_id?: number | null;
  answer_ids?: number[];
  is_correct?: boolean | null;
}

interface Props {
  question: Question;
  detail?: Detail;
  reviewMode: boolean;
  onSingleAnswer: (answerId: number) => void;
  onToggleMultiple: (answerId: number) => void;
  onTrueFalse: (value: boolean) => void;
  selectedIds: number[];
  showExplanation: boolean;
}

export function QuestionPanel({
  question,
  detail,
  reviewMode,
  onSingleAnswer,
  onToggleMultiple,
  onTrueFalse,
  selectedIds,
  showExplanation,
}: Props) {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const qType = question.question_type || 'single_choice';

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const imgs = container.querySelectorAll('img');
    const onClick = (e: Event) => {
      const target = e.currentTarget as HTMLImageElement;
      setImageSrc(target.src);
    };
    imgs.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', onClick);
    });
    return () => {
      imgs.forEach((img) => img.removeEventListener('click', onClick));
    };
  }, [question.text_question]);

  const correctId = Number(question.correct_answer_id);

  const isCorrectSelected = (answerId: number) => {
    if (qType === 'multiple_choice' && question.correct_answer_ids) {
      return question.correct_answer_ids.includes(answerId);
    }
    return answerId === correctId;
  };

  const optionBase = 'flex items-start gap-4 rounded-2xl border p-5 text-start transition-all duration-200';

  const getOptionClass = (answerId: number) => {
    const selected = selectedIds.includes(answerId);
    const correct = isCorrectSelected(answerId);
    const wrong = selected && !correct;

    if (showExplanation && reviewMode) {
      if (correct) return clsx(optionBase, 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10');
      if (wrong) return clsx(optionBase, 'border-rose-500 bg-rose-50/70 dark:bg-rose-500/10');
      return clsx(optionBase, 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800');
    }

    if (selected) return clsx(optionBase, 'border-primary bg-primary/5 shadow-md dark:border-primary dark:bg-primary/10');
    return clsx(optionBase, 'border-slate-200 bg-white hover:border-primary hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50');
  };

  const getIcon = (answerId: number) => {
    const selected = selectedIds.includes(answerId);
    const correct = isCorrectSelected(answerId);
    if (showExplanation && reviewMode) {
      if (correct) return <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={22} />;
      if (selected) return <XCircle className="mt-0.5 shrink-0 text-rose-500" size={22} />;
    }
    if (selected) return <div className="mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-primary bg-white" />;
    return <div className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-500" />;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {t(`examPlayer.questionType.${qType}`) || t('examPlayer.questionType.singleChoice')}
        </span>
        {reviewMode && (
          <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${detail?.is_correct ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {detail?.is_correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {detail?.is_correct ? t('examPlayer.correct') : t('examPlayer.wrong')}
          </span>
        )}
      </div>

      <div
        ref={contentRef}
        className="prose prose-slate max-w-none dark:prose-invert article-content mb-6 text-lg leading-relaxed text-slate-700 dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: question.text_question }}
      />

      <div className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        {qType === 'multiple_choice' ? t('examPlayer.selectAllThatApply') : t('examPlayer.selectAnswer')}
      </div>

      <div className="space-y-3">
        {qType === 'true_false' ? (
          [true, false].map((val) => {
            const selected = selectedIds.includes(val ? 1 : 0);
            const correct = showExplanation && reviewMode && (correctId === (val ? 1 : 0));
            return (
              <button
                key={String(val)}
                type="button"
                onClick={() => onTrueFalse(val)}
                disabled={showExplanation && reviewMode}
                className={clsx(
                  optionBase,
                  correct ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/10' :
                  selected ? 'border-primary bg-primary/5 dark:border-primary dark:bg-primary/10' :
                  'border-slate-200 bg-white hover:border-primary dark:border-slate-700 dark:bg-slate-800'
                )}
              >
                {correct ? <CheckCircle2 className="text-emerald-500" size={22} /> : getIcon(val ? 1 : 0)}
                <span className="font-bold text-secondary dark:text-white">{val ? 'True' : 'False'}</span>
              </button>
            );
          })
        ) : question.answers && question.answers.length > 0 ? (
          question.answers.map((ans) => (
            <button
              key={ans.id}
              type="button"
              onClick={() => qType === 'multiple_choice' ? onToggleMultiple(ans.id) : onSingleAnswer(ans.id)}
              disabled={showExplanation && reviewMode}
              className={getOptionClass(ans.id)}
            >
              {getIcon(ans.id)}
              <div className="min-w-0 flex-1">
                <div
                  className="text-start text-secondary dark:text-slate-100"
                  dangerouslySetInnerHTML={{ __html: ans.answer }}
                />
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800">
            <HelpCircle className="mx-auto mb-2" size={32} />
            {t('exam.questionTypeNotSupported', 'This question type is not supported yet.')}
          </div>
        )}
      </div>

      {showExplanation && reviewMode && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10">
          <h4 className="mb-2 flex items-center gap-2 text-lg font-bold text-primary">
            <CheckCircle2 size={20} /> {t('examPlayer.explanation')}
          </h4>
          <div
            className="prose prose-slate max-w-none dark:prose-invert text-sm"
            dangerouslySetInnerHTML={{ __html: question.notes || t('examPlayer.notes') }}
          />
          {question.references && (
            <div className="mt-4">
              <h5 className="mb-1 text-sm font-bold text-secondary dark:text-white">{t('examPlayer.references')}</h5>
              <div className="text-sm text-slate-600 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: question.references }} />
            </div>
          )}
        </div>
      )}

      <ImageViewer src={imageSrc} onClose={() => setImageSrc(null)} />
    </div>
  );
}
