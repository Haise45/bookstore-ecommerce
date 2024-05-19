import axios from 'axios';
import CookieService from './cookie'; // Import service để làm việc với cookie

const apiUrl = "http://localhost:8090/api/admin";

axios.defaults.withCredentials = true;

const categoryApi = {
  getAllCategories: async () => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.get(`${apiUrl}/category/getAll`, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getBooksByCategoryId: async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.get(`${apiUrl}/category/${id}/books`, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  createCategory: async (categoryData) => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.post(`${apiUrl}/category/add`, categoryData, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.delete(`${apiUrl}/category/delete/${id}`, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

const getRequestHeaders = async () => {
  const token = CookieService.getCookie('token');
  if (!token) {
    console.error("Token not found in cookie.");
    throw new Error("Token not found in cookie.");
  }
  return { Authorization: `Bearer ${token}` };
};

export default categoryApi;
