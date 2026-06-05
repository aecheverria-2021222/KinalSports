import { useState } from "react";
import { Spinner } from "../../auth/components/Spinner.jsx";
import defaultAvatarImg from "../../../assets/img/avatarDefault-1749508519496.png";

export const UserDetailModal = ({
  isOpen,
  onClose,
  user,
  currentUserId,
  onSaveRole,
  loading,
}) => {
  const [role, setRole] = useState(user?.role || "USER_ROLE");

  const avatarSrc = (() => {
    const value = user?.profilePicture?.trim();
    if (!value) return defaultAvatarImg;

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    const cloudinaryBase = import.meta.env.VITE_CLOUDINARY_BASE_URL?.replace(
      /\/+$/,
      "",
    );
    if (!cloudinaryBase) return defaultAvatarImg;

    return `${cloudinaryBase}/${value.replace(/^\/+/, "")}`;
  })();

  if (!isOpen || !user) return null;

  const isCurrentUser = currentUserId === user.id;
  const hasChanges = role !== user.role;

  const handleSave = async () => {
    if (!hasChanges || isCurrentUser) {
      onClose();
      return;
    }
    await onSaveRole(user, role);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="p-4 sm:p-5 text-white sticky top-0 z-10"
          style={{
            background:
              "linear-gradient(90deg, var(--main-blue) 0%, #1956a3 100%)",
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold">Detalle de Usuario</h2>
          <p className="text-xs sm:text-sm opacity-80">
            Consulta información y cambia el rol del usuario
          </p>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-4">
            <img
              src={avatarSrc}
              alt={user.username}
              className="w-16 h-16 rounded-full object-cover border"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatarImg;
              }}
            />
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {[user.name, user.surname].filter(Boolean).join(" ")}
              </p>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">ID</p>
              <p className="text-sm font-medium break-all">{user.id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Nombre</p>
              <p className="text-sm font-medium">{user.name || "-"}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Apellido</p>
              <p className="text-sm font-medium">{user.surname || "-"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isCurrentUser}
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <option value="USER_ROLE">USER_ROLE</option>
              <option value="ADMIN_ROLE">ADMIN_ROLE</option>
            </select>
            {isCurrentUser && (
              <p className="text-xs text-gray-500 mt-1">
                No puedes cambiar tu propio rol.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !hasChanges || isCurrentUser}
            className="w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition shadow disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(90deg, var(--main-blue) 0%, #1956a3 100%)",
              border: "none",
            }}
          >
            {loading ? <Spinner small /> : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};
