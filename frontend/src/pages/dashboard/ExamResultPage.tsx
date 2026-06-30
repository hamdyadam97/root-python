import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { ResultsView } from '@/components/exam/ResultsView';

export function ExamResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get(`/exams/${id}/get`).then((res) => setData(res.data?.data));
  }, [id]);

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <ResultsView exam={data.exam} examReport={data.exam_report} examId={Number(id)} />
      </div>
    </div>
  );
}
