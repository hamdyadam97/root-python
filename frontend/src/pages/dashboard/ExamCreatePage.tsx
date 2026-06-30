import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchCreateData, fetchSubCategories, fetchSubSubCategories,
  fetchSections, storeExam, clearExamData,
} from '@/store/examSlice';
import { subscription } from '@/store/packagesSlice';
import type { AppDispatch, RootState } from '@/store';

import { PackageOverview } from '@/components/exam-builder/PackageOverview';
import { Stepper } from '@/components/exam-builder/Stepper';
import { SelectionGrid } from '@/components/exam-builder/SelectionGrid';
import { ExamModeSelector } from '@/components/exam-builder/ExamModeSelector';
import { DifficultySelector } from '@/components/exam-builder/DifficultySelector';
import { QuestionCountSlider } from '@/components/exam-builder/QuestionCountSlider';
import { DurationSelector } from '@/components/exam-builder/DurationSelector';
import { AdvancedSettings } from '@/components/exam-builder/AdvancedSettings';
import { ExamSummary } from '@/components/exam-builder/ExamSummary';
import { Recommendations } from '@/components/exam-builder/Recommendations';
import { QuickActions } from '@/components/exam-builder/QuickActions';
import { getIconForName } from '@/components/exam-builder/iconMap';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  available_questions?: number;
}

interface Advanced {
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showExplanations: boolean;
  showCorrect: boolean;
  allowReview: boolean;
  autoSave: boolean;
  countdown: boolean;
  fullscreen: boolean;
  saveTemplate: boolean;
}

const stepsKeys = ['specialty', 'category', 'subcategory', 'topic', 'configure'] as const;

export function ExamCreatePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isRTL = i18n.language === 'ar';

  const {
    categories, subCategories, subSubCategories, sections,
    totalQuestionsFromSections, subscriptions,
  } = useSelector((state: RootState) => ({
    categories: state.exam.categories as Item[],
    subCategories: state.exam.subCategories as Item[],
    subSubCategories: state.exam.subSubCategories as Item[],
    sections: state.exam.sections as Item[],
    totalQuestionsFromSections: state.exam.totalQuestionsFromSections,
    subscriptions: state.packages.subscriptions as any[],
  }));

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<number[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);

  const [mode, setMode] = useState('practice');
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(50);
  const [duration, setDuration] = useState('automatic');
  const [advanced, setAdvanced] = useState<Advanced>({
    randomizeQuestions: true,
    randomizeAnswers: true,
    showExplanations: true,
    showCorrect: false,
    allowReview: true,
    autoSave: true,
    countdown: true,
    fullscreen: false,
    saveTemplate: false,
  });

  useEffect(() => {
    dispatch(fetchCreateData());
    dispatch(subscription());
    return () => { dispatch(clearExamData()); };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSubCategories(selectedCategories));
    setSelectedSubCategories([]);
    setSelectedSubSubCategories([]);
    setSelectedSections([]);
  }, [selectedCategories, dispatch]);

  useEffect(() => {
    dispatch(fetchSubSubCategories(selectedSubCategories));
    setSelectedSubSubCategories([]);
    setSelectedSections([]);
  }, [selectedSubCategories, dispatch]);

  useEffect(() => {
    dispatch(fetchSections({
      categoryIds: selectedCategories,
      subCategoryIds: selectedSubCategories,
      subSubCategoryIds: selectedSubSubCategories,
    }));
    setSelectedSections([]);
  }, [selectedCategories, selectedSubCategories, selectedSubSubCategories, dispatch]);

  const activeSubscription = subscriptions?.[0];
  const packageTotal = activeSubscription?.package?.total_questions || 5000;
  const packageUsed = activeSubscription?.package?.used_questions || 1240;
  const packageName = activeSubscription?.package?.name || 'Elite Medical';
  const packageExpiry = activeSubscription?.end_date || '2026-12-31';

  const availableForSelection = totalQuestionsFromSections || packageTotal - packageUsed;
  const remainingAfter = Math.max(availableForSelection - questionCount, 0);

  const stepsLabels = stepsKeys.map((k) => t(`examBuilder.steps.${k}`));

  const stepItems: Record<number, Item[]> = {
    0: categories,
    1: subCategories,
    2: subSubCategories,
    3: sections,
  };

  const stepSelections: Record<number, [number[], React.Dispatch<React.SetStateAction<number[]>>]> = {
    0: [selectedCategories, setSelectedCategories],
    1: [selectedSubCategories, setSelectedSubCategories],
    2: [selectedSubSubCategories, setSelectedSubSubCategories],
    3: [selectedSections, setSelectedSections],
  };

  const selectedNames = (items: Item[], ids: number[]) =>
    items.filter((i) => ids.includes(i.id)).map((i) => i.name).join(', ') || '-';

  const summaryLabels = useMemo(() => ({
    specialty: selectedNames(categories, selectedCategories),
    category: selectedNames(subCategories, selectedSubCategories),
    subcategory: selectedNames(subSubCategories, selectedSubSubCategories),
    topic: selectedNames(sections, selectedSections),
  }), [categories, selectedCategories, subCategories, selectedSubCategories, subSubCategories, selectedSubSubCategories, sections, selectedSections]);

  const handleToggle = (id: number) => {
    const [, setter] = stepSelections[step];
    setter((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const [selected, setter] = stepSelections[step];
    const items = stepItems[step];
    setter(selected.length === items.length ? [] : items.map((i) => i.id));
  };

  const canProceed = stepSelections[step]?.[0].length > 0;

  const handleNext = () => {
    if (step < stepsKeys.length - 1) {
      if (!canProceed) {
        toast.error(t('examBuilder.alerts.selectCategory'));
        return;
      }
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleGenerate = async () => {
    if (!selectedCategories.length) {
      toast.error(t('examBuilder.alerts.selectCategory'));
      setStep(0);
      return;
    }
    setLoading(true);
    try {
      const backendMode = ['practice', 'wrongOnly', 'savedOnly', 'favoritesOnly', 'adaptive'].includes(mode) ? 'tatur' : 'exam';
      const durationMap: Record<string, number> = { automatic: 0, min30: 30, min45: 45, min60: 60, min90: 90, unlimited: 0 };
      const res: any = await dispatch(storeExam({
        exam_mode: backendMode,
        question_mode: 'all',
        is_timed_mode: duration !== 'unlimited',
        categories: selectedCategories,
        sub_categories: selectedSubCategories,
        sub_sub_categories: selectedSubSubCategories,
        sections: selectedSections,
        question_count: questionCount,
        duration_minutes: durationMap[duration] || 0,
        difficulty,
        ...advanced,
      })).unwrap();
      toast.success(t('examBuilder.alerts.examCreated'));
      navigate(`/user/exam/${res.data.exam_id}/show`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-secondary dark:text-white md:text-4xl">{t('examBuilder.title')}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{t('examBuilder.subtitle')}</p>
        </div>

        <PackageOverview
          name={packageName}
          total={packageTotal}
          used={packageUsed}
          expiry={packageExpiry}
        />

        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6">
          <Stepper steps={stepsLabels} current={step} onChange={setStep} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {step < 4 ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8"
                >
                  <SelectionGrid
                    title={t(`examBuilder.step.choose${stepsKeys[step].charAt(0).toUpperCase() + stepsKeys[step].slice(1)}` as any)}
                    items={stepItems[step]}
                    selected={stepSelections[step][0]}
                    onToggle={handleToggle}
                    iconFn={getIconForName}
                    showAll
                    onSelectAll={handleSelectAll}
                  />

                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={step === 0}
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-secondary transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t('common.previous', 'Back')}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                    >
                      {t('common.next', 'Next')} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <ExamModeSelector value={mode} onChange={setMode} />
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <DifficultySelector value={difficulty} onChange={setDifficulty} />
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <QuestionCountSlider value={questionCount} onChange={setQuestionCount} max={Math.min(200, availableForSelection)} />
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <DurationSelector value={duration} onChange={setDuration} />
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
                    <AdvancedSettings settings={advanced} onChange={(key, value) => setAdvanced((prev) => ({ ...prev, [key]: value }))} />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} {t('common.previous', 'Back')}
                    </button>
                    <div />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Recommendations />
            <QuickActions />
          </div>

          <div className="lg:col-span-1">
            <ExamSummary
              specialty={summaryLabels.specialty}
              category={summaryLabels.category}
              subcategory={summaryLabels.subcategory}
              topic={summaryLabels.topic}
              mode={mode}
              difficulty={difficulty}
              questionCount={questionCount}
              duration={duration}
              remainingAfter={remainingAfter}
              onGenerate={handleGenerate}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        </div>
      )}
    </div>
  );
}
