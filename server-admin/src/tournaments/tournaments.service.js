import Tournament from './tournaments.model.js';

export const fetchTournaments = async ({
  page = 1,
  limit = 10,
  isActive,
  category,
}) => {
  const filter = {};

  if (typeof isActive !== 'undefined') {
    filter.isActive = isActive === 'true';
  }

  if (category) {
    filter.category = category;
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const tournaments = await Tournament.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const totalTournaments = await Tournament.countDocuments(filter);

  return {
    tournaments,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTournaments / limitNumber),
      limit: limitNumber,
    },
  };
};

export const fetchTournamentById = async (id) => {
  return Tournament.findById(id);
};

export const createTournamentRecord = async (tournamentData) => {
  const tournament = new Tournament(tournamentData);
  await tournament.save();
  return tournament;
};

export const updateTournamentRecord = async ({ id, updateData }) => {
  return Tournament.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const updateTournamentStatus = async ({ id, isActive }) => {
  return Tournament.findByIdAndUpdate(id, { isActive }, { new: true });
};

export const deleteTournamentRecord = async (id) => {
  return Tournament.findByIdAndDelete(id);
};
