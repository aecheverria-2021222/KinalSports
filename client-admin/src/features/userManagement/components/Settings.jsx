import { useEffect } from "react";
import { useUserManagementStore } from "../../users/store/useUserManagementStore";
import { useUIStore } from "../../auth/store/uiStore";
import { useAuthStore } from "../../auth/store/authStore";

export const Settings = () => {
  const { users, loading, fetchUsers, changeRole } = useUserManagementStore();
  const { openConfirm } = useUIStore();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangeRole = (user) => {
    const newRole = user.role === "ADMIN_ROLE" ? "USER_ROLE" : "ADMIN_ROLE";
    openConfirm({
      title: "Cambiar Rol",
      message: `¿Seguro que deseas cambiar el rol de ${user.username} a ${newRole}?`,
      onConfirm: async () => {
        await changeRole(user.id, newRole);
      },
    });
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Gestión de Usuarios
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* TABLE (desktop) */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="text-left px-6 py-4">Usuario</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Rol</th>
                <th className="text-right px-6 py-4">Acción</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Usuario */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          user.role === "ADMIN_ROLE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleChangeRole(user)}
                        disabled={loading || isCurrentUser}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition ${
                          isCurrentUser
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {isCurrentUser
                          ? "No permitido"
                          : user.role === "ADMIN_ROLE"
                            ? "Make User"
                            : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

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
                    <p className="font-semibold text-gray-800">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      user.role === "ADMIN_ROLE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>

                  <button
                    onClick={() => handleChangeRole(user)}
                    disabled={loading || isCurrentUser}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${
                      isCurrentUser ? "bg-gray-400" : "bg-blue-600"
                    }`}
                  >
                    {user.role === "ADMIN_ROLE" ? "User" : "Admin"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
