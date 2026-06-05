import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore"; // Updated path
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const resetPassword = useAuthStore((state) => state.resetPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const onSubmit = async (data) => {
    const res = await resetPassword({
      token,
      newPassword: data.password,
    });

    if (res.success) {
      toast.success("Ahora puedes iniciar sesión con tu nueva contraseña", {
        duration: 5000,
      });
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Nueva contraseña */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-800 mb-1.5"
        >
          Nueva contraseña
        </label>

        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "Debe tener al menos 8 caracteres",
            },
          })}
        />

        {errors.password && (
          <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-800 mb-1.5"
        >
          Confirmar contraseña
        </label>

        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          {...register("confirmPassword", {
            required: "Debe confirmar la contraseña",
            validate: {
              matchesPassword: (value) => {
                const passwordValue = getValues("password");
                return (
                  value === passwordValue || "Las contraseñas no coinciden"
                );
              },
            },
          })}
        />

        {errors.confirmPassword && (
          <p className="text-red-600 text-xs mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Error backend */}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main-blue hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
      >
        {loading ? "Actualizando..." : "Actualizar contraseña"}
      </button>

      {/* Volver al login */}
      <p className="text-center text-sm text-gray-600">
        ¿Recordaste tu contraseña?{" "}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="font-medium text-main-blue hover:opacity-80 transition-colors"
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
};
