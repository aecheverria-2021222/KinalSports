import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

export const ForgotPasswordForm = ({ onSwitch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const onSubmit = async (data) => {
    const res = await forgotPassword(data.email);

    if (res.success) {
      toast.success(
        "Revisa tu bandeja para continuar con el cambio de contraseña.",
        { duration: 5000 },
      );
      onSwitch();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1.5">
          Email
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("email", {
            required: "El email es obligatorio",
          })}
        />

        {errors.email && (
          <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main-blue text-white py-2 rounded-lg disabled:opacity-50 hover:opacity-90"
      >
        {loading ? "Enviando..." : "Enviar correo"}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Recordaste tu contraseña?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-main-blue font-medium hover:opacity-80"
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
};
