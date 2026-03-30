import axios from 'axios';

const loginUrl = 'https://dummyjson.com/auth/login';
const userUrl = 'https://randomuser.me/api/';






export const UserService = {
  // ✅ Login API
  login: async (payload:any) => {
    try {
      const response = await axios.post(
        loginUrl,
        payload
      );
      return response.data;
    } catch (error) {
      console.log('Login API Error:', error);
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const response = await axios.get(
        userUrl
      );
      return response.data;
    } catch (error) {
      console.log('GET API Error:', error);
      throw error;
    }
  },
};
