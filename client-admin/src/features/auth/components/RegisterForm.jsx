import { useForm } from "react-hook-form";
import { useRegister } from "../hooks/useRegister";
import toast from "react-hot-toast";

export const RegisterForm = ({ onSwitch }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const { handleRegister, loading, error } = useRegister();

  const onSubmit = async (data) => {
    data.profilePicture = data.profilePicture?.[0];
    const result = await handleRegister(data);
    if (result.success && result.emailVerificationRequired) {
      toast.success("Se ha enviado un correo de verificación a tu bandeja.", {
        duration: 5000,
      });
      onSwitch();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre
          </label>
          <input
            {...register("name", { required: "El nombre es obligatorio" })}
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.name && (
            <p className="text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Apellido
          </label>
          <input
            {...register("surname", { required: "El apellido es obligatorio" })}
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.surname && (
            <p className="text-red-600 text-xs">{errors.surname.message}</p>
          )}
        </div>
      </div>

      {/* Username + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre de Usuario
          </label>
          <input
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            })}
            type="text"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.username && (
            <p className="text-red-600 text-xs">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Teléfono
          </label>
          <input
            {...register("phone", {
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "Debe ser un número de 8 dígitos",
              },
            })}
            type="tel"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
              message: "Formato de email inválido",
            },
          })}
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-600 text-xs">{errors.email.message}</p>
        )}
      </div>

      {/* Password + Confirm Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Contraseña
          </label>
          <input
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "Debe tener al menos 8 caracteres",
              },
            })}
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.password && (
            <p className="text-red-600 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirmar Contraseña
          </label>
          <input
            {...register("confirmPassword", {
              required: "Debe confirmar su contraseña",
              validate: {
                matchesPassword: (value) => {
                  const passwordValue = getValues("password");
                  return (
                    value === passwordValue || "Las contraseñas no coinciden"
                  );
                },
              },
            })}
            type="password"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Foto de Perfil
        </label>
        <input
          {...register("profilePicture")}
          type="file"
          accept="image/*"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.profilePicture && (
          <p className="text-red-600 text-xs">
            {errors.profilePicture.message}
          </p>
        )}
      </div>

      {/* Global error */}
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-main-blue hover:opacity-90 text-white py-2 rounded-lg transition"
      >
        {loading ? "Procesando..." : "Registrarse"}
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-main-blue font-medium hover:opacity-80"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
};
