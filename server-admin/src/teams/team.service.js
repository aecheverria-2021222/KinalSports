import Team from './team.model.js';
import { cloudinary } from '../../middlewares/file-uploader.js';

export const fetchTeams = async ({
  page = 1,
  limit = 10,
  isActive,
  category,
}) => {
  const filter = {};

  if (typeof isActive !== 'undefined') {
    filter.isActive = isActive === 'true';
  } else {
    // Por defecto solo mostrar equipos activos
    filter.isActive = true;
  }

  if (category) {
    filter.category = category;
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const teams = await Team.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const totalTeams = await Team.countDocuments(filter);

  return {
    teams,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTeams / limitNumber),
      totalRecords: totalTeams,
      limit: limitNumber,
    },
  };
};

export const fetchTeamById = async (id) => {
  return Team.findById(id);
};

export const createTeamRecord = async ({ teamData, file }) => {
  const data = { ...teamData };

  if (file) {
    data.logo = file.path; // Guardar la ruta relativa del archivo subido
  } else {
    data.logo = 'kinal_sports_in6am/teams/kinal_sports_rljcha_rspxga';
  }

  const team = new Team(data);
  await team.save();
  return team;
};

export const updateTeamRecord = async ({ id, updateData, file }) => {
  const data = { ...updateData };

  if (Object.prototype.hasOwnProperty.call(data, 'isActive')) delete data.isActive;
  if (Object.prototype.hasOwnProperty.call(data, 'managerId')) delete data.managerId;

  if (file) {
    const currentTeam = await Team.findById(id);

    if (currentTeam && currentTeam.logo) {
      try {
        const url = currentTeam.logo; 
        const parts = url.split('/');
        const fileNameWithExt = parts[parts.length - 1]; 
        
        // Hacemos la ruta dinámica basándonos en el .env
        const folder = process.env.CLOUDINARY_TEAMS_FOLDER || 'kinal_sports_in6am/teams';
        const publicId = `${folder}/${fileNameWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error(`Error al eliminar imagen anterior: ${deleteError.message}`);
      }
    }
    data.logo = file.path;
  }

  return Team.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const updateTeamManager = async ({ id, managerId }) => {
  return Team.findByIdAndUpdate(
    id,
    { managerId },
    { new: true, runValidators: true }
  );
};

export const updateTeamStatus = async ({ id, isActive }) => {
  return Team.findByIdAndUpdate(id, { isActive }, { new: true });
};
