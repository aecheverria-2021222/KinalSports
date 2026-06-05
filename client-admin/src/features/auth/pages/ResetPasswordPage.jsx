import { ResetPasswordForm } from "../components/ResetPasswordReset.jsx";

export const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-10">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/src/assets/img/kinal_sports.png"
                        alt="Kinal Sports"
                        className="h-20 w-auto"
                    />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Restablecer Contraseña
                    </h1>

                    <p className="text-gray-600 text-base max-w-md mx-auto">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
                    </p>
                </div>

                {/* Form */}
                <ResetPasswordForm />
            </div>
        </div>
    );
}