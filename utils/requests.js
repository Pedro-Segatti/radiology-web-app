import axios, { HttpStatusCode } from "axios";

export const HttpStatus = HttpStatusCode;

const apiUrl = () => {
  let url = process.env.NEXT_PUBLIC_RADIOLOGY_API_URL;

  return url;
};

export const api = axios.create(
  { baseURL: apiUrl() }
);

export const apiGet = async (url, json) => {
  try {
    const response = await api.get(url, { params: json });
    return response;
  } catch (error) {
    throw error;
  }
}

export const apiPost = async (url, json) => {
  try {
    const response = await api.post(url, json);
    return response;
  } catch (error) {
    throw error;
  }
}

export const apiPut = async (url, json) => {
  try {
    const response = await api.put(url, json);
    return response;
  } catch (error) {
    throw error;
  }
}

export const apiDelete = async (url, json) => {
  try {
    const response = await api.delete(url, { params: json });
    return response;
  } catch (error) {
    throw error;
  }
}

export const login = async (login, password) => {
  const jsonLogin = {
    "email": login,
    "password": password
  };
  return apiPost("/login", jsonLogin);
};