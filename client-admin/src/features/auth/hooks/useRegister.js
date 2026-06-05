import { useAuthStore } from "../store/authStore";

export const useRegister = () => {
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const handleRegister = async (values) => {
    const formData = new FormData();
    console.log(values.profilePicture);

    formData.append("name", values.name);
    formData.append("surname", values.surname);
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phone", values.phone);
    formData.append("profilePicture", values.profilePicture);

    return await register(formData);
  };

  return {
    handleRegister,
    loading,
    error,
  };
};
