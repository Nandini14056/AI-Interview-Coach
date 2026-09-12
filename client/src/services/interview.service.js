import api from "./api";

export const startInterview = async (payload) => (await api.post("/interviews/start", payload)).data;
export const getInterview = async (id) => (await api.get(`/interviews/${id}`)).data;
export const submitAnswer = async (id, payload) => (await api.post(`/interviews/${id}/answers`, payload)).data;
export const getHistory = async () => (await api.get("/interviews")).data;
export const getResult = async (id) => (await api.get(`/interviews/${id}/result`)).data;
