import api from "./api";

export const getRecentInterviews = async () => {
  try {
    const response = await api.get('/interviews');
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    return [];

  } catch (error) {
    console.log("Error fetching interview history: ", error);
    throw error;
  }
};