import { useEffect } from "react";
import toast from "react-hot-toast";
import { useUserManagementStore } from "../../users/store/useUserManagementStore";
import { useAuthStore } from "../../auth/store/authStore";

export const Settings = () => {
  const { users, loading, fetchUsers, updateUserRole } =
    useUserManagementStore();
  const { user: currentUser, token } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Cambia el rol del usuario usando la API
  const handleChangeRole = async (userObj) => {
    const newRole = userObj.role === "ADMIN_ROLE" ? "USER_ROLE" : "ADMIN_ROLE";
    const res = await updateUserRole(userObj.id, newRole, token);
    if (res.success) {
      toast.success("Rol actualizado correctamente");
    } else {
      toast.error(res.error || "Error al cambiar el rol");
    }
  };

  return (
    <>
      <table>
        <tbody>
          {users.map((userObj) => {
            const isCurrentUser = currentUser?.id === userObj.id;
            return (
              <tr
                key={userObj.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Usuario */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={userObj.profilePicture}
                      alt={userObj.username}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {userObj.username}
                      </p>
                      <p className="text-xs text-gray-500">ID: {userObj.id}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-600">{userObj.email}</td>

                {/* Rol */}
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      userObj.role === "ADMIN_ROLE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {userObj.role}
                  </span>
                </td>

                {/* Acción */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleChangeRole(userObj)}
                    disabled={loading || isCurrentUser}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition ${isCurrentUser ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {isCurrentUser
                      ? "No permitido"
                      : userObj.role === "ADMIN_ROLE"
                        ? "Make User"
                        : "Make Admin"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* CARDS (mobile) */}
      <div className="md:hidden divide-y">
        {users.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          return (
            <div key={user.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${user.role === "ADMIN_ROLE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {user.role}
                </span>
                <button
                  onClick={() => handleChangeRole(user)}
                  disabled={loading || isCurrentUser}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${isCurrentUser ? "bg-gray-400" : "bg-blue-600"}`}
                >
                  {user.role === "ADMIN_ROLE" ? "User" : "Admin"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
