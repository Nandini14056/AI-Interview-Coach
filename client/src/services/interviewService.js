import api from "./api";

export const getRecentInterviews = async () => {
  try{
    const response = await api.get('/interviews');
    return response.data;
  } catch(error){
    console.log("Error fetching interview history: ", error);
    throw error;
  }
};