import { useEffect, useState } from "react";
import { useTournamentsStore } from "../../tournaments/store/tournamentStore";
import { Spinner } from "../../auth/components/Spinner.jsx";
import { TournamentModal } from "./TournamentModal.jsx";
import { useUIStore } from "../../auth/store/uiStore.js";

export const Tournaments = () => {
  const { tournaments, loading, error, getTournaments, deleteTournament } =
    useTournamentsStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { openConfirm } = useUIStore();

  useEffect(() => {
    getTournaments();
  }, [getTournaments]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main-blue">
            Gestión de Torneos
          </h1>
          <p className="text-gray-500 text-sm">
            Administra los torneos registrados
          </p>
        </div>

        <button
          className="bg-main-blue px-4 py-2 rounded text-white hover:opacity-90 transition"
          onClick={() => {
            setSelectedTournament(null);
            setOpenModal(true);
          }}
        >
          + Agregar Torneo
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tournaments.map((t) => (
          <div
            key={t._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.02]"
          >
            <div className="p-5">
              <h2 className="text-xl font-bold text-main-blue">
                {t.tournamentsName}
              </h2>

              {/* BADGES */}
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                  {t.category.replace("_", " ")}
                </span>

                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                  {t.status}
                </span>
              </div>

              {/* INFO */}
              <p className="text-sm text-gray-400 mt-2">
                Equipos: {t.teams.length}
              </p>

              <p className="text-sm text-gray-400">
                {new Date(t.startDate).toLocaleDateString()} -{" "}
                {new Date(t.endDate).toLocaleDateString()}
              </p>

              {/* BOTONES */}
              <div className="flex gap-3 mt-5">
                <button
                  className="flex-1 py-2 rounded-lg bg-main-blue text-white hover:opacity-90"
                  onClick={() => {
                    setSelectedTournament(t);
                    setOpenModal(true);
                  }}
                >
                  ✏️ Editar
                </button>

                <button
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  onClick={() =>
                    openConfirm({
                      title: "Eliminar torneo",
                      message: `¿Eliminar ${t.tournamentsName}?`,
                      onConfirm: () => deleteTournament(t._id),
                    })
                  }
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TournamentModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedTournament(null);
        }}
        tournament={selectedTournament}
      />
    </div>
  );
};
