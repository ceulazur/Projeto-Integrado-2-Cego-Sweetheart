import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useScrollTop } from '../../hooks/useScrollTop';

import { useAuth } from '../../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validação manual de email
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Digite um email válido.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('admin-user', JSON.stringify(data.user));
        navigateAndScroll('/');
      } else {
        setError(data.error || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Add Google OAuth logic here
  };

  return (
    <main className="w-full mt-2 px-[5px]">
      <div className="text-4xl font-bold mb-[38px] text-center">
        <span className="text-black">Bem-vindo de</span>
        <span className="text-[rgba(12,135,212,1)]"> volta!</span>
      </div>
      
      {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}

      <p className="text-2xl font-medium mb-[38px] text-center">
        Preencha suas informações, por favor.
      </p>

      <div className="space-y-[38px]">
        <Button
          variant="secondary"
          theme="blue"
          onClick={handleGoogleLogin}
          className="flex w-full h-16 justify-center items-center gap-2.5 bg-[rgba(255,255,255,0.40)] hover:bg-[rgba(255,255,255,0.60)] rounded-xl border-2 border-gray-200 transition-all duration-200"
        >
          Logar-se com a Conta Google
        </Button>

        <div className="flex h-4 items-center gap-2 w-full">
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.64)]" />
          <span className="font-normal text-sm text-black px-4">
            Ou
          </span>
          <div className="flex-1 h-px bg-[rgba(0,0,0,0.64)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-[38px]">
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            theme="blue"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            error={error ? error : undefined}
            autoComplete="username"
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            theme="blue"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
          />

          <div className="flex w-full h-[17px] items-center gap-2.5">
            <label htmlFor="remember-password" className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                id="remember-password"
                checked={rememberPassword}
                onCheckedChange={(checked) => setRememberPassword(checked === true)}
                className="w-5 h-[17px] border-black accent-[#0C87D4]"
              />
              <span className="font-normal text-[15px] text-black shrink-0 max-sm:text-sm">
                Lembrar-se da senha ?
              </span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            theme="blue"
            className="flex w-full h-[79px] justify-center items-center gap-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-xl mt-[38px] text-center">
          <span className="font-normal text-xl text-black max-sm:text-base">
            Não tem uma conta?{' '}
          </span>
          <button
            type="button"
            className="font-bold text-xl text-black max-sm:text-base hover:text-[#0C87D4] transition-colors underline"
            onClick={() => navigateAndScroll('/register')}
          >
            Registre-se
          </button>
        </div>
      </div>
    </main>
  );
}; 