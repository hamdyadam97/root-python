import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@/store/uiSlice';
import type { AppDispatch } from '@/store';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(openLoginModal());
    navigate('/', { replace: true });
  }, [dispatch, navigate]);

  return null;
}
