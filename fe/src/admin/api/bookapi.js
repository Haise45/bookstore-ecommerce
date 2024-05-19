import axios from 'axios';
import CookieService from './cookie';

const apiUrl = "http://localhost:8090/api/admin";

axios.defaults.withCredentials = true;

const bookApi = {
  getAll: async (params) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await requestWithToken(`${apiUrl}/book/getAll`, params);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
  getById: async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await requestWithToken(`${apiUrl}/book/${id}`);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
  addBook: async (bookData) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await requestWithToken(`${apiUrl}/book/add`, {}, 'post', bookData);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
  updateBook: async (id, bookData) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await requestWithToken(`${apiUrl}/book/update/${id}`, {}, 'patch', bookData);
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  },
  deleteBook: async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await requestWithToken(`${apiUrl}/book/delete/${id}`, {}, 'delete');
      return response.data;
    } catch (error) {
      handleRequestError(error);
    }
  }
};

const requestWithToken = async (url, params = {}, method = 'get', data = {}) => {
  const token = CookieService.getCookie('token');
  if (!token) {
    console.error("Token not found in cookie.");
    return Promise.reject("Token not found in cookie.");
  }
  const headers = { Authorization: `Bearer ${token}` };
  try {
    return await axios({ method, url, params, data, headers });
  } catch (error) {
    throw error.response.data || error.message;
  }
};

const handleRequestError = (error) => {
  console.error("Request error:", error);
  throw error;
};

export default bookApi;