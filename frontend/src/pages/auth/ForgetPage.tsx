import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { forgetPassword } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

export function ForgetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({ dial_code: '+962', mobile_number: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(forgetPassword({
        ...form,
        mobile: form.mobile_number.replace(/^0/, ''),
      })).unwrap();
      navigate('/otp');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-primary/20 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-secondary">{t('auth.forgetPassword')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t('auth.mobile')}</label>
            <div className="flex gap-2">
              <input value={form.dial_code} onChange={(e) => setForm({ ...form, dial_code: e.target.value })} className="w-20 rounded-lg border px-3 py-2" />
              <input required value={form.mobile_number} onChange={(e) => setForm({ ...form, mobile_number: e.target.value })} className="flex-1 rounded-lg border px-3 py-2" placeholder="795123456" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
            {loading ? t('common.loading') : t('auth.verify')}
          </button>
        </form>
      </div>
    </div>
  );
}
