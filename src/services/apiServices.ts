import axios, { AxiosError, AxiosInstance } from 'axios';

const reqresLoginUrl = 'https://reqres.in/api/login';
const dummyLoginUrl = 'https://dummyjson.com/auth/login';
const userUrl = 'https://randomuser.me/api/';

export type ReqresLoginPayload = {
  email: string;
  password: string;
};

export type ReqresLoginResponse = {
  token: string;
};

export type DummyJsonLoginPayload = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type DummyJsonLoginResponse = {
  id: number;
  username: string;
  refreshToken: string;
  expiresIn: number;
  token: string;
};

export type RandomUserResult = {
  results: Array<Record<string, unknown>>;
  info: { seed: string; results: number; page: number; version: string };
};

export class ApiError extends Error {
  public code?: string;
  public status?: number;
  public details?: unknown;

  constructor(message: string, code?: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const normalizeError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    const message =
      axiosError.message ||
      (typeof data === 'string' ? data : JSON.stringify(data ?? { message: 'Unknown API error' }));

    // reqres.in Cloudflare artifact
    if (status === 403 && String(message).toLowerCase().includes('just a moment')) {
      throw new ApiError('REQRES_BLOCKED', 'REQRES_BLOCKED', status, data);
    }

    throw new ApiError(message, 'API_ERROR', status, data);
  }

  throw new ApiError('Unknown non-Axios error', 'UNKNOWN_ERROR');
};

export const UserService = {
  login: async (payload: ReqresLoginPayload) => {
    try {
      const response = await apiClient.post<ReqresLoginResponse>(reqresLoginUrl, payload);
      return response.data;
    } catch (error) {
      console.error('UserService.login error:', error);
      normalizeError(error);
    }
  },

  loginDummyJson: async (payload: DummyJsonLoginPayload) => {
    try {
      const response = await apiClient.post<DummyJsonLoginResponse>(dummyLoginUrl, payload);
      return response.data;
    } catch (error) {
      console.error('UserService.loginDummyJson error:', error);
      normalizeError(error);
    }
  },

  getUsers: async (results = 10)=> {
    try {
      const response = await apiClient.get<RandomUserResult>(userUrl, { params: { results } });
      return response.data;
    } catch (error) {
      console.error('UserService.getUsers error:', error);
      normalizeError(error);
    }
  },
};

