import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useScrollTop } from '../../hooks/useScrollTop';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigateAndScroll = useScrollTop();

  const handleLogout = () => {
    logout();
    navigateAndScroll('/login');
  };

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigateAndScroll('/')}
          className="text-2xl font-bold text-[#0C87D4] hover:text-[#0a6aa6] transition-colors"
        >
          Logo
        </button>
        {user && (
          <span className="text-lg font-medium">
            Olá, {user.firstName}!
          </span>
        )}
      </div>

      <nav>
        {user ? (
          <Button
            onClick={handleLogout}
            variant="secondary"
            theme="blue"
            className="text-lg font-medium hover:bg-[#0C87D4] hover:text-white transition-colors"
          >
            Sair
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={() => navigateAndScroll('/login')}
              variant="secondary"
              theme="blue"
              className="text-lg font-medium hover:bg-[#0C87D4] hover:text-white transition-colors"
            >
              Login
            </Button>
            <Button
              onClick={() => navigateAndScroll('/register')}
              theme="blue"
              className="text-lg font-medium"
            >
              Registrar
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}; 