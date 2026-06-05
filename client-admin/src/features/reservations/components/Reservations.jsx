import { useEffect } from "react";
import { useFieldsStore } from "../../users/store/adminStore";
import { formatDate, formatTime } from "../../../shared/utils/formatters";
import { Spinner } from "../../auth/components/Spinner.jsx";
import { showError, showSuccess } from "../../../shared/utils/toast.js";
import { showConfirmToast } from "../../../shared/utils/showConfirmToast.js";

export const Reservations = () => {
  const {
    reservations,
    loading,
    error,
    getAllReservations,
    confirmReservation,
    cancelReservation,
  } = useFieldsStore();

  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);

  // Mostrar toast de error si existe
  useEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-main-blue">
          Gestión de Reservaciones
        </h1>
        <p className="text-gray-500 text-sm">
          Administra y confirma las reservaciones pendientes
        </p>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reservations.map((reservation) => {
          const isConfirmed = reservation.status === "CONFIRMED";
          const isCanceled = reservation.status === "CANCELLED";
          const canConfirm = !isConfirmed && !isCanceled;
          const canCancel = !isCanceled && !isConfirmed;

          return (
            <div
              key={reservation._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-[1.02]"
            >
              <div className="p-5">
                {/* TITLE */}
                <h2 className="text-lg font-bold text-gray-800">
                  {reservation.fieldId.fieldName}
                </h2>

                <p className="text-sm text-gray-400 truncate">
                  Usuario: {reservation.userId}
                </p>

                {/* BADGES */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                    {formatDate(reservation.startTime)}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                    {formatTime(reservation.startTime)} -{" "}
                    {formatTime(reservation.endTime)}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                                        ${
                                          isConfirmed
                                            ? "bg-green-100 text-green-700"
                                            : isCanceled
                                              ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                  >
                    {reservation.status}
                  </span>
                </div>

                {/* ACTION */}
                <div className="mt-5 flex gap-3">
                  <button
                    disabled={!canConfirm}
                    onClick={() => {
                      if (canConfirm) {
                        showConfirmToast({
                          title: "Confirmar reserva",
                          message: "¿Estás seguro de confirmar esta reserva?",
                          onConfirm: async () => {
                            try {
                              await confirmReservation(reservation._id);
                              showSuccess("Reserva confirmada correctamente");
                            } catch {
                              showError("No se pudo confirmar la reserva");
                            }
                          },
                        });
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg text-white font-medium transition
                      ${!canConfirm ? "bg-gray-400 cursor-not-allowed" : "bg-main-blue hover:opacity-90"}
                    `}
                  >
                    {isConfirmed
                      ? "✔ Confirmada"
                      : isCanceled
                        ? "✖ Cancelada"
                        : "✔ Confirmar"}
                  </button>

                  <button
                    disabled={!canCancel}
                    onClick={() => {
                      if (canCancel) {
                        showConfirmToast({
                          title: "Cancelar reserva",
                          message: "¿Estás seguro de cancelar esta reserva?",
                          onConfirm: async () => {
                            try {
                              await cancelReservation(reservation._id);
                              showSuccess("Reserva cancelada correctamente");
                            } catch {
                              showError("No se pudo cancelar la reserva");
                            }
                          },
                        });
                      }
                    }}
                    className={`flex-1 py-2 rounded-lg text-white font-medium transition
                      ${!canCancel ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
                    `}
                  >
                    {isCanceled ? "✖ Cancelada" : "✖ Cancelar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {reservations.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10">
          No hay reservaciones registradas
        </div>
      )}
    </div>
  );
};
