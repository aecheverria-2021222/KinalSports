import { useTournamentsStore } from "../store/tournamentStore";

export const useSaveTournament = () => {
  const { createTournament, updateTournament } = useTournamentsStore();

  const saveTournament = async (data, id) => {
    const payload = {
      tournamentsName: data.tournamentsName,
      category: data.category,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    };

    if (id) {
      await updateTournament(id, payload);
    } else {
      await createTournament(payload);
    }
  };

  return { saveTournament };
};
