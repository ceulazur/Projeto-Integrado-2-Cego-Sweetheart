import React, { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { LoginForm } from '../components/sections/LoginForm';
import { useAuth, getCartKey } from '../contexts/AuthContext';

export default function Login() {
  const { setUser } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const parallaxAbsoluteTop = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      parallaxAbsoluteTop.current = rect.top + window.scrollY;
    }
  }, []);

  // Calcular limites baseados na posição do formulário
  const getImageTransform = () => {
    if (!formRef.current || !imageRef.current || parallaxAbsoluteTop.current === null) return 0;
    const formRect = formRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;

    const formTop = formRect.top + scrollY;
    const formHeight = formRect.height;
    const parallaxHeight = imageRef.current.offsetHeight;

    const maxTranslate = (formTop + formHeight) - (parallaxAbsoluteTop.current + parallaxHeight) - 64;
    const scrolled = Math.max(scrollY - parallaxAbsoluteTop.current, 0);

    return Math.min(scrolled, maxTranslate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Coluna da Esquerda - Ilustração com Parallax */}
          <div className="hidden lg:block">
            <div 
              ref={imageRef}
              className="flex flex-col items-center justify-center sticky top-8"
              style={{
                transform: `translateY(${getImageTransform()}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <img
                src="/login-form-hero.svg"
                alt="Login illustration"
                className="w-full max-w-4xl mx-auto h-auto rounded-2xl shadow-lg"
                style={{
                  maxHeight: '80vh',
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto',
                  minHeight: '400px'
                }}
              />
              <div className="mt-8 text-center w-full">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Bem-vindo de volta!
                </h2>
                <p className="text-xl text-gray-600 max-w-lg mx-auto">
                  Faça login para acessar sua conta e continuar explorando 
                  as melhores obras de arte dos artistas independentes.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita - Formulário */}
          <div className="flex justify-center lg:justify-end">
            <div ref={formRef} className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <LoginForm />
                
                {/* Parágrafo de cadastro removido */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 Arte Única. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 