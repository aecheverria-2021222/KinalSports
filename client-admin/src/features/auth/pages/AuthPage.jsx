import { useState } from 'react';
import { LoginForm } from '../components/LoginForm.jsx';
import { ForgotPassword } from '../components/ForgotPassword.jsx';

export const AuthPage = () => {
  const [isForgot, setIsForgot] = useState(false);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:pd-10'>
        <div className='flex justify-center mb-6'>
          <img
            src='/src/assets/img/kinal_sports.png'
            alt='Kinal Sports Logo'
            className='h-20 w-auto'
          />
        </div>

        <div className='text-center mb-6'>
          <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-2'>
            {isForgot ? 'Recuperar Contraseña' : 'Bienvenido de nuevo'}
          </h1>

          <p className='text-gray-600 text-base max-w-md mx-auto'>
            {isForgot
              ? 'Ingresa tu correo para recuerar contraseña'
              : 'Ingresa a tu cuenta de administrador'}
          </p>
        </div>
        {isForgot ? (
          <ForgotPassword
            onSwitch={() => {
              setIsForgot(false);
            }}
          />
        ) : (
          <LoginForm
            onForgot={() => {
              setIsForgot(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
