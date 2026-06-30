import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSignupModal } from '@/store/uiSlice';
import type { AppDispatch } from '@/store';

export function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(openSignupModal());
    navigate('/', { replace: true });
  }, [dispatch, navigate]);

  return null;
}
