import React from 'react';
import { Header } from '@/components/layout/Header';
import { RegistrationForm } from '@/components/sections/RegistrationForm';

export default function Register() {
  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
      <Header />
      
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <div className="mt-[30px]">
          <div className="w-full flex justify-center">
            <img
              src="/register-form-hero.svg"
              alt="Registration illustration"
              className="rounded-[20px] object-cover w-[400px] h-[200px]"
            />
          </div>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );
} 