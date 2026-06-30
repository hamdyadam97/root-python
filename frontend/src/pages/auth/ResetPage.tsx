import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { resetPassword } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

export function ResetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(resetPassword(form)).unwrap();
      navigate('/user/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-primary/20 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-secondary">{t('auth.resetPassword')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t('auth.password')}</label>
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">{t('auth.confirmPassword')}</label>
            <input type="password" required minLength={8} value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
            {loading ? t('common.loading') : t('auth.resetPassword')}
          </button>
        </form>
      </div>
    </div>
  );
}
