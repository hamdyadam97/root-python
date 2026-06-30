import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getExams } from '@/store/examSlice';
import type { AppDispatch, RootState } from '@/store';

export function ExamListPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { exams } = useSelector((state: RootState) => state.exam);

  useEffect(() => {
    dispatch(getExams());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary">{t('common.exams')}</h1>
        <Link to="/user/exam/create" className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">{t('exam.create')}</Link>
      </div>
      <div className="space-y-4">
        {(exams || []).map((exam: any) => (
          <div key={exam.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-secondary">{exam.title}</h3>
              <p className="text-sm text-gray-600">{exam.mode} • {exam.question_count} questions</p>
            </div>
            <Link to={`/user/exam/${exam.id}/show`} className="rounded-lg bg-secondary px-4 py-2 text-sm text-white hover:bg-secondary/90">
              {exam.status === 'completed' ? t('exam.result') : 'Continue'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
