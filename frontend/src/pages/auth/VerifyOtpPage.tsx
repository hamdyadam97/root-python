import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { verifyOtp, resendOtp } from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store';

export function VerifyOtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isForget } = useSelector((state: RootState) => state.auth);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(verifyOtp({ otp, isForget })).unwrap();
      if (isForget) {
        navigate('/reset');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-primary/20 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-secondary">{t('auth.verify')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t('auth.otp')}</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border px-3 py-2 text-center text-2xl tracking-widest"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
            {loading ? t('common.loading') : t('auth.verify')}
          </button>
        </form>
        <button
          onClick={() => dispatch(resendOtp())}
          className="mt-4 w-full text-center text-sm text-primary hover:underline"
        >
          {t('auth.resendOtp')}
        </button>
      </div>
    </div>
  );
}
