import React from 'react';
import { Header } from '../components/layout/Header';
import { LoginForm } from '../components/sections/LoginForm';
import { useAuth, getCartKey } from '../contexts/AuthContext';

export default function Login() {
  const { setUser } = useAuth();

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
      <Header />
      
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <div className="mt-[30px]">
          <img
            src="/login-form-hero.svg"
            alt="Login illustration"
            className="aspect-[2.08] object-contain w-full rounded-[20px]"
          />
          <LoginForm />
        </div>
      </div>
    </div>
  );
} 