import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { useNavigate } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberPassword });
    // Add actual login logic here
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // Add Google OAuth logic here
  };

  return (
    <div className="flex w-[390px] flex-col items-start gap-[43px] h-[785px] box-border px-[5px] py-0 max-md:w-full max-md:p-0">
      <section>
        <h1 className="w-[306px] h-[41px] relative max-sm:w-full">
          <span className="font-bold text-4xl text-black max-sm:text-[28px]">
            Bem-vindo de
          </span>
          <span className="font-bold text-4xl text-[rgba(12,135,212,1)] max-sm:text-[28px]">
            {' '}volta!
          </span>
        </h1>
        <p className="font-normal text-2xl text-black w-[379px] h-7 relative max-sm:text-xl max-sm:w-full mt-4">
          Preencha suas informações, por favor.
        </p>
      </section>

      <Button
        variant="secondary"
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-[43px] w-full">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          id="email"
          name="email"
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
          className="flex w-[381px] h-[79px] justify-center items-center gap-2.5 bg-[#1B1E84] hover:bg-[#151660] text-white"
        >
          Logar-se
        </Button>

        <p className="w-[280px] h-[23px] max-sm:w-full">
          <span className="font-normal text-xl text-black max-sm:text-base">
            Não tem uma conta ?{' '}
          </span>
          <button
            type="button"
            className="font-bold text-xl text-black max-sm:text-base hover:text-[#0C87D4] transition-colors underline"
            onClick={() => navigate('/register')}
          >
            Registre-se
          </button>
        </p>
      </form>
    </div>
  );
}; 