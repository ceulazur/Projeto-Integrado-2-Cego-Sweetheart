import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useScrollTop } from '../../hooks/useScrollTop';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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
        // Salvar dados do usuário no localStorage e no contexto
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Login realizado com sucesso!');
        navigateAndScroll('/');
      } else {
        toast.error(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Erro ao fazer login. Tente novamente.');
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
      <div className="text-4xl font-bold mb-[38px]">
        <span className="text-black">Bem-vindo de</span>
        <span className="text-[rgba(12,135,212,1)]"> volta!</span>
      </div>
      
      <p className="text-2xl font-medium mb-[38px]">
        Preencha suas informações, por favor.
      </p>

      <div className="space-y-[38px]">
        <Button
          variant="secondary"
          theme="blue"
          onClick={handleGoogleLogin}
          className="flex w-[381px] h-[79px] justify-center items-center gap-2.5 bg-[rgba(255,255,255,0.40)] hover:bg-[rgba(255,255,255,0.60)]"
        >
          Logar-se com a Conta Google
        </Button>

        <div className="flex h-4 items-center gap-2 w-full">
          <div className="w-[169px] h-px bg-[rgba(0,0,0,0.64)]" />
          <span className="font-normal text-sm text-black">
            Ou
          </span>
          <div className="w-[186px] h-px bg-[rgba(0,0,0,0.64)]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-[38px]">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="email"
            name="email"
            theme="blue"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="password"
            name="password"
            theme="blue"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <div className="flex w-[166px] h-[17px] items-center gap-2.5">
            <label htmlFor="remember-password" className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                id="remember-password"
                checked={rememberPassword}
                onCheckedChange={(checked) => setRememberPassword(checked === true)}
                className="w-5 h-[17px] border-black accent-[#0C87D4]"
              />
              <span className="font-normal text-[15px] text-black w-[175px] shrink-0 max-sm:text-sm">
                Lembrar-se da senha ?
              </span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            theme="blue"
            className="flex w-[381px] h-[79px] justify-center items-center gap-2.5"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-xl mt-[38px]">
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