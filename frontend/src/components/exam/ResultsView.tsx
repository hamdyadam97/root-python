import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  SkipForward,
  Timer,
  TrendingUp,
  AlertCircle,
  Download,
  Award,
  Share2,
  RotateCcw,
  ArrowLeft,
  Brain,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { CircularProgress } from './CircularProgress';
import { toast } from 'sonner';
import { useDarkMode } from '@/hooks/useDarkMode';

interface ReportItem {
  id: number;
  name: string;
  correct_answers: number;
  total_questions: number;
}

interface Report {
  title: string;
  result: ReportItem[];
}

interface Exam {
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  score?: number;
  duration?: number;
  title?: string;
}

interface Props {
  exam: Exam;
  examReport: Record<string, Report>;
  examId: number;
}

export function ResultsView({ exam, examReport, examId }: Props) {
  const { t } = useTranslation();
  const { isDark } = useDarkMode();

  const totalAnswered = (exam.correct_answers || 0) + (exam.wrong_answers || 0);
  const skipped = (exam.total_questions || 0) - totalAnswered;
  const percentage = exam.score ?? (totalAnswered ? Math.round((exam.correct_answers / totalAnswered) * 100) : 0);
  const passed = percentage >= 60;

  const categoryData = useMemo(() => {
    const cat = examReport?.category || examReport?.Category;
    if (!cat) return [];
    return cat.result.map((item) => ({
      name: item.name,
      correct: item.correct_answers,
      wrong: item.total_questions - item.correct_answers,
      total: item.total_questions,
      pct: item.total_questions ? Math.round((item.correct_answers / item.total_questions) * 100) : 0,
    }));
  }, [examReport]);

  const topicData = useMemo(() => {
    const topic = examReport?.topic || examReport?.Topic;
    if (!topic) return [];
    return topic.result.slice(0, 8).map((item) => ({
      name: item.name,
      value: item.total_questions ? Math.round((item.correct_answers / item.total_questions) * 100) : 0,
    }));
  }, [examReport]);

  const strengths = categoryData.filter((d) => d.pct >= 70).slice(0, 3);
  const weaknesses = categoryData.filter((d) => d.pct < 60).slice(0, 3);

  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: t('examResult.title'), text: `I scored ${percentage}% on ${exam.title}!` });
    } else {
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="space-y-8">
      {/* Score hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl ${passed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-orange-500'}`}
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-start">
            <h1 className="text-3xl font-extrabold md:text-4xl">{t('examResult.title')}</h1>
            <p className="mt-2 text-lg opacity-90">{exam.title}</p>
            <p className="mt-4 text-xl font-medium opacity-95">
              {passed ? t('examResult.passedMessage') : t('examResult.failedMessage')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
              >
                <Download size={18} /> {t('examResult.downloadPdf')}
              </button>
              {passed && (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
                >
                  <Award size={18} /> {t('examResult.downloadCertificate')}
                </button>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
              >
                <Share2 size={18} /> {t('examResult.shareResult')}
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center rounded-3xl bg-white/10 p-6 backdrop-blur-md">
            <CircularProgress value={percentage} color="#ffffff" />
            <p className="mt-3 text-3xl font-extrabold">{percentage}%</p>
            <span className={`mt-1 rounded-full px-3 py-1 text-xs font-bold ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {passed ? t('examResult.pass') : t('examResult.fail')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: CheckCircle2, label: t('examResult.correctAnswers'), value: exam.correct_answers || 0, color: 'text-emerald-500 bg-emerald-100' },
          { icon: XCircle, label: t('examResult.wrongAnswers'), value: exam.wrong_answers || 0, color: 'text-rose-500 bg-rose-100' },
          { icon: SkipForward, label: t('examResult.skippedQuestions'), value: skipped, color: 'text-slate-500 bg-slate-100' },
          { icon: Timer, label: t('examResult.timeSpent'), value: `${exam.duration || 45} min`, color: 'text-blue-500 bg-blue-100' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-3xl font-extrabold text-secondary dark:text-white">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examResult.performanceByCategory')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                  }}
                />
                <Bar dataKey="correct" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                <Bar dataKey="wrong" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-secondary dark:text-white">{t('examResult.performanceByTopic')}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    background: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                  }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {topicData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.value >= 60 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Strengths / Weaknesses / AI */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-600">
            <TrendingUp size={20} /> {t('examResult.strengths')}
          </h3>
          {strengths.length ? (
            <ul className="space-y-2">
              {strengths.map((s) => (
                <li key={s.name} className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {s.name} — {s.pct}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Keep practicing to identify strengths.</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-600">
            <AlertCircle size={20} /> {t('examResult.weaknesses')}
          </h3>
          {weaknesses.length ? (
            <ul className="space-y-2">
              {weaknesses.map((s) => (
                <li key={s.name} className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                  {s.name} — {s.pct}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Great job! No major weaknesses detected.</p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary">
            <Brain size={20} /> {t('examResult.aiRecommendations')}
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/30">Review weak categories before retaking.</li>
            <li className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/30">Practice 20 questions daily in {weaknesses[0]?.name || 'lowest topics'}.</li>
            <li className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/30">Take a timed mock exam next week.</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          to={`/user/exam/${examId}/show`}
          className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-6 py-3 text-sm font-bold text-white transition hover:bg-secondary/90"
        >
          <RotateCcw size={18} /> {t('examResult.retakeExam')}
        </Link>
        <Link
          to="/user/exam"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-secondary transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <ArrowLeft size={18} /> {t('examResult.backToExams')}
        </Link>
      </div>
    </div>
  );
}
