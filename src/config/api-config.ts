// src/config/api-config.ts
const API_CONFIG = {
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    DASHBOARD: '/api/dashboard',
    CUSTOMERS: '/api/customers',
    CUSTOMER_DELETE: (id: number) => `/api/customers/${id}`,
    LOAN_TYPES: '/api/loan_types',
    LOANS: '/api/reservations',
    LOAN_DETAIL: (id: number) => `/api/reservations/${id}`,
    LOAN_UPDATE: (id: number) => `/api/reservations/${id}`,
    REPAYMENTS: '/api/repayments',
    REPAYMENT_UPDATE: (id: number) => `/api/repayments/${id}`,
    
  },
};

export default API_CONFIG;