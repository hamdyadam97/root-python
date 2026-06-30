import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { sendSupport } from '@/store/supportSlice';
import type { AppDispatch } from '@/store';

export function SupportPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ question_id: '', question_text: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(sendSupport(form)).unwrap();
      toast.success('Support request sent');
      setForm({ question_id: '', question_text: '', message: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-secondary">{t('common.support')}</h1>
      <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Question ID</label>
          <input type="text" value={form.question_id} onChange={(e) => setForm({ ...form, question_id: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Question Text</label>
          <textarea value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={3} />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border px-3 py-2" rows={5} />
        </div>
        <button type="submit" disabled={loading} className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90 disabled:opacity-50">{t('common.submit')}</button>
      </form>
    </div>
  );
}
