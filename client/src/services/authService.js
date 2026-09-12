import api from "./api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    const token = response.data?.data?.accessToken;

    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  } catch (error) {
    console.log("Login Error: ", error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.log("Registeration Error: ", error);
    throw error;
  }
}