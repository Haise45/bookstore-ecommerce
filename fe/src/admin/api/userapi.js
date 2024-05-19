import axios from 'axios';
import CookieService from './cookie'; // Import service để làm việc với cookie

const apiUrl = "http://localhost:8090/api/admin";

axios.defaults.withCredentials = true;

const userApi = {
  getAllUsers: async () => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.get(`${apiUrl}/user/getAll`, { headers });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.post(`${apiUrl}/user/delete/${userId}`, {}, { headers });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  findUserById: async (userId) => {
    try {
      axios.defaults.withCredentials = true;
      const headers = await getRequestHeaders();
      const response = await axios.get(`${apiUrl}/user/findbyid/${userId}`, { headers });
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

export default userApi;
