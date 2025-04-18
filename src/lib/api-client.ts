import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api', // Explicitly set to backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios error:', error.response?.status, error.response?.data?.error || error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  university?: string;
  role: 'admin' | 'user';
  customer_id: number;
}

export interface LoanType {
  id: number;
  name: string;
  created_at?: string;
}

export interface Loan {
  id: number;
  customer_id: number;
  room_type_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'declined';
  amount: number | null | undefined | string;
  purpose?: string;
  complaint?: string | null;
  created_at?: string;
  employment_status?: string | null;
  housing_status?: string | null;
  terms_agreed?: number;
  other_loans?: string | null;
  educational_purpose?: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  room_type?: string;
}

export interface Repayment {
  id: number;
  loan_id: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  complaint?: string | null;
  created_at?: string;
}

export interface DashboardData {
  dashboardTable: Loan[];
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    customer_id: number;
    phone: string;
    university?: string;
  };
  token: string;
}

interface ApiService {
  login: (data: { email: string; password: string }) => Promise<AxiosResponse<AuthResponse>>;
  register: (data: { name: string; email: string; phone: string; password: string; university?: string }) => Promise<AxiosResponse>;
  getAdminDashboardData: () => Promise<AxiosResponse<DashboardData>>;
  getUserDashboardData: () => Promise<AxiosResponse<DashboardData>>;
  getLoanTypes: () => Promise<AxiosResponse<LoanType[]>>;
  getCustomers: () => Promise<AxiosResponse<Customer[]>>;
  getLoans: () => Promise<AxiosResponse<Loan[]>>;
  createLoan: (data: {
    customer_id: number;
    room_type_id: number;
    start_date: string;
    end_date: string;
    purpose: string;
    amount: number;
    terms_agreed: number;
  }) => Promise<AxiosResponse<Loan>>;
  updateLoan: (id: number, data: { status: 'pending' | 'approved' | 'declined' }) => Promise<AxiosResponse>;
  createRepayment: (data: {
    customer_id: number;
    reservation_id: number;
    amount: number;
    complaint?: string | null;
  }) => Promise<AxiosResponse>;
}

export const apiService: ApiService = {
  login: (data) => apiClient.post<AuthResponse>('/auth/login', data),
  register: (data) => apiClient.post('/auth/register', data),
  getAdminDashboardData: () => apiClient.get<DashboardData>('/admin/dashboard'),
  getUserDashboardData: () => apiClient.get<DashboardData>('/user/dashboard'),
  getLoanTypes: () => apiClient.get<LoanType[]>('/room_types'),
  getCustomers: () => apiClient.get<Customer[]>('/customers'),
  getLoans: () => apiClient.get<Loan[]>('/reservations'),
  createLoan: (data) => apiClient.post<Loan>('/reservations', data),
  updateLoan: (id, data) => apiClient.put(`/admin/reservations/${id}`, data),
  createRepayment: (data) => apiClient.post('/repayments', data),
};

export default apiService;