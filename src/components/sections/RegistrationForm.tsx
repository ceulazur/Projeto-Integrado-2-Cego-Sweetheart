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
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): FormErrors => {
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
    return newErrors;
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
    setError(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.email) {
        setError(validationErrors.email);
      } else if (validationErrors.firstName) {
        setError(validationErrors.firstName);
      } else if (validationErrors.lastName) {
        setError(validationErrors.lastName);
      } else if (validationErrors.password) {
        setError(validationErrors.password);
      } else if (validationErrors.confirmPassword) {
        setError(validationErrors.confirmPassword);
      } else {
        setError('Preencha todos os campos corretamente.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigateAndScroll('/login');
      } else {
        setError(data.error || 'Erro ao registrar.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full mt-2 px-[5px]">
      <div className="text-4xl font-bold mb-[38px]">
        <span className="text-[rgba(12,212,32,1)]">Crie</span> sua conta!
      </div>
      
      {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}

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
            type="text"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
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
            placeholder="Confirme sua senha"
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
          Já tem uma conta?{' '}
        </span>
        <button
          type="button"
          className="font-bold text-xl text-black max-sm:text-base hover:text-[rgba(12,212,32,1)] transition-colors underline"
          onClick={() => navigateAndScroll('/login')}
        >
          Logue-se
        </button>
      </div>
    </main>
  );
}; 