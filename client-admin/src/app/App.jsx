// primero se importan dependencias o librerías (completas o desestructuradas de react)
// luego librerías o dependecias de terceros
// componentes o funciones propias
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes/AppRoutes.jsx'
import { useAuthStore } from '../features/auth/store/authStore.js'

export const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster 
        position='top-center'
        toastOptions={{
          style:{
            fontFamily: 'inherit',
            fontWeight: '600',
            fontSize: '1rem',
            borderRadius: "8px"
          }
        }}
      />
      <AppRoutes />
    </>
  )
}
