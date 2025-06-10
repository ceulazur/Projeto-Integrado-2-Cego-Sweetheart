import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useScrollTop } from '../../hooks/useScrollTop';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export const RegistrationForm: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Primeiro nome é obrigatório';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Último nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful registration
      console.log('Registration successful:', formData);
      alert('Conta criada com sucesso!');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full mt-2 px-[5px]">
      <div className="text-4xl font-bold mb-[38px]">
        <span className="text-[rgba(12,212,32,1)]">Crie</span> sua conta!
      </div>
      
      <p className="text-2xl font-medium mb-[38px]">
        Preencha suas informações, por favor.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-[38px]">
          <Input
            id="firstName"
            placeholder="Primeiro Nome"
            type="text"
            value={formData.firstName}
            onChange={handleInputChange('firstName')}
            error={errors.firstName}
            required
            autoComplete="given-name"
            theme="green"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Input
            id="lastName"
            placeholder="Ultimo Nome"
            type="text"
            value={formData.lastName}
            onChange={handleInputChange('lastName')}
            error={errors.lastName}
            required
            autoComplete="family-name"
            theme="green"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Input
            id="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
            autoComplete="email"
            theme="green"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Input
            id="password"
            placeholder="Senha"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            required
            autoComplete="new-password"
            theme="green"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Input
            id="confirmPassword"
            placeholder="Confirme sua a senha"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            theme="green"
            className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70"
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            theme="green"
            className="flex w-[381px] h-[79px] justify-center items-center gap-2.5"
          >
            {isSubmitting ? 'Registrando...' : 'Registre-se'}
          </Button>
        </div>
      </form>

      <div className="text-xl mt-[38px]">
        <span className="font-normal text-xl text-black max-sm:text-base">
          Já tem uma conta ?{' '}
        </span>
        <button
          onClick={() => navigateAndScroll('/login')}
          className="font-bold text-xl text-black max-sm:text-base hover:text-[#0C87D4] transition-colors underline"
          type="button"
        >
          Logue-se
        </button>
      </div>
    </main>
  );
}; 