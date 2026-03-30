import axios from 'axios';

const reqresLoginUrl = 'https://reqres.in/api/login';
const dummyLoginUrl = 'https://dummyjson.com/auth/login';
const userUrl = 'https://randomuser.me/api/';






export const UserService = {
  // ✅ Login API
  login: async (payload:any) => {
    try {
      const response = await axios.post(
        reqresLoginUrl,
        payload
      );
      return response.data;
    } catch (error) {
      const e: any = error;
      const status = e?.response?.status;
      const data = e?.response?.data;
      const asText = typeof data === 'string' ? data : '';

      // reqres.in can be protected by Cloudflare in some networks/regions.
      if (status === 403 && asText.toLowerCase().includes('just a moment')) {
        const err: any = new Error('REQRES_BLOCKED');
        err.code = 'REQRES_BLOCKED';
        throw err;
      }

      console.log('Login API Error:', error);
      throw error;
    }
  },
  loginDummyJson: async (payload: { username: string; password: string; expiresInMins?: number }) => {
    try {
      const response = await axios.post(dummyLoginUrl, payload);
      return response.data;
    } catch (error) {
      console.log('DummyJSON Login API Error:', error);
      throw error;
    }
  },
  getUsers: async (results: number = 10) => {
    try {
      const response = await axios.get(userUrl, { params: { results } });
      return response.data;
    } catch (error) {
      console.log('GET API Error:', error);
      throw error;
    }
  },
};
