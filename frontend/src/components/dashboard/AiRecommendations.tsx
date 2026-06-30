import { useTranslation } from 'react-i18next';
import { Brain, FileText, BookOpen, Stethoscope, HelpCircle, ArrowRight } from 'lucide-react';
import { SectionCard } from './SectionCard';

const recs = [
  { key: 'recommendedExam', icon: FileText, color: 'bg-primary/10 text-primary', title: 'Surgery Mock Exam', desc: 'Based on your weak areas' },
  { key: 'recommendedCourse', icon: BookOpen, color: 'bg-blue-100 text-blue-600', title: 'Neurology Fundamentals', desc: 'Strengthen core concepts' },
  { key: 'recommendedSpecialty', icon: Stethoscope, color: 'bg-amber-100 text-amber-600', title: 'Critical Care', desc: 'High-yield specialty' },
  { key: 'practiceQuestions', icon: HelpCircle, color: 'bg-emerald-100 text-emerald-600', title: '50 Renal Questions', desc: 'Recommended for today' },
  { key: 'reviewTopics', icon: Brain, color: 'bg-purple-100 text-purple-600', title: 'Pharmacokinetics', desc: 'Review before next exam' },
];

export function AiRecommendations() {
  const { t } = useTranslation();

  return (
    <SectionCard title={t('dashboard.aiRecommendations.title')} className="lg:col-span-1">
      <div className="space-y-3">
        {recs.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.key}
              className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${rec.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-secondary dark:text-white">{rec.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{rec.desc}</p>
              </div>
              <ArrowRight size={16} className="mt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
