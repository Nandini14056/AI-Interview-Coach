import api from "./api";

export const startInterview = async (payload) => {
  return (await api.post("/interviews/start", payload)).data;
};

export const getInterview = async (id) => {
  return (await api.get(`/interviews/${id}`)).data;
};

export const submitAnswer = async (id, payload) => {
  return (
    await api.post(
      `/interviews/${id}/answers`,
      payload
    )
  ).data;
};

export const submitVoiceAnswer = async (
  id,
  payload
) => {
  return (
    await api.post(
      `/interviews/${id}/voice-answer`,
      payload
    )
  ).data;
};

export const submitVideoAnswer = async (
  id,
  payload
) => {
  return (
    await api.post(
      `/interviews/${id}/video-answer`,
      payload
    )
  ).data;
};

export const getHistory = async () => {
  return (
    await api.get("/interviews")
  ).data;
};

export const getResult = async (id) => {
  return (
    await api.get(`/interviews/${id}/result`)
  ).data;
};
