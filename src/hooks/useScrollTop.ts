import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useScrollTop = () => {
  const navigate = useNavigate();

  const navigateAndScroll = useCallback((to: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(to);
  }, [navigate]);

  return navigateAndScroll;
}; 