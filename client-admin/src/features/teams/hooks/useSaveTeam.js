import { useTeamsStore } from "../store/teamStore";

export const useSaveTeam = () => {
  const createTeam = useTeamsStore((state) => state.createTeam);
  const updateTeam = useTeamsStore((state) => state.updateTeam);

  const saveTeam = async (data, teamId = null) => {
    const formData = new FormData();

    formData.append("teamName", data.teamName);
    formData.append("managerId", data.managerId);
    formData.append("category", data.category);

    if (data.logo?.length > 0) {
      formData.append("logo", data.logo[0]);
    }

    if (teamId) {
      await updateTeam(teamId, formData);
    } else {
      await createTeam(formData);
    }
  };

  return { saveTeam };
};
