import { useState, useEffect, useRef } from "react";
import { useUserManagementStore } from "../store/useUserManagementStore";
import { getAllUsers } from "../../../shared/api/auth";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export const UserComboBox = ({ value, onChange, error, disabled }) => {
  const { users, fetchUsers, loading } = useUserManagementStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers(getAllUsers);
    }
  }, [users.length, fetchUsers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find((u) => u.id === value);

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.name} ${u.surname}`.toLowerCase();
    const username = (u.username || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || username.includes(search);
  });

  const handleSelect = (user) => {
    onChange(user.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="text-sm font-semibold text-gray-700 mb-1 block">
        Representante (Manager)
      </label>
      <div
        className={`flex items-center w-full px-3 py-2 rounded-lg border-2 shadow-sm transition cursor-pointer
                    ${disabled ? "bg-gray-200 border-gray-200 cursor-not-allowed text-gray-500" : "border-[var(--main-blue)] bg-gray-50 hover:border-[var(--main-blue)]"}
                    ${isOpen ? "border-[var(--main-blue)] ring-2 ring-[var(--main-blue)/20]" : ""}
                    ${error ? "border-red-500" : ""}
                `}
        style={!disabled ? { borderColor: "var(--main-blue)" } : {}}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {selectedUser ? (
            <span className="text-gray-900">
              {selectedUser.name} {selectedUser.surname} (
              {selectedUser.username})
            </span>
          ) : (
            <span className="text-gray-400">Seleccionar representante...</span>
          )}
        </div>
        {!disabled && (
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400 ml-2" />
        )}
      </div>

      {isOpen && (
        <div className="absolute gap-2 z-60 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
          <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="bg-transparent border-none focus:ring-0 text-sm w-full p-1 outline-none"
              placeholder="Buscar por nombre o username..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto overflow-x-hidden py-1">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                Cargando usuarios...
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm transition-colors
                    ${value === user.id ? "bg-[var(--main-blue)/10] text-[var(--main-blue)] font-medium" : "text-gray-700 hover:bg-[var(--main-blue)/5]"}
                  `}
                  onClick={() => handleSelect(user)}
                >
                  <div className="flex flex-col truncate mr-2">
                    <span className="truncate">
                      {user.name} {user.surname}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      @{user.username}
                    </span>
                  </div>
                  {value === user.id && (
                    <CheckIcon
                      className="h-4 w-4"
                      style={{ color: "var(--main-blue)" }}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No se encontraron usuarios
              </div>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error.message}</p>}
    </div>
  );
};
