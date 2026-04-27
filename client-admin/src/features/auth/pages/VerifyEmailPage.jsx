import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import logo from '../../../assets/img/kinal_sports.png';

export const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleFinish = useCallback(() => {
    // Esperar a que se perciba el toast antes de redirigir.
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  const { status, message } = useVerifyEmail(token, handleFinish);

  const displayMessage = status === 'loading' ? 'Verificando correo, por favor espera...' : message;

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-100 px-4'>
      <img src={logo} alt='Kinal Sports' className='w-28 h-28 object-contain mb-4' />

      <p className='text-lg font-semibold text-gray-700 text-center max-w-lg' aria-live='polite'>
        {displayMessage}
      </p>
    </div>
  );
};