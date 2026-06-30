import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { saveExamSingle, finishExam, advanceStage } from '@/store/examSlice';
import type { AppDispatch, RootState } from '@/store';

import { ExamHeader } from '@/components/exam/ExamHeader';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { QuestionPanel } from '@/components/exam/QuestionPanel';
import { ExamSummary } from '@/components/exam/ExamSummary';
import { ExamToolbar } from '@/components/exam/ExamToolbar';
import { FinishDialog } from '@/components/exam/FinishDialog';

interface Detail {
  answer_id?: number | null;
  answer_ids?: number[];
  is_correct?: boolean | null;
  is_marked?: boolean;
}

interface QuestionData {
  id: number;
  text_question: string;
  answers?: { id: number; answer: string }[];
  correct_answer_id?: number | string;
  correct_answer_ids?: number[];
  notes?: string;
  references?: string;
  question_type?: string;
}

export function ExamShowPage() {
  const { id } = useParams<{ id: string }>();
  const examId = Number(id);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [questions, setQuestions] = useState<Record<number, QuestionData>>({});
  const [detailsMap, setDetailsMap] = useState<Record<number, Detail>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stageCompleted, setStageCompleted] = useState(false);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number[]>>({});
  const [showFinish, setShowFinish] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = t('examPlayer.alerts.unsavedChanges');
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [t]);

  useEffect(() => {
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    autoSaveRef.current = setInterval(() => {
      const currentQid = data?.questions?.[currentIndex];
      const selected = selectedAnswers[currentQid];
      if (currentQid && selected?.length) {
        persistAnswer(currentQid, selected);
      }
    }, 10000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [currentIndex, data, selectedAnswers]);

  const loadExam = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/exams/get-questions?exam_id=${examId}`);
      const d = res.data?.data;
      setData(d);
      const map: Record<number, Detail> = {};
      d.details?.forEach((det: any) => {
        map[det.question_id] = det;
      });
      setDetailsMap(map);
      if (d.questions?.length) {
        await loadQuestion(d.questions[0]);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (qid: number) => {
    if (questions[qid]) return;
    try {
      const res = await api.get(`/exams/${qid}/get-question`);
      setQuestions((prev) => ({ ...prev, [qid]: res.data?.data?.question }));
    } catch {
      toast.error('Failed to load question');
    }
  };

  const currentQid = data?.questions?.[currentIndex];
  const currentQuestion = questions[currentQid];
  const currentDetail = detailsMap[currentQid];
  const reviewMode = data?.exam?.mode === 'tatur' || data?.exam?.mode === 'review';

  const answeredCount = useMemo(
    () => data?.questions?.filter((qid: number) => detailsMap[qid]?.answer_id || selectedAnswers[qid]?.length).length || 0,
    [data, detailsMap, selectedAnswers]
  );
  const correctCount = useMemo(
    () => data?.questions?.filter((qid: number) => detailsMap[qid]?.is_correct).length || 0,
    [data, detailsMap]
  );
  const wrongCount = useMemo(
    () => data?.questions?.filter((qid: number) => detailsMap[qid]?.answer_id && detailsMap[qid]?.is_correct === false).length || 0,
    [data, detailsMap]
  );

  const persistAnswer = async (qid: number, selected: number[]) => {
    const question = questions[qid];
    if (!question || !selected.length) return;
    const answerId = selected[0];
    const correctId = Number(question.correct_answer_id);
    const isCorrect = answerId === correctId;
    try {
      await dispatch(
        saveExamSingle({
          examId,
          obj: { question_id: qid, answer_id: answerId, is_correct: isCorrect, is_marked: flagged.has(qid) },
        })
      ).unwrap();
      setDetailsMap((prev) => ({
        ...prev,
        [qid]: { ...prev[qid], answer_id: answerId, is_correct: isCorrect },
      }));
    } catch {
      // silent fail; autosave will retry
    }
  };

  const handleSingleAnswer = async (answerId: number) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQid]: [answerId] }));
    await persistAnswer(currentQid, [answerId]);
  };

  const handleToggleMultiple = (answerId: number) => {
    setSelectedAnswers((prev) => {
      const current = prev[currentQid] || [];
      const updated = current.includes(answerId) ? current.filter((id) => id !== answerId) : [...current, answerId];
      return { ...prev, [currentQid]: updated };
    });
  };

  const handleTrueFalse = async (value: boolean) => {
    const answerId = value ? 1 : 0;
    setSelectedAnswers((prev) => ({ ...prev, [currentQid]: [answerId] }));
    await persistAnswer(currentQid, [answerId]);
  };

  const handleClear = () => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQid]: [] }));
    setDetailsMap((prev) => ({ ...prev, [currentQid]: { ...prev[currentQid], answer_id: null, is_correct: null } }));
    toast.info(t('examPlayer.alerts.answerCleared'));
  };

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<number>>>, addMsg: string, removeMsg: string) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(currentQid)) {
        next.delete(currentQid);
        toast.info(removeMsg);
      } else {
        next.add(currentQid);
        toast.success(addMsg);
      }
      return next;
    });
  };

  const handleSave = () => toggleSet(setSaved, t('examPlayer.alerts.savedQuestion'), t('examPlayer.alerts.unsavedQuestion'));
  const handleFlag = () => toggleSet(setFlagged, t('examPlayer.alerts.flagged'), t('examPlayer.alerts.unflagged'));
  const handleReview = () => toggleSet(setReview, t('examPlayer.alerts.reviewLaterAdded'), t('examPlayer.alerts.reviewLaterRemoved'));

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
    const qid = data.questions[index];
    if (qid) loadQuestion(qid);
  };

  const handleNext = () => {
    if (currentIndex < data.questions.length - 1) handleNavigate(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) handleNavigate(currentIndex - 1);
  };

  const handleFinish = () => setShowFinish(true);

  const handleConfirmFinish = async () => {
    try {
      await dispatch(finishExam(examId)).unwrap();
      navigate(`/user/exam/${examId}/result`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to finish exam');
    }
  };

  const handleAdvance = async () => {
    await dispatch(advanceStage(examId)).unwrap();
    setStageCompleted(false);
    await loadExam();
    setCurrentIndex(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (stageCompleted) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-8 text-center dark:bg-slate-950">
        <div className="rounded-3xl bg-white p-10 shadow-xl dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-secondary dark:text-white">Stage Completed</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">You have completed stage {data.current_stage} of {data.total_stages}.</p>
          <button onClick={handleAdvance} className="mt-6 rounded-xl bg-primary px-8 py-3 font-bold text-white hover:bg-primary/90">Next Stage</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const stageText = `${t('exam.stage')} ${data.current_stage}/${data.total_stages} • ${t('exam.question')} ${currentIndex + 1 + (data.stage_offset || 0)}`;
  const selectedIds = selectedAnswers[currentQid] || (currentDetail?.answer_id ? [Number(currentDetail.answer_id)] : []);
  const unanswered = data.questions.length - answeredCount;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <ExamHeader
        examTitle={data.exam?.title}
        stageText={stageText}
        timerText={`${t('examPlayer.timer')}: ${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onExit={() => navigate('/user/exam')}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-72 overflow-y-auto border-e border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 lg:block">
          <QuestionNavigator
            questionIds={data.questions}
            detailsMap={detailsMap}
            currentIndex={currentIndex}
            saved={saved}
            flagged={flagged}
            review={review}
            onNavigate={handleNavigate}
          />
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="mx-auto max-w-4xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-10">
              <QuestionPanel
                question={currentQuestion}
                detail={currentDetail}
                reviewMode={reviewMode}
                onSingleAnswer={handleSingleAnswer}
                onToggleMultiple={handleToggleMultiple}
                onTrueFalse={handleTrueFalse}
                selectedIds={selectedIds}
                showExplanation={!!currentDetail?.answer_id || selectedIds.length > 0}
              />
            </div>
          </div>
          <ExamToolbar
            canPrevious={currentIndex > 0}
            canNext={currentIndex < data.questions.length - 1}
            isSaved={saved.has(currentQid)}
            isFlagged={flagged.has(currentQid)}
            isReview={review.has(currentQid)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
            onFlag={handleFlag}
            onReview={handleReview}
            onClear={handleClear}
            onFinish={handleFinish}
          />
        </main>

        <aside className="hidden w-80 overflow-y-auto border-s border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 xl:block">
          <ExamSummary
            studentName={`${String(user.first_name || '')} ${String(user.last_name || '')}`.trim() || t('common.user')}
            examName={data.exam?.title}
            currentIndex={currentIndex}
            total={data.questions.length}
            answered={answeredCount}
            remaining={unanswered}
            correct={correctCount}
            wrong={wrongCount}
            saved={saved.size}
            flagged={flagged.size}
            review={review.size}
            elapsedSeconds={elapsedSeconds}
            totalSeconds={data.exam?.duration ? data.exam.duration * 60 : undefined}
          />
        </aside>
      </div>

      {showFinish && (
        <FinishDialog
          unanswered={unanswered}
          flagged={flagged.size}
          review={review.size}
          onCancel={() => setShowFinish(false)}
          onConfirm={handleConfirmFinish}
        />
      )}
    </div>
  );
}
